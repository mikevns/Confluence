/**
 * @module confluence/deferred-dialog-loader
 */
define('confluence/deferred-dialog-loader', [
    'underscore',
    'jquery',
    'ajs',
    'confluence/page-loading-indicator',
    'confluence/api/event'
], function(
    _,
    $,
    AJS,
    PageLoadingIndicator,
    event
) {
    'use strict';

    return function() {
        var deferredDialogs = {
            movePageDialogTools: {
                resource: 'confluence.web.resources:page-move-resources',
                selector: '#action-move-page-dialog-link',
                event: 'deferred.page-move.tools-menu'
            },
            movePageDialogEditor: {
                resource: 'confluence.web.resources:page-move-resources',
                selector: '#rte-button-location',
                event: 'deferred.page-move.editor'
            },
            moveBlogDialogTools: {
                resource: 'confluence.web.resources:page-move-resources',
                selector: '#action-move-blogpost-dialog-link',
                event: 'deferred.blog-move.tools-menu'
            },
            availableGadgetsHelp: {
                resource: 'com.atlassian.confluence.plugins.gadgets:gadget-directory-resources',
                selector: '#gadget-directory-link',
                event: 'deferred.available-gadgets.help-menu'
            },
            aboutConfluenceHelp: {
                resource: 'confluence.web.resources:about',
                selector: '#confluence-about-link',
                event: 'deferred.about-confluence.help-menu'
            }
        };

        var loadingIndicator = PageLoadingIndicator($('body'));
        var deferEvent;
        var isPageMoveReady = false;
        var isBlogpostMoveReady = false;

        // Fire event if dialog is loaded in the browser
        // With this solution I assume that we only could open 1 Move Page Dialog at a time
        var replayAllEvent = function() {
            if (!isPageMoveReady || !isBlogpostMoveReady) {
                // wait until both condition are come to replay event
                return;
            }

            if (deferEvent) {
                event.trigger(deferEvent);
                deferEvent = undefined;
            }
        };

        event.bind('page.move.dialog.ready', function() {
            isPageMoveReady = true;
            replayAllEvent();
        });

        event.bind('blogpost.move.dialog.ready', function() {
            isBlogpostMoveReady = true;
            replayAllEvent();
        });

        _.each(deferredDialogs, function(dialog) {
            $('body').on('click', dialog.selector, function(e) {
                var eventName = dialog.resource + '.requested';
                var promise = WRM.require('wr!' + dialog.resource);

                function onSuccessfullyLoaded() {
                    if (dialog.resource !== 'confluence.web.resources:page-move-resources') {
                        // we only allow to replay event for move page dialog only
                        event.trigger(dialog.event);
                        return;
                    }

                    if (isPageMoveReady && isBlogpostMoveReady) {
                        // don't need to replay all resource are ready
                        event.trigger(dialog.event);
                        return;
                    }

                    // Just capture and defer fired event until dialog is ready
                    deferEvent = dialog.event;
                }

                promise.then(onSuccessfullyLoaded);
                loadingIndicator.showUntilDialogVisible(promise);

                // Send an analytics event.
                AJS.Analytics
                    ? AJS.Analytics.triggerPrivacyPolicySafeEvent(eventName)
                    : event.trigger('analyticsEvent', { name: eventName });

                e.preventDefault();
            });
        });
    };
});

require('confluence/module-exporter').safeRequire('confluence/deferred-dialog-loader', function(DeferredDialogLoader) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(DeferredDialogLoader);
});
