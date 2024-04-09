/**
 * @module confluence/edit-user-profile
 */
define('confluence/edit-user-profile', [
    'jquery',
    'ajs'
], function(
    $,
    AJS
) {
    'use strict';

    return function() {
        var shouldSubmitProfileForm = false;
        var dialog = new AJS.ConfluenceDialog({
            width: 600,
            height: 260,
            id: 'password-dialog'
        });
        dialog.addHeader(AJS.I18n.getText('reenter.password.dialog.name'));
        dialog.addPanel('Password', 'pwd');
        var $passwordField = $('#password');
        dialog.getCurrentPanel().html(AJS.renderTemplate('re-enter-password-dialog'));
        var submitPassword = function() {
            $('#passwordconfirmation').attr('value', $('#password').attr('value'));
            shouldSubmitProfileForm = true;
            $('#editmyprofileform').submit();
            return false;
        };

        dialog.addButton(AJS.I18n.getText('reenter.password.button'), submitPassword);
        dialog.addCancel(AJS.I18n.getText('cancel.name'), function() {
            dialog.hide();
            return false;
        });

        $('#confirm-password').submit(submitPassword);
        var originalEmail = $('#originalemail').attr('value');
        var $emailField = $('#email');

        $('#editmyprofileform').submit(function() {
            if (shouldSubmitProfileForm) {
                shouldSubmitProfileForm = false;
                return true;
            }
            if ($emailField.attr('value') !== originalEmail) {
                dialog.show();
                $passwordField.focus();
                return false;
            }
            return true;
        });

        $('#cancel').click(function() {
            shouldSubmitProfileForm = true;
            return true;
        });
    };
});

require('confluence/module-exporter').safeRequire('confluence/edit-user-profile', function(EditUserProfile) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(EditUserProfile);
});
