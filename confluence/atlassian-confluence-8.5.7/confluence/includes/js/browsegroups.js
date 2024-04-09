/**
 * @module confluence/browsegroups
 */
define('confluence/browsegroups', [
    'jquery'
], function(
    $
) {
    'use strict';

    var initialize = function() {
        var form = $('#create-group-form');
        var switchButton = $('#switch-button');
        var toggles = function() {
            form.toggle();
            $('#group-list').toggle();
        };

        form.hide(); // Initial state

        switchButton.toggle(function() {
            toggles();
            switchButton.text($('#i18n-cancel-add').val());
            return false;
        }, function() {
            toggles();
            switchButton.text($('#i18n-add-group').val());
            $('.error').remove();
            return false;
        });

        $('#cancel-button').click(function() {
            switchButton.click();
        });

        if ($('#fielderrors-empty').val() === 'false') {
            switchButton.click();
        }
    };

    return {
        initialize: initialize
    };
});

require('confluence/module-exporter').safeRequire('confluence/browsegroups', function(BrowseGroups) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(BrowseGroups.initialize);
});
