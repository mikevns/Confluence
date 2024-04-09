/* eslint-disable strict,@atlassian/confluence-server/use-strict-amd */
/**
 * Old Confluence anchors (generated before 7.2.0) had this format: "<Page-title-without-spaces>-<anchor-name>"
 * As a result, customers faced issues when page titles have hyphens and hashtags
 * because Confluence was not able to parse such links when they are added to pages.
 *
 * Now, Confluence has this format of anchors: "<Page-title-without-spaces-and-hyphens-and-hashtags>-<anchor-name>"
 * to solve this kind of issues
 * This script was introduced to support old links with hashtags and hyphens (for example, saved in bookmarks).
 *
 * Feel free to remove this file after 2024
 * @since 7.2.0
 */
define('confluence/legacy-scroll-to-hash-anchors', [
    'window',
    'confluence/api/logger'
], function(
    window,
    log
) {
    // like.js uses "arguments.callee" which is forbidden in strict mode
    // 'use strict';

    /**
     * State of the 'scroll' event - was it fired yet?
     * @type {boolean}
     */
    var scrollEventFired = false;

    function scrollToElementId(id) {
        // eslint-disable-next-line no-param-reassign
        window.location.hash = '#' + id;
    }

    /*
     * Remembers a 'scroll' event being fired
     */
    function rememberScroll() {
        scrollEventFired = true;
    }

    /**
     * Is the window scrolled, or was it scrolled in the past?
     * @returns {boolean}
     */
    function isWindowScrolled() {
        return scrollEventFired || window.pageYOffset > 0;
    }

    /**
     * Returns the first position of either '-' or '#' symbols (which are illegal)
     * @param {title} title of the page
     * @returns {number} position or -1 if the illegal symbols are not found
     */
    function findTheFirstIllegalCharacter(title) {
        var hyphenPosition = title.indexOf('-');
        var hashTagPosition = title.indexOf('#');
        if (hyphenPosition < 0) {
            return hashTagPosition;
        }
        if (hashTagPosition < 0) {
            return hyphenPosition;
        }
        return Math.min(hashTagPosition, hyphenPosition);
    }

    function scrollToLegacyAnchor() {
        var position;
        var currentHashTag;
        var el;
        // Only proceed if the window is not already scrolled, i.e. the browser didn't scroll automatically.
        if (!isWindowScrolled()) {
            currentHashTag = window.location.hash;
            while (currentHashTag) {
                position = findTheFirstIllegalCharacter(currentHashTag);
                if (position < 0) {
                    // no illegal characters, so we do not need to scroll the page manually
                    break;
                }
                currentHashTag = currentHashTag.substring(0, position).concat(currentHashTag.substring(position + 1));
                el = window.document.getElementById(currentHashTag);
                if (el) {
                    log.log('Legacy anchor found. Scrolling the page to ', el);
                    scrollToElementId(currentHashTag);
                    break;
                }
            }
        }
    }

    function bindToWindowEvents() {
        // Must not use `DOMContentLoaded` because that fires before `scroll` event and we want browser to have priority to scroll to the right place.
        window.addEventListener('load', scrollToLegacyAnchor, { passive: true });

        window.addEventListener('scroll', rememberScroll, { passive: true });
    }

    return {
        bindToWindowEvents: bindToWindowEvents
    };
});

require('confluence/module-exporter').safeRequire('confluence/legacy-scroll-to-hash-anchors', function(legacyScrollToHashAnchor) {
    'use strict';

    legacyScrollToHashAnchor.bindToWindowEvents();
});
