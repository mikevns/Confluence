/**
 * @module confluence/blogpost-move-dialog
 */
define('confluence/blogpost-move-dialog', [
    'ajs',
    'jquery',
    'confluence/legacy',
    'confluence/meta',
    'confluence/templates',
    'confluence/api/ajax',
    'confluence/api/event',
    'confluence/api/logger',
    'confluence/message-controller',
    'confluence/form-state-control',
    'wrm/context-path'
], function(
    AJS,
    $,
    Confluence,
    Meta,
    Templates,
    SafeAjax,
    Event,
    logger,
    MessageController,
    FormStateControl,
    contextPath
) {
    'use strict';

    var dialogWidth = 400;
    var dialogHeight = 250;

    function viewBlogPostMoveHandler(dialog, newSpaceKey, errorHandler) {
        var $moveBlogpostDialog = $('#move-blogpost-dialog');
        $moveBlogpostDialog.find('.move-errors').empty();
        $('.button-spinner').spin();
        var moveButton = $('.move-button')[0];
        var cancelButton = $moveBlogpostDialog.find('.button-panel-cancel-link')[0];
        FormStateControl.disableElement([moveButton, cancelButton]);

        function error(message) {
            errorHandler(message);
            FormStateControl.enableElement([moveButton, cancelButton]);
            $('.button-spinner').spinStop();
        }

        function sendAnalytics(eventName) {
            Event.trigger('analyticsEvent', { name: eventName, data: { newSpaceKey: newSpaceKey, oldSpaceKey: AJS.params.spaceKey, blogPostId: AJS.params.pageId } });
        }

        if (newSpaceKey === '') {
            error(AJS.I18n.getText('move.blogpost.dialog.no.space.selected'));
            return;
        }

        SafeAjax.ajax({
            url: contextPath() + '/pages/moveblogpost.action',
            type: 'POST',
            dataType: 'json',
            timeout: 180000,
            data: {
                blogPostId: AJS.params.pageId,
                spaceKey: newSpaceKey
            },
            error: function(xhr) {
                error(MessageController.parseError(xhr, AJS.I18n.getText('move.blogpost.dialog.move.failed')));

                sendAnalytics('moveblogpost.ajaxError');
            },
            success: function(data) {
                var errors = [].concat(data.validationErrors || []).concat(data.actionErrors || []).concat(data.errorMessage || []);
                if (errors.length > 0) {
                    error(errors[0]);
                    sendAnalytics('moveblogpost.serverValidationError');
                    return;
                }
                sendAnalytics('moveblogpost.success');
                window.location.href = contextPath() + data.blogPost.url + (data.blogPost.url.indexOf('?') >= 0 ? '&' : '?') + 'moved=true';
            }
        });
    }

    function MoveBlogPostDialog(opts) {
        var options = $.extend({
            spaceKey: Meta.get('space-key'),
            spaceName: Meta.get('space-name'),
            title: AJS.I18n.getText('move.blogpost.dialog.title'),
            buttonName: AJS.I18n.getText('move.name'),
            moveHandler: function(dialog) {
                logger.debug('No move handler defined. Closing dialog.');
                dialog.remove();
            },
            cancelHandler: function(dialog) {
                dialog.remove();
                return false;
            }
        }, opts);

        var dialog = AJS.ConfluenceDialog({
            width: dialogWidth,
            height: dialogHeight,
            id: 'move-blogpost-dialog'
        });

        dialog.addHeader(options.title);
        // TODO can't find in a properties file anywhere
        // eslint-disable-next-line atlassian-wrm-i18n/matching-i18n-key-in-properties-file
        dialog.addPanel(AJS.I18n.getText('move.blogpost.dialog.panel.title'), Templates.MoveBlogPost.dialogPanel(), 'move-blogpost-dialog-panel', 'move-blogpost-dialog-panel-id');

        $('#new-space').auiSelect2(Confluence.UI.Components.SpacePicker.build());

        var moveFunction = function(dialog) {
            var newSpaceKey = $('#new-space').val();
            options.moveHandler(dialog, newSpaceKey, errorHandler);
        };

        function errorHandler(error) {
            $('#move-blogpost-dialog .move-errors').empty();
            AJS.messages.error('#move-blogpost-dialog .move-errors', {
                body: error,
                closeable: false
            });
        }

        dialog.addButton(options.buttonName, moveFunction, 'move-button aui-button aui-button-primary');
        $('.button-panel-button.move-button').attr('id', 'move-button');
        dialog.addCancel(AJS.I18n.getText('cancel.name'), options.cancelHandler);

        dialog.popup.element.find('.dialog-button-panel').prepend('<div class=\'button-spinner\'>&nbsp;</div>');

        dialog.show();
        return dialog;
    }

    return {
        control: MoveBlogPostDialog,
        initialiser: function(e) {
            e.preventDefault();

            if ($('#move-blogpost-dialog').length > 0) {
                $('#move-blogpost-dialog, body > .shadow, body > .aui-blanket').remove();
            }

            new MoveBlogPostDialog({
                moveHandler: viewBlogPostMoveHandler
            });

            return false;
        }
    };
});

require('confluence/module-exporter').safeRequire('confluence/blogpost-move-dialog', function(MoveBlogPostDialog) {
    'use strict';

    var Event = require('confluence/api/event');
    require('confluence/legacy').MoveBlogPostDialog = MoveBlogPostDialog.control;
    Event.bind('deferred.blog-move.tools-menu.click', MoveBlogPostDialog.initialiser);
    // Need to fire this event to let deferred-dialog-loader know
    Event.trigger('blogpost.move.dialog.ready');
});
