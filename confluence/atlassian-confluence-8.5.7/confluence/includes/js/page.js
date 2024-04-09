/**
 * @module confluence/page
 */
define('confluence/page', [
    'ajs',
    'jquery',
    'confluence/analytics-support',
    'window',
    'document'
], function(
    AJS,
    $,
    Analytics,
    window,
    document
) {
    'use strict';

    /**
     * CONFDEV-33536 - Confluence simplify journeys
     *
     * Adding the following events:
     * - confluence.page.reading (5 min intervals?)
     * - confluence.page.scroll-to-bottom
     * - confluence.page.link.click
     * */

    var pageId = AJS.Meta.get('page-id');

    var track = function(name, data) {
        // all tags here are sent with pageID
        Analytics.publish('confluence.page.' + name, $.extend({
            pageID: pageId
        }, data || {}));
    };

    // maybe this function can be reused for triggering a 'read' event for other contents.
    // if this is the case, let's move it to analytics support
    var trackScrollToBottomOf = function(content, pageLoadTime) {
        var $window = $(window);
        var start = new Date().getTime();

        // using debounce to avoid triggering it to many times
        $window.on('scroll.content', AJS.debounce(function() {
            var totalHeight = document.body.offsetHeight;
            var visibleArea = document.body.scrollTop + totalHeight;
            var contentBottomPos = content.offset().top + content.height();

            if (visibleArea > contentBottomPos) {
                track('scroll-to-bottom', {
                    // show time spent in seconds
                    secondsSinceReadyEvent: (new Date().getTime() - start) / 1000,
                    secondsSincePageLoad: (new Date().getTime() - pageLoadTime) / 1000
                });
                // unbind to avoid duplicated event
                $window.off('scroll.content');
            }
        }, 200));
    };


    var trackReading = function(interval) {
        setTimeout(function() {
            track('reading');
        }, interval);
    };

    // time that the script was requested
    var pageLoadTime = new Date().getTime();

    return function() {
        var pageContent = $('#main-content');

        if (pageContent.length === 0) {
            // This is not viewpage
            return;
        }

        track('view');

        // track any link inside the content saying if it' internal or external
        pageContent.on('click', 'a', function(e) {
            var url = e.currentTarget.href;
            // same location.host is internal link
            var linkType = (url.indexOf(window.location.host) > -1) ? 'internal' : 'external';

            track('link.click', {
                linkType: linkType
            });
        });

        // track when user get to the end of the content
        trackScrollToBottomOf(pageContent, pageLoadTime);

        // track after 5 minutes of the user being on the same page
        trackReading(5 * 60 * 1000);// 5 minutes
    };
});

require('confluence/module-exporter').safeRequire('confluence/page', function(Page) {
    'use strict';

    require('ajs').toInit(Page);
});
