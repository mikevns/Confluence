/**
 * @module confluence/userpicker
 */
define('confluence/userpicker', [
    'jquery'
], function(
    $
) {
    'use strict';

    var UserPicker = {};

    UserPicker.initialize = function() {
        // tabsMenu contains two properties: tab and pane. each property is a jquery object representing the currently
        // selected tab and pane
        $('#tab-navigation').on('tabSelect', '.menu-item a', function(e, tabsMenu) {
            var $this = $(this);
            if ($this.attr('href') === '#user-search-section') {
                tabsMenu.pane.find('#searchTerm').select();
            } else if ($this.attr('href') === '#membership-search-section') {
                tabsMenu.pane.find('#groupTerm').select();
            }
            $('#search-results').empty();
        });
    };
    return UserPicker;
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/userpicker', function(UserPicker) {
    'use strict';

    require('ajs').toInit(UserPicker.initialize);
});
