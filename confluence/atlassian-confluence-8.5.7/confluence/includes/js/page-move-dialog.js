/**
 * @module confluence/page-move-dialog
 * @tainted aui
 */
define('confluence/page-move-dialog', [
    'ajs',
    'confluence/templates',
    'confluence/legacy',
    'confluence/meta',
    'window',
    'jquery',
    'confluence/breadcrumbs',
    'wrm',
    'wrm/context-path',
    'confluence/message-controller',
    'confluence/form-state-control',
    'confluence/api/ajax',
    'confluence/api/event'
], function(
    AJS,
    Templates,
    Confluence,
    Meta,
    window,
    $,
    EditorBreadcrumbs,
    WRM,
    contextPath,
    MessageController,
    FormStateControl,
    SafeAjax,
    Event
) {
    'use strict';

    return function() {
        var MovePageMode = {
            LEGACY: 'LEGACY', // instruct the backend to execute the request synchronously in the same thread
            ASYNC: 'ASYNC' // instruct the backend to execute the request in a long-running task
        };
        var dialogWidth = 840;
        var dialogHeight = 590;

        var isEditorAjaxSaveEnabled = AJS.DarkFeatures.isEnabled('editor.ajax.save') && !AJS.DarkFeatures.isEnabled('editor.ajax.save.disable');
        var LONG_TASK_REST_ENDPOINT = '/rest/api/longtask/<taskId>';
        var REGULAR_PROGRESS_POLL_INTERVAL = 500;
        var QUICK_PROGRESS_POLL_INTERVAL = 100;


        var MovePageDialog = function(options) {
            var pageTitle = Meta.get('page-title');
            options = $.extend({
                spaceKey: Meta.get('space-key'),
                spaceName: Meta.get('space-name'),
                pageTitle: pageTitle,
                parentPageTitle: Meta.get('parent-page-title'),
                title: AJS.I18n.getText('move.page.dialog.title.view', pageTitle), // "Move Page - 'Title'
                buttonName: AJS.I18n.getText('move.name'),
                openedPanel: AJS.I18n.getText('move.page.dialog.panel.location'), // Ideally this would be the Browse panel, however due to performance reasons we can't do this
                moveHandler: function(dialog) {
                    AJS.debug('No move handler defined. Closing dialog.');
                    dialog.remove();
                },
                cancelHandler: function(dialog) {
                    dialog.remove();
                    return false;
                }
            }, options);

            var newSpaceKey = options.spaceKey;
            var newSpaceName = options.spaceName;
            var newParentPage = options.parentPageTitle;

            var reorderTargetId = '';
            var reorderTargetPosition = '';

            // called when the ordering of a page is set beneath a parent.
            var reorder = function(targetId, positionIndicator) {
                reorderTargetId = targetId;
                reorderTargetPosition = positionIndicator;
            };

            var structure = AJS.ConfluenceDialog({
                width: dialogWidth,
                height: dialogHeight,
                id: 'move-page-dialog'
            });

            var templateVars = {
                spaceKey: newSpaceKey,
                spaceName: newSpaceName,
                parentPageTitle: newParentPage,
                canMoveBetweenSpaces: Meta.get('page-id') === '0' || Meta.getBoolean('can-remove-page'), // remember that you move between drafts
                canMoveHierarchyBetweenSpaces: Meta.get('page-id') === '0' || Meta.getBoolean('can-remove-page-hierarchy') // remove hierarchy permission
            };

            structure.addHeader(options.title);
            structure.addPanel(AJS.I18n.getText('move.page.dialog.panel.location'), Templates.MovePage.movePageAdvancedPanel(templateVars), 'location-panel', 'location-panel-id');
            structure.addPanel(AJS.I18n.getText('move.page.dialog.search.title'), Templates.MovePage.movePageSearchPanel(templateVars), 'search-panel', 'search-panel-id');
            structure.addPanel(AJS.I18n.getText('move.page.dialog.history.title'), Templates.MovePage.historyPanel({ pageTitle: Meta.get('page-title') }), 'history-panel', 'history-panel-id');
            structure.addPanel(AJS.I18n.getText('move.page.dialog.browse.title'), Templates.MovePage.browsePanel({ pageTitle: Meta.get('page-title') }), 'browse-panel', 'browse-panel-id');

            // panel switching logic

            structure.get('#"' + AJS.I18n.getText('move.page.dialog.panel.location') + '"')[0].onselect = function() {
                $('#new-space-key').val(newSpaceKey);
                $('#new-space').val(newSpaceName);
                $('#new-parent-page').val(newParentPage).select();
            };
            structure.get('#"' + AJS.I18n.getText('move.page.dialog.search.title') + '"')[0].onselect = function() {
                // always clear out the previous selection
                var $movePageDialog = $('#move-page-dialog');
                $movePageDialog.find('.search-panel .search-results .selected').removeClass('selected');
                $movePageDialog.find('input.search-query').focus();
            };
            structure.get('#"' + AJS.I18n.getText('move.page.dialog.history.title') + '"')[0].onselect = function() {
                // refresh the history panel every time it loads, in case the user has navigated elsewhere in another tab
                $('.history-panel', dialog).movePageHistory(controls);
            };
            structure.get('#"' + AJS.I18n.getText('move.page.dialog.browse.title') + '"')[0].onselect = function() {
                // always refresh the tree when loading the Browse tab, don't load it initially
                AJS.debug('browse: ' + [newSpaceKey, newSpaceName, newParentPage].join());
                $('.browse-panel', dialog).movePageBrowse(controls, newSpaceKey, newSpaceName, newParentPage, originalParent, options.pageTitle);
            };

            var gotoReorderPage = function(dialog) {
                dialog.nextPage();
                var dialogDom = $('#move-page-dialog');
                $('.ordering-panel', dialogDom).movePageOrdering(newSpaceKey, newParentPage, options.pageTitle, reorder);
            };

            var moveFunction = function(dialog) {
                var space = $('#new-space:visible').val();
                var spaceKey = $('#new-space-key').val();
                var parentPage = $('#new-parent-page:visible').val();
                if (space && (space !== newSpaceName || spaceKey !== newSpaceKey || parentPage !== newParentPage)) {
                    Confluence.Dialogs.Breadcrumbs.defaultGetBreadcrumbs({
                        spaceKey: spaceKey,
                        pageTitle: parentPage
                    }, function() {
                        Confluence.PageLocation.set({
                            spaceKey: spaceKey,
                            spaceName: space,
                            parentPageTitle: parentPage
                        });
                        options.moveHandler(dialog, spaceKey, space, parentPage, reorderTargetId, reorderTargetPosition, setErrors);
                    }, function(xhr) {
                        $('#new-parent-breadcrumbs').html(Templates.MovePage.breadcrumbError());
                        if (xhr.status === 404) {
                            controls.error(AJS.I18n.getText('move.page.dialog.location.not.found'));
                        }
                    });
                } else {
                    Confluence.PageLocation.set({
                        spaceKey: newSpaceKey,
                        spaceName: newSpaceName,
                        parentPageTitle: newParentPage
                    });
                    options.moveHandler(dialog, newSpaceKey, newSpaceName, newParentPage, reorderTargetId, reorderTargetPosition, setErrors);
                }
            };

            // Decide whether to execute the move or goto the re-order page instead.
            var executeMove = function(dialog) {
                if ($('#createpageform').length > 0
                        && AJS.DarkFeatures.isEnabled('editor.ajax.save') && !AJS.DarkFeatures.isEnabled('editor.ajax.save.disable')) {
                    moveFunction(dialog);
                } else if ($('#reorderCheck')[0].checked) {
                    gotoReorderPage(dialog);
                } else {
                    moveFunction(dialog);
                }
            };

            structure.addButton(options.buttonName, executeMove, 'move-button aui-button aui-button-primary');
            $('.button-panel-button.move-button').attr('id', 'move-button');
            structure.addCancel(AJS.I18n.getText('cancel.name'), options.cancelHandler);
            // CONFDEV-12853: Add help link via prepend() instead of append() to prevent FF display issue
            structure.popup.element.find('.dialog-title').prepend(Templates.MovePage.helpLink());

            // Add the ordering page
            if ($('#createpageform').length > 0) {
                if (!isEditorAjaxSaveEnabled) {
                    structure.addPage()
                        .addHeader(options.title)
                        .addPanel(AJS.I18n.getText('move.page.dialog.ordering.title'), Templates.MovePage.orderingPagePanel(), 'ordering-panel', 'ordering-panel-id')
                        .addLink(AJS.I18n.getText('move.page.dialog.back.button'), function(dialog) { dialog.prevPage(); }, 'dialog-back-link')
                        .addButton(AJS.I18n.getText('move.page.dialog.order.button'), moveFunction, 'reorder-button')
                        .addCancel(AJS.I18n.getText('cancel.name'), options.cancelHandler);
                }
            } else {
                structure.addPage()
                    .addHeader(options.title)
                    .addPanel(AJS.I18n.getText('move.page.dialog.ordering.title'), Templates.MovePage.orderingPagePanel(), 'ordering-panel', 'ordering-panel-id')
                    .addLink(AJS.I18n.getText('move.page.dialog.back.button'), function(dialog) { dialog.prevPage(); }, 'dialog-back-link')
                    .addButton(AJS.I18n.getText('move.page.dialog.order.button'), moveFunction, 'reorder-button')
                    .addCancel(AJS.I18n.getText('cancel.name'), options.cancelHandler);
            }

            var moveButton = structure.get('button#' + options.buttonName)[0].item;

            if ($('#createpageform').length > 0 && isEditorAjaxSaveEnabled) {
                // Reordering is not possible when using the Content API (reliable-save)
                $('button.move-button').before(Templates.MovePage.spinnerButton());
            } else {
                $('button.move-button').before(Templates.MovePage.reorderCheckbox());
                $('button.reorder-button').before(Templates.MovePage.spinnerButton());
                $('#reorderRequirement').before(Templates.MovePage.spinnerButton());
            }

            structure.gotoPage(0);

            // The concept of the location panel does not fit into AUI's dialog, which applies inline styling to the panel bodies.
            var dialog = $('#move-page-dialog');
            var dialogPageMenus = dialog.find('.dialog-page-menu');
            var dialogPageBodies = dialog.find('.dialog-page-body');
            dialog.find('.button-spinner').before(Templates.MovePage.statusMessage());

            // first page (move) dimensions
            var firstPageMenu = $(dialogPageMenus[0]);
            var firstPageBody = $(dialogPageBodies[0]);

            firstPageBody.height(firstPageMenu.outerHeight());
            firstPageBody.width('75%');

            // second page (reorder) dimensions
            var secondPageMenu = $(dialogPageMenus[1]);
            var secondPageBody = $(dialogPageBodies[1]);

            secondPageMenu.width('0');
            secondPageBody.width('100%');

            structure.show();

            // move breadcrumbs to the bottom of all pages on the first page of the dialog (location selection page)
            $('.location-panel .location-info', dialog).appendTo($('.dialog-page-body:first', dialog));

            var breadcrumbs = new Confluence.Dialogs.Breadcrumbs.Controller($('#new-parent-breadcrumbs'));

            function setErrors(errors) {
                var errorsContainer = $('#move-errors');
                if (errorsContainer.length > 0) {
                    errorsContainer.remove();
                }
                errorsContainer = $(Templates.MovePage.errorMessage());

                var container = dialog.find('.browse-controls:visible');
                if (!container.length) {
                    container = dialog.find('.dialog-panel-body:visible');
                    container.prepend(errorsContainer);
                } else {
                    container.append(errorsContainer);
                }

                if (!errors || errors.length === 0) {
                    $(moveButton).prop('disabled', false);
                    return;
                }

                var errorMessageText;

                if ($.isArray(errors) && errors.length > 1) {
                    errorMessageText = Templates.MovePage.errorList({ errors: errors });
                } else {
                    errorMessageText = errors;
                }

                var errorMessage = aui.message.error({ content: errorMessageText });
                errorsContainer.html(errorMessage);
                errorsContainer.removeClass('hidden');
            }

            var controls = {
                moveButton: moveButton,
                clearErrors: function() {
                    setErrors([]);
                },
                error: setErrors,

                // called when a destination is selected on one of the panels
                select: function(spaceKey, spaceName, parentPageTitle, parentPageId) {
                    AJS.debug('select: ' + [spaceKey, spaceName, parentPageTitle].join());

                    if ($('#createpageform').length > 0 && isEditorAjaxSaveEnabled) {
                        if (typeof parentPageId !== 'undefined') {
                            $('#parentPageId').val(parentPageId);
                        }
                    }

                    newSpaceKey = spaceKey;
                    newSpaceName = spaceName;
                    newParentPage = parentPageTitle || '';

                    $(moveButton).prop('disabled', true); // disable submission until the location is validated
                    breadcrumbs.update({ spaceKey: newSpaceKey, title: newParentPage }, controls);
                }
            };
            structure.overrideLastTab();
            structure.get('#"' + options.openedPanel + '"').select();

            // render the current breadcrumbs immediately
            var originalParent = Meta.get('parent-page-title') || Meta.get('from-page-title');
            var currentBreadcrumbs = new Confluence.Dialogs.Breadcrumbs.Controller($('#current-parent-breadcrumbs'));
            // Render breadcrumbs with the new parent page if possible, otherwise default to the old one.
            currentBreadcrumbs.update({ spaceKey: Meta.get('space-key'), title: newParentPage || originalParent }, controls);

            $('.location-panel', dialog).movePageLocation(controls);
            $('.search-panel', dialog).movePageSearch(controls);
            $('.history-panel', dialog).movePageHistory(controls);


            $('#new-parent-page').select(); // focus the new parent page input
            if (options.hint) {
                structure.addHelpText(options.hint.template || options.hint.text, options.hint.arguments);
            }
            WRM.require('wr!com.atlassian.confluence.plugins.confluence-page-restrictions-dialog:dialog-resources');
            return dialog;
        };

        var MovePageParams = function(spaceKey, pageTitle, siblingId, siblingRelativePosition, mode) {
            var params = {
                // Try page-id if no content-id as for view mode it is only set by the editor preload action (which may fail) until CONFDEV-41174 is tackled
                pageId: Meta.get('content-id') || Meta.get('page-id'),
                spaceKey: spaceKey
            };

            if (siblingId) {
                params.position = siblingRelativePosition; // may be above or below
                params.targetId = siblingId;
            } else if (pageTitle !== '') {
                params.targetTitle = pageTitle;
                params.position = 'append';
            } else {
                params.position = 'topLevel';
            }

            params.mode = mode;
            return params;
        };

        function startButtonSpinner() {
            var $movePageDialog = $('#move-page-dialog');
            $movePageDialog.find('.button-spinner').each(function(i, val) { $(val).spin(); });
            FormStateControl.disableElement($movePageDialog.find('.move-button')[0]);
        }

        function stopButtonSpinner() {
            var $movePageDialog = $('#move-page-dialog');
            $movePageDialog.find('.button-spinner').each(function(i, val) { $(val).spinStop(); });
            FormStateControl.enableElement($movePageDialog.find('.move-button')[0]);
        }

        function viewPageMoveHandler(dialog, newSpaceKey, newSpaceName, newParentPage, newSiblingId, newSiblingPosition, setErrors) {
            var $movePageDialog = $('#move-page-dialog');
            var moveButton = $movePageDialog.find('.move-button')[0];
            var reorderButton = $movePageDialog.find('button.reorder-button')[0];
            var cancelButton = $movePageDialog.find('.button-panel-cancel-link')[0];
            var backButton = $movePageDialog.find('.dialog-back-link')[0];
            var reorderCheck = $movePageDialog.find('#reorderCheck')[0];
            var timeout;
            var timesPolled = 0;
            var longTaskId;
            var page;
            $('#move-errors').remove();
            startButtonSpinner();

            FormStateControl.disableElement(moveButton);
            if ($('#createpageform').length > 0) {
                if (!isEditorAjaxSaveEnabled) {
                    FormStateControl.disableElement([reorderButton, cancelButton, backButton, reorderCheck]);
                }
            } else {
                FormStateControl.disableElement([reorderButton, cancelButton, backButton, reorderCheck]);
            }

            function error(messages) {
                setErrors(messages);
                FormStateControl.enableElement([moveButton, reorderButton, cancelButton, backButton, reorderCheck]);
                stopButtonSpinner();
            }

            function getMessages(data) {
                if (data.messages && data.messages.length) {
                    try {
                        return data.messages[data.messages.length - 1].translation;
                    } catch (e) {
                        return '';
                    }
                }
                return '';
            }

            function updateStatusMessage(status) {
                $('#move-page-dialog .status').html(status);
            }

            function pollLongRunningTask() {
                $.ajax({
                    url: contextPath() + LONG_TASK_REST_ENDPOINT.replace('<taskId>', longTaskId)
                }).fail(function() {
                    clearTimeout(timeout);
                    error();
                }).done(function(data) {
                    // data is JSON form of LongRunningTask object
                    updateStatusMessage(Math.round(data.elapsedTime / 1000.0) + 's');
                    if (!data.successful) {
                        clearTimeout(timeout);
                        error(getMessages(data));
                        return;
                    }
                    if (+data.percentageComplete >= 100) {
                        clearTimeout(timeout);
                        if (!data.successful) {
                            error(getMessages(data));
                        } else {
                            window.location.href = contextPath() + '/pages/viewpage.action?pageId=' + page.id + '&moved=true';
                        }
                        return;
                    }
                    timeout = setTimeout(pollLongRunningTask, timesPolled++ < 5 ? QUICK_PROGRESS_POLL_INTERVAL : REGULAR_PROGRESS_POLL_INTERVAL);
                });
            }

            SafeAjax.ajax({
                url: contextPath() + '/pages/movepage.action',
                type: 'POST',
                dataType: 'json',
                timeout: 180000,
                data: new MovePageParams(newSpaceKey, newParentPage, newSiblingId, newSiblingPosition, MovePageMode.ASYNC),
                error: function(jqXhr) {
                    error(MessageController.parseError(jqXhr, AJS.I18n.getText('move.page.dialog.move.failed')));
                },
                success: function(data) {
                    var errors = [].concat(data.validationErrors || []).concat(data.actionErrors || []).concat(data.errorMessage || []);
                    if (errors.length > 0) {
                        error(errors);
                        return;
                    }
                    longTaskId = data.longTaskId;
                    page = data.page;
                    pollLongRunningTask();
                }
            });
        }

        Event.bind('deferred.page-move.tools-menu', function(e) {
            e.preventDefault();

            if ($('#move-page-dialog').length > 0) {
                $('#move-page-dialog, body > .shadow, body > .aui-blanket').remove();
            }

            new MovePageDialog({
                moveHandler: viewPageMoveHandler
            });

            return false;
        });

        var currentSpaceName; // space names aren't stored in hidden fields, so store it in a variable

        Event.bind('deferred.page-move.editor', function(e) {
            e.preventDefault();

            if ($('#move-page-dialog').length > 0) {
                $('#move-page-dialog, body > .shadow, body > .aui-blanket').remove();
            }
            new MovePageDialog({
                spaceName: currentSpaceName,
                spaceKey: $('#newSpaceKey').val(),
                pageTitle: $('#content-title').val(),
                parentPageTitle: $('#parentPageString').val(),
                buttonName: AJS.I18n.getText('move.name'),
                title: AJS.I18n.getText('move.page.dialog.title.edit'),
                moveHandler: function(dialog, newSpaceKey, newSpaceName, newParentPage, targetId, newPositionIndicator, setErrors) {
                    function setHiddenInputFields() {
                        // TODO: AJAX validation, should use setErrors
                        currentSpaceName = newSpaceName;
                        $('#newSpaceKey').val(newSpaceKey);
                        $('#parentPageString').val(newParentPage);
                        if (newParentPage !== '') {
                            $('#position').val('append');
                        } else {
                            $('#position').val('topLevel');
                        }

                        if ($('#createpageform').length > 0 && isEditorAjaxSaveEnabled) {
                            var $parentPageId = $('#parentPageId');
                            if ((typeof $parentPageId !== 'undefined') && (typeof $parentPageId.val() !== 'undefined')) {
                                Meta.set('parent-page-id', $parentPageId.val());
                            }
                            if (typeof newSpaceKey !== 'undefined') {
                                Meta.set('space-key', newSpaceKey);
                            }
                        }

                        // If explicit position has been set then override the positions that may have been set up
                        if (targetId) {
                            $('#targetId').val(targetId);
                            $('#position').val(newPositionIndicator);
                        }
                    }

                    var isSharedDraftsEnabled = Meta.get('shared-drafts');
                    if (isSharedDraftsEnabled) {
                        startButtonSpinner();

                        SafeAjax.ajax({
                            url: contextPath() + '/pages/movepage.action',
                            type: 'POST',
                            dataType: 'json',
                            data: new MovePageParams(newSpaceKey, newParentPage, targetId, newPositionIndicator, MovePageMode.LEGACY),
                            error: function(jqXhr) {
                                stopButtonSpinner();
                                setErrors(MessageController.parseError(jqXhr, AJS.I18n.getText('move.page.dialog.move.failed')));
                            },
                            success: function(data) {
                                stopButtonSpinner();
                                var errors = [].concat(data.validationErrors || []).concat(data.actionErrors || []).concat(data.errorMessage || []);
                                if (errors.length > 0) {
                                    setErrors(errors);
                                    return;
                                }

                                setHiddenInputFields();
                                dialog.remove();
                                EditorBreadcrumbs.update(newSpaceKey, newParentPage);
                                Event.trigger('editor-page-moved');
                            }
                        });
                    } else {
                        setHiddenInputFields();
                        dialog.remove();
                        EditorBreadcrumbs.update(newSpaceKey, newParentPage);
                        Event.trigger('editor-page-moved');
                    }
                }
            });

            return false;
        });

        // Need to fire this event to let deferred-dialog-loader know
        Event.trigger('page.move.dialog.ready');

        return MovePageDialog;
    };
});

require('confluence/module-exporter').safeRequire('confluence/page-move-dialog', function(PageMoveDialog) {
    'use strict';

    var Confluence = require('confluence/legacy');

    require('ajs').toInit(function() {
        Confluence.MovePageDialog = PageMoveDialog();
    });
});
