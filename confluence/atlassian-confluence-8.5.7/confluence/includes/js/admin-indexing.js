/**
 * @module confluence/admin-indexing
 */
define('confluence/admin-indexing', [
    'jquery',
    'window',
    'confluence/api/ajax',
    'confluence/api/constants'
], function($,
    window,
    SafeAjax,
    CONSTANTS) {
    'use strict';

    /**
     * CONFSRVDEV-10157
     * Implementation comes from AUI@7.9.7: src/js/jquery/jquery.progressbar.js
     * We make it a private function instead of jquery plugin because:
     * - only this file is using it, no more usage
     * - we encourage people to use Progress indicators component from AUI
     * @param {jQuery} $progressBarContainer
     * @param {number} percentComplete
     * @param {object} options
     */
    var ProgressBar = function($progressBarContainer, percentComplete, options) {
        var defaults = {
            height: '1em',
            showPercentage: true
        };

        var opts = $.extend(defaults, options);

        var incompleteBarId = $progressBarContainer.attr('id') + '-incomplete-bar';
        var completeBarId = $progressBarContainer.attr('id') + '-complete-bar';
        var percentCompleteTextId = $progressBarContainer.attr('id') + '-percent-complete-text';
        var $incompleteBar;
        var $completeBar;
        var $percentCompleteText;

        if ($('#' + incompleteBarId).length === 0) {
            $incompleteBar = $(document.createElement('div'));
            $incompleteBar.attr('id', incompleteBarId);
            $incompleteBar.css({
                width: '90%', border: 'solid 1px #ccc', float: 'left', 'margin-right': '0.5em'
            });
            $incompleteBar.addClass('progress-background-color');

            $completeBar = $(document.createElement('div'));
            $completeBar.attr('id', completeBarId);
            $completeBar.addClass('progress-fill-color');
            $completeBar.css({ height: opts.height, width: percentComplete + '%' });

            $percentCompleteText = $(document.createElement('span'));
            $percentCompleteText.attr('id', percentCompleteTextId);
            $percentCompleteText.addClass('percent-complete-text');
            $percentCompleteText.html(percentComplete + '%');

            $incompleteBar.append($completeBar);
            $progressBarContainer.append($incompleteBar);

            if (opts.showPercentage) {
                $progressBarContainer.append($percentCompleteText);
            }
        } else {
            $('#' + completeBarId).css('width', percentComplete + '%');
            $('#' + percentCompleteTextId).html(percentComplete + '%');
        }
    };

    /**
     * Admin indexing
     * @alias module:confluence/admin-indexing
     */
    var exports = function() {
        var searchIndexProgress = $('#search-index-task-progress-container');
        var reindexTaskInProgress = $('#reindex-task-in-progress').length > 0;
        var buildSearchIndexButton = $('#build-search-index-button');
        var searchIndexExists = $('#search-index-exists').length > 0;
        var searchIndexElapsedTime = $('#search-index-elapsed-time');
        var searchIndexElapsedTimeContainer = $('#search-index-elapsed-time-container');
        var searchIndexErrorStatus = $('#search-index-error-status');
        var searchIndexSuccessStatus = $('#search-index-success-status');
        var searchIndexInProgressStatus = $('#search-index-inprogress-status');
        var $indexingStatus = $('.indexing-status');

        buildSearchIndexButton.click(function() {
            SafeAjax.ajax({
                url: CONSTANTS.CONTEXT_PATH + '/admin/reindex.action',
                type: 'POST',
                dataType: 'json',
                data: {}, // must declare this to use SafeAjax.ajax
                success: function(data) {
                    ProgressBar(searchIndexProgress, 0);
                    searchIndexElapsedTimeContainer.hide();
                    monitorProgress();
                }
            });

            return false;
        });

        if (!searchIndexExists || searchIndexElapsedTime.html() === '') {
            searchIndexElapsedTimeContainer.hide();
        }

        ProgressBar(searchIndexProgress, 0);

        if (reindexTaskInProgress) {
            monitorProgress();
        }

        function monitorProgress() {
            var searchInterval;
            buildSearchIndexButton.prop('disabled', true);

            searchInterval = window.setInterval(function() {
                $.getJSON(CONSTANTS.CONTEXT_PATH + '/json/reindextaskprogress.action', function(data) {
                    ProgressBar(searchIndexProgress, data.percentageComplete);

                    $indexingStatus.text(data.count + ' / ' + data.total);

                    searchIndexElapsedTimeContainer.show();
                    searchIndexElapsedTime.html(data.compactElapsedTime);

                    if (data.percentageComplete === 100) {
                        buildSearchIndexButton.prop('disabled', false);

                        searchIndexSuccessStatus.show();
                        searchIndexErrorStatus.hide();
                        searchIndexInProgressStatus.hide();

                        window.clearInterval(searchInterval);
                    }
                });
            }, 1000);
        }

        if (searchIndexExists && !reindexTaskInProgress) {
            ProgressBar(searchIndexProgress, 100);
        }

        if (reindexTaskInProgress) {
            searchIndexInProgressStatus.show();
            searchIndexErrorStatus.hide();
            searchIndexSuccessStatus.hide();
        } else if (searchIndexExists) {
            searchIndexSuccessStatus.show();
            searchIndexErrorStatus.hide();
            searchIndexInProgressStatus.hide();
        } else {
            searchIndexErrorStatus.show();
            searchIndexSuccessStatus.hide();
            searchIndexInProgressStatus.hide();
        }
    };
    return exports;
});

require('confluence/module-exporter').safeRequire('confluence/admin-indexing', function(AdminIndexing) {
    'use strict';

    var AJS = require('ajs');
    AJS.toInit(AdminIndexing);
});
