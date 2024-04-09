/**
 * Behaviour for the Page History screen.
 * @module confluence/page-history
 */
define('confluence/page-history', [
    'jquery',
    'ajs'
], function(
    $,
    AJS
) {
    'use strict';

    return function() {
        /**
         * Returns the table row the click/mouseover/mouseout event came from.
         */
        var getTargetRow = function(e) {
            return $(e.target).closest('tr');
        };

        /**
         * Allow the user to check/uncheck the checkbox by clicking anywhere in the row.
         */
        var versionRowClick = function(e) {
            // Don't do anything if a link was clicked.
            if ($(e.target).is('a')) {
                return;
            }

            // Don't do anything if the list of collaborators are clicked
            if ($(e.target).hasClass('userLogo')
                || $(e.target).hasClass('additional-contributors-button')) {
                return;
            }

            var row = getTargetRow(e);
            var theCheckbox = row.find('input')[0];
            if (!theCheckbox) {
                return; // Ignore clicks in rows without checkboxes (e.g. the header)
            }

            // If user clicked on checkbox itself default handler will toggle it otherwise we do it here.
            if (e.target !== theCheckbox) {
                theCheckbox.checked = !theCheckbox.checked;
            }

            // Add a highlight to checked rows
            if (theCheckbox.checked) {
                // Only allow two boxes to be checked
                if ($('input:checked', this).length <= 2) {
                    row.addClass('page-history-item-selected');
                } else {
                    theCheckbox.checked = false;
                }
            } else {
                row.removeClass('page-history-item-selected');
            }
        };

        $('#page-history-container').click(versionRowClick);

        $('.remove-historical-version-trigger').click(function() {
            var $trigger = $(this);
            var dialog;
            var keypressListener = function(e) {
                if (dialog && e.keyCode === 27) {
                    dialog.remove();
                }
            };

            dialog = new AJS.Dialog({
                width: 400,
                height: 236,
                id: 'remove-historical-version-dialog',
                closeOnOutsideClick: false,
                keypressListener: keypressListener
            });

            dialog.addHeader(AJS.I18n.getText('remove.historical.version.confirm.remove.title'));
            dialog.addPanel(
                'SinglePanel',
                '<div>' + AJS.I18n.getText(
                    'remove.historical.version.confirm.remove.description',
                    $trigger.data('version'),
                    AJS.escapeHtml(AJS.Meta.get('page-title'))) + '</div>');

            dialog.addButton(AJS.I18n.getText('remove.name'), function() {
                $(this).prop('disabled', true);
                $.ajax({
                    type: 'GET',
                    url: AJS.contextPath() + '/rest/api/accessmode',
                    contentType: 'application/json',
                    dataType: 'json'
                }).done(function(accessMode) {
                    if (accessMode === 'READ_WRITE') {
                        $('#remove-historical-version-pageid').val($trigger.data('pageid'));
                        $('#remove-historical-version-form').submit();
                    } else {
                        var errorMessage = AJS.messages.error({
                            body: AJS.I18n.getText('read.only.mode.default.error.short.message'),
                            closeable: false
                        });
                        dialog.getCurrentPanel().html(errorMessage);
                    }
                });
            });
            dialog.addCancel(AJS.I18n.getText('close.name'), function() {
                dialog.remove();
                return false;
            });

            dialog.gotoPanel(0);
            dialog.show();

            return false;
        });
    };
});

require('confluence/module-exporter').safeRequire('confluence/page-history', function(PageHistory) {
    'use strict';

    require('ajs').toInit(PageHistory);
});
