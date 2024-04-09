/**
 * Provides a way for hiding the page title when trying to view a page in trash
 * @since 6.2.0
 */
define('confluence/page-intrash', [
    'jquery'
], function(
    $
) {
    'use strict';

    var PageInTrash = {};

    /**
     * Register a function to hide the page title.
     */
    PageInTrash.initialize = function() {
        var pageInTrash = $('#page-intrash-container');

        // Restricted pages render the Page In Trash page, which includes title + breadcrumbs
        if (pageInTrash.length) {
            // Hiding breadcrumbs + title of the 'Page In Trash' page
            $('#breadcrumbs').hide();
            $('#title-text.with-breadcrumbs').hide();
        }
    };
    return PageInTrash;
});

require('confluence/module-exporter').safeRequire('confluence/page-intrash', function(PageInTrash) {
    'use strict';

    require('ajs').toInit(PageInTrash.initialize);
});
