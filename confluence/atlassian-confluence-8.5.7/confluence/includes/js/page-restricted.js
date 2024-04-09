/**
 * @module confluence/page-restricted
 */
define('confluence/page-restricted', [
    'jquery'
], function(
    $
) {
    'use strict';

    var PageRestricted = {};

    PageRestricted.initialize = function() {
        var restrictedPage = $('#page-restricted-container');

        // Restricted pages render the No Permission page, which includes title + breadcrumbs
        // They don't look ok with the new restricted-page container

        if (restrictedPage.length) {
            // Hiding breadcrumbs + title of the 'No Permissions' page
            $('#breadcrumbs').hide();
            $('#title-text.with-breadcrumbs').hide();

            // Styling dashboard-section parent div just for restricted pages, so container is aligned in the middle
            var dashboardSection = $('#page-restricted-container').parent().parent();
            if (dashboardSection.hasClass('dashboard-group')) {
                dashboardSection.css('display', 'block');
                dashboardSection.css('width', '100%');
            }
        }
    };
    return PageRestricted;
});

require('confluence/module-exporter').safeRequire('confluence/page-restricted', function(PageRestricted) {
    'use strict';

    require('ajs').toInit(PageRestricted.initialize);
});
