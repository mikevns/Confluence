/**
 * @module confluence/browsegroupmembers
 */
define('confluence/browsegroupmembers', [
    'jquery'
], function(
    $
) {
    'use strict';

    var BrowseGroupMembers = {};

    BrowseGroupMembers.initialize = function() {
        var addMembersSection = $('#add-members-section');
        var listMembersSection = $('#list-members-section');
        var switchButton = $('#switch-button');
        var cancelButton = $('#cancel');
        var errorBox = $('.errorBox');

        var open = function() {
            addMembersSection.show();
            listMembersSection.hide();
            errorBox.hide();
            switchButton.hide();
            return false;
        };

        var cancel = function() {
            listMembersSection.show();
            addMembersSection.hide();
            switchButton.show();
            $('.error').remove();
            return false;
        };

        switchButton.click(open);
        cancelButton.click(cancel);
        cancel();
    };

    BrowseGroupMembers.setPickerField = function(entityNames) {
        $('#usersToAdd').val(entityNames);
    };

    return BrowseGroupMembers;
});

require('confluence/module-exporter').safeRequire('confluence/browsegroupmembers', function(BrowseGroupMembers) {
    'use strict';

    var AJS = require('ajs');
    var window = require('window');

    AJS.toInit(BrowseGroupMembers.initialize);
    window.setPickerField = BrowseGroupMembers.setPickerField;
});
