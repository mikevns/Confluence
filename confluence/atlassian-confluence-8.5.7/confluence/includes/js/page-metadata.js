/**
 * Code for toggling version metadata.
 * @module confluence/page-metadata
 */
define('confluence/page-metadata', [
    'jquery'
], function(
    $
) {
    'use strict';

    return function() {
        var comment = $('#version-comment');
        if (comment.length) {
            var showLink = $('#show-version-comment');
            var hideLink = $('#hide-version-comment');
            showLink.click(function(e) {
                showLink.hide();
                hideLink.show();
                comment.show();
                e.stopPropagation();
                return false;
            });
            hideLink.click(function(e) {
                hideLink.hide();
                showLink.show();
                comment.hide();
                e.stopPropagation();
                return false;
            });
            // Only hide the comment if it's possible to show it again.
            if (showLink.length && hideLink.length) {
                comment.hide();
            }
        }
    };
});

require('confluence/module-exporter').safeRequire('confluence/page-metadata', function(PageMetadata) {
    'use strict';

    require('ajs').toInit(PageMetadata);
});
