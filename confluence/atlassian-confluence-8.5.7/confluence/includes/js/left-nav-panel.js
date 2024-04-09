/**
 * @module confluence/left-nav-panel
 */
define('confluence/left-nav-panel', [
    'jquery'
], function(
    $
) {
    'use strict';

    var LeftNavPanel = {};

    LeftNavPanel.initialize = function() {
        $('.navmenu.collapsible-menu li div.menuheading').click(function() {
            $(this).toggleClass('closed');
            var parent = $(this).parent();
            $('ul.menu-section-list', parent).toggleClass('hidden');
        });
    };
    return LeftNavPanel;
});

require('confluence/module-exporter').safeRequire('confluence/left-nav-panel', function(LeftNavPanel) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(LeftNavPanel.initialize);
});
