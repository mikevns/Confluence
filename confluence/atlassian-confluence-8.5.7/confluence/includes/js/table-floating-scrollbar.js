/**
 * @module confluence/table-floating-scrollbar
 */
define('confluence/table-floating-scrollbar', [
    'jquery'
], function($) {
    'use strict';

    var TableFloatingScrollbar = {};

    TableFloatingScrollbar.initialize = function() {
        // Enable floating scrollbars for tables inside the content area
        // see: jquery.floatingScrollbar.js
        var tables = $('.wiki-content').find('.table-wrap');
        if (tables.length) {
            tables.floatingScrollbar();
        }
    };
    return TableFloatingScrollbar;
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/table-floating-scrollbar', function(TableFloatingScrollbar) {
    'use strict';

    require('ajs').toInit(TableFloatingScrollbar.initialize);
});
