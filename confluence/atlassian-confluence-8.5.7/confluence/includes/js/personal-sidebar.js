/**
 * @module confluence/personal-sidebar
 */
define('confluence/personal-sidebar', [
    'jquery',
    'confluence/storage-manager'
], function(
    $,
    ConfluenceStorageManager
) {
    'use strict';

    var PersonalSidebar = {};

    PersonalSidebar.initialize = function() {
        var sidebarPrefs = ConfluenceStorageManager('personal-sidebar');
        var sidebar = $('#personal-info-sidebar');
        var height = sidebar.height();
        var content = $('#content');

        function toggleSidebar() {
            sidebar.toggleClass('collapsed');
            content.toggleClass('sidebar-collapsed');
            sidebar.trigger('toggled');
        }

        if (sidebarPrefs.getItemAsBoolean('show')) {
            toggleSidebar();
        }

        $('.sidebar-collapse').click(function(e) {
            toggleSidebar();
            sidebarPrefs.setItem('show', sidebar.hasClass('collapsed'));
            e.stopPropagation();
            return false;
        }).height(height); // fixes half-px rounding bug in FF but causes overflow bug
    };
    return PersonalSidebar;
});

require('confluence/module-exporter').safeRequire('confluence/personal-sidebar', function(PersonalSidebar) {
    'use strict';

    require('ajs').toInit(PersonalSidebar.initialize);
});
