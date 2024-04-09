/**
 * @module confluence/dialog
 */
define('confluence/dialog', [
    'ajs',
    'document',
    'jquery'
], function(
    AJS,
    document,
    $
) {
    'use strict';

    /**
     * Provides Confluence-specific overrides of AJS.Dialog defaults
     */
    function ConfluenceDialog(options) {
        var dialog;
        options = options || {};
        options = $.extend({}, {
            // This is actually on keydown in AJS.popup.
            keypressListener: function(e) {
                if (e.keyCode === 27) {
                    AJS.debug('dialog.js: escape keydown caught');
                    // if dropdown is currently showing, leave the dialog and let the dropdown close itself
                    if (!$('.aui-dropdown', dialog.popup.element).is(':visible')) {
                        if (typeof options.onCancel === 'function') {
                            options.onCancel();
                        } else {
                            dialog.hide();
                        }
                    }
                } else if (e.keyCode === 13) {
                    // Enter key pressed
                    AJS.debug('dialog.js: enter keydown caught');
                    if (!$('.aui-dropdown', dialog.popup.element).is(':visible')) {
                        // No dropdown showing - enter is on dialog.
                        var nodeName = e.target.nodeName && e.target.nodeName.toLowerCase();
                        if (nodeName !== 'textarea' && typeof options.onSubmit === 'function') {
                            // Run the submit after waiting for the current event thread to complete.
                            // This ensures that keypress and keyup events for the Enter key are handled before onSubmit
                            // is run.
                            setTimeout(options.onSubmit);
                        }
                    }
                }
            },
            width: 865, // this is the standard large size dialog width TODO - ask Richard.
            height: 530
        }, options);
        dialog = new AJS.Dialog(options);

        $(document).bind('hideLayer', function(e, type, eventDialog) {
            if (type === 'popup' && eventDialog === dialog) {
                if (typeof options.onCancel === 'function') {
                    options.onCancel();
                }
            }
        });

        return dialog;
    }

    function initialiser($) {
        // Sends events to the server for all dialogs we show
        AJS.bind('show.dialog', function(e, data) {
            var pageid = AJS.Meta.get('page-id');
            var spacekey = AJS.Meta.get('space-key');
            var editormode = AJS.Meta.get('editor-mode');
            var newpage = AJS.Meta.get('new-page');
            /**
             * Gets interesting AJS.Meta values, if they're set.
             * @return properties the properties to send.
             */
            var getMetadata = function() {
                var properties = {};
                if (pageid) { properties.pageid = pageid; }
                if (spacekey) { properties.spacekey = spacekey; }
                if (editormode) { properties.editormode = editormode; }
                if (newpage) { properties.newpage = newpage; }
                return properties;
            };

            AJS.EventQueue = AJS.EventQueue || [];
            AJS.EventQueue.push({ name: data.dialog.id, properties: getMetadata() });

            // add aria attributes
            data.dialog.popup.element.find('.dialog-title').attr('id', 'dialog-title');
            data.dialog.popup.element.attr('aria-labeledby', 'dialog-title');
            data.dialog.popup.element.attr('role', 'dialog');
            data.dialog.popup.element.attr('aria-modal', true);
            data.dialog.popup.element.attr('aria-hidden', false);

            data.dialog.popup.element.find('.dialog-components').attr('tabindex', '0');

            // eslint-disable-next-line vars-on-top
            var capture = data.dialog.popup.element;
            capture.find('input[type=hidden]').attr('tabindex', '-1');
            capture.find('.hidden').attr('tabindex', '-1');

            // eslint-disable-next-line vars-on-top
            var tabbable = $()
                .add(capture.find('button, input:not([type="hidden"]):visible, select:visible, textarea'))
                .add(capture.find('[href]:not([tabindex="-1"])'))
                .add(capture.find('[role="button"]'))
                .add(capture.find('[tabindex]:not([tabindex="-1"])'));
            capture.focus()
                .keydown(
                    function(event) {
                        if (event.key !== 'Tab') {
                            return;
                        }
                        // eslint-disable-next-line vars-on-top
                        var target = $(event.target);
                        if (event.shiftKey) {
                            if (target.is(capture) || target.is(tabbable.first())) {
                                event.preventDefault();
                                tabbable.last().focus();
                            }
                        } else if (target.is(tabbable.last())) {
                            event.preventDefault();
                            tabbable.first().focus();
                        }
                    });
        });

        var rememberLastDialogTab = function(dialogElement) {
            var $dialog = $(dialogElement);
            var defaultTab;

            if ($dialog.attr('data-lasttab-override')) {
                return; // skip last tab cause it wants to be special
            }

            if ($dialog.attr('data-tab-default')) {
                defaultTab = $dialog.attr('data-tab-default');
            }

            // get the last clicked tab, if any
            var storage = Confluence.storageManager($dialog.attr('id'));
            var lastTab = storage.getItem('last-tab');
            var selectedTab = lastTab != null ? lastTab : defaultTab;

            if (selectedTab) {
                $('.page-menu-item:visible:eq(' + selectedTab + ') button', $dialog).click();
            }

            if (!$dialog.attr('data-lasttab-bound')) {
                $('.page-menu-item', $dialog).each(function(i, element) {
                    $(element).click(function() {
                        storage.setItem('last-tab', i);
                    });
                });
                $dialog.attr('data-lasttab-bound', 'true');
            }
        };

        $(document).bind('showLayer', function(e, name, dialog) {
            Confluence.runBinderComponents();
            if (name == 'popup' && dialog) {
                rememberLastDialogTab(dialog.element);
            }
        });

        /**
         * Prevent the dialog from opening in the last tab the user cliked on.
         * This method should be called before the dialog is shown and a
         * particular dialog tab needs to be selected/displayed.
         */
        AJS.Dialog.prototype.overrideLastTab = function() {
            $(this.popup.element).attr('data-lasttab-override', 'true');
        };

        // 3.5 - Move this into AUI if it proves useful
        /**
         * Add a tip in the bottom of the dialog.
         * @param template an html template with variables like {0}
         * @param args an array of 2 values or more (AJS.template doesn't replace it if there's only one)
         */
        AJS.Dialog.prototype.addHelpText = function(template, args) {
            if (!template) {
                // Don't do anything if there is no text to add.
                // This stops us printing 'undefined'.
                return;
            }

            var text = template;
            if (args) {
                text = AJS.template(template).fill(args).toString();
            }

            var page = this.page[this.curpage];
            if (!page.buttonpanel) {
                page.addButtonPanel();
            }

            // The text may include html i.e. links or strongs
            var tip = $('<div class=\'dialog-tip\'></div>').html(text);
            page.buttonpanel.append(tip);
            $('a', tip).click(function() {
                var windowOpened = window.open(this.href, '_blank');
                windowOpened.focus();
                windowOpened.opener = null;
                return false;
            });
        };

        /**
         * Returns the current title of this Dialog.
         */
        AJS.Dialog.prototype.getTitle = function() {
            return $('#' + this.id + ' .dialog-components:visible h2').text();
        };

        AJS.Dialog.prototype.isVisible = function() {
            return $('#' + this.id).is(':visible');
        };
    }

    return {
        component: ConfluenceDialog,
        initialiser: initialiser
    };
});

require('confluence/module-exporter').safeRequire('confluence/dialog', function(ConfluenceDialog) {
    'use strict';

    AJS.ConfluenceDialog = ConfluenceDialog.component;

    // Automatically bind our components when a dialog is shown
    AJS.toInit(ConfluenceDialog.initialiser);
});
