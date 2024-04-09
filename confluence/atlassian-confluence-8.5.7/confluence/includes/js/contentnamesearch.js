/**
 * @module confluence/contentnamesearch
 */
define('confluence/contentnamesearch', [
    'jquery',
    'ajs'
], function(
    $,
    AJS
) {
    'use strict';

    function ContentNameSearch() {
        /**
         * Opens the search result in a new tab when you press ctrl+enter.
         */
        var enableSearchInNewTab = function() {
            $('#quick-search').on('keydown', function(e) {
                var quickSearchDropdownSelected = AJS.dropDown.current && AJS.dropDown.current.getFocusIndex() !== -1;
                var ctrlEnterPressed = e.which === 13 && (e.metaKey || e.ctrlKey);
                if (ctrlEnterPressed && !quickSearchDropdownSelected) {
                    var $this = $(this);
                    $this.attr('target', '_blank');
                    $this.submit();
                    $this.attr('target', '');
                }
            });
        };

        var setupAnalytics = function() {
            // Capture the type of the result that is being clicked on
            $('#quick-search').on('click', 'div.quick-search-dropdown li', function(e) {
                var li = $(this);
                var eventTarget = $(e.target);
                var notSecondAOrRealClick = !(eventTarget.is('a') && (eventTarget.parent().children('a')).index(eventTarget) === 1) || (e.originalEvent !== undefined);
                if (notSecondAOrRealClick) {
                    var resultType = li.children('a:first').attr('class');
                    var resultIndex = li.index('div.quick-search-dropdown li');
                    var payload = { name: 'quicknav-click-' + resultType, data: { index: resultIndex } };
                    AJS.trigger('analytics', payload);
                }
            });

            // Capture when people use the quicknav field to navigate to the search page
            $('#quick-search').on('submit', function() {
                var numberOfQuickNavResults = $('div.quick-search-dropdown li').length;
                var payload = { name: 'quicknav-hit-enter', data: { results: numberOfQuickNavResults } };
                AJS.trigger('analytics', payload);
            });
        };

        /**
         * Binds two events to the form for showing/hiding a loading spinner when there is ajax activity in the quick search
         * drop downs. Trigger "quick-search-loading-start" from a dropdown to show the spinner, and "quick-search-loading-stop"
         * to hide the spinner.
         */
        var bindLoadingSpinner = function() {
            $('#quick-search').on({
                'quick-search-loading-start': function() {
                    // quick-search-loading class used to hide #quick-search:after element which contains the search icon
                    // check master.less for the CSS rule
                    $(this).spin({ className: 'quick-search-spinner' }).addClass('quick-search-loading');
                    $('.quick-search-spinner').css('left', ($(this).outerWidth() - 35) + 'px'); // place the spinner over search icon
                },
                'quick-search-loading-stop': function() {
                    $(this).spinStop().removeClass('quick-search-loading');
                }
            });
        };

        setupAnalytics();
        bindLoadingSpinner();
        enableSearchInNewTab();
    }

    return ContentNameSearch;
});

require('confluence/module-exporter').safeRequire('confluence/contentnamesearch', function(ContentNameSearch) {
    'use strict';

    var AJS = require('ajs');
    AJS.toInit(ContentNameSearch);
});
