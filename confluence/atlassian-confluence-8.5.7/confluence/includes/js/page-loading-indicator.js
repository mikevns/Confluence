/**
 * @module confluence/page-loading-indicator
 */
define('confluence/page-loading-indicator', [
    'jquery',
    'underscore',
    'ajs',
    'confluence/templates'
], function(
    $,
    _,
    AJS,
    Templates
) {
    'use strict';

    function PageLoadingIndicator($section) {
        function getBlanket() {
            return $('.confluence-page-loading-blanket', $section);
        }

        function getIndicator() {
            return $('.confluence-loading-indicator', $section);
        }

        return {
            show: function() {
                if (getBlanket().length === 0) {
                    $($section).append(Templates.pageLoadingIndicator());
                }

                getBlanket().show();
                getIndicator().spin({
                    lines: 12, length: 8, width: 4, radius: 10, trail: 60, speed: 1.5, color: '#F0F0F0'
                });
            },

            hide: function() {
                getIndicator().stop();
                getBlanket().hide();
            },

            /**
             * Shows the spinner until the deferred is resolved or rejected.
             *
             * @param {Promise} promise a thenable object
             * @param errorMessage optional error message to display
             */
            showUntilResolved: function(promise, errorMessage) {
                var hide = this.hide.bind(this);
                this.show();
                // todo use Promise#finally when webdriver/CI gets upgraded to Firefox 58+
                promise.then(function() {
                    hide();
                }, function() {
                    if (errorMessage) {
                        AJS.messages.error('.confluence-page-loading-errors', {
                            body: errorMessage
                        });
                    }
                    hide();
                });
            },

            /**
             * This method specifically waits for a dialog to be visible before hiding the spinner.
             *
             * @param {Promise} promise a jquery deferred object
             * @param error optional error message to display
             */
            showUntilDialogVisible: function(promise, error) {
                var errorMessage = error || AJS.I18n.getText('dialog.deferred.error.loading');
                var hide = this.hide.bind(this);

                var visibleDialog = $('.aui-dialog:visible');
                var visibleDialog2 = $('.aui-dialog2:visible');

                if (!visibleDialog.length && !visibleDialog2.length) {
                    this.show();
                }

                // todo use Promise#finally when webdriver/CI gets upgraded to Firefox 58+
                promise.then(function() {
                    hide();
                }, function() {
                    AJS.messages.error('.confluence-page-loading-errors', {
                        body: errorMessage
                    });
                    hide();
                });

                // For dialog1
                AJS.bind('show.dialog', function hideLoadingIndicator() {
                    AJS.unbind('show.dialog', hideLoadingIndicator);
                    hide();
                });

                // For dialog2
                if (AJS.dialog2 != null && AJS.dialog2 != undefined) {
                    AJS.dialog2.on('show', function hideLoadingIndicator() {
                        AJS.dialog2.off('show', hideLoadingIndicator);
                        hide();
                    });
                }
            },

            destroy: function() {
                $section.remove('.confluence-page-loading-blanket');
            }
        };
    }

    return PageLoadingIndicator;
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/page-loading-indicator', 'Confluence.PageLoadingIndicator');
