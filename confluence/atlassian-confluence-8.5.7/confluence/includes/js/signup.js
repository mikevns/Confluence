/**
 * @module confluence/signup
 */
define('confluence/signup', [
    'ajs',
    'jquery'
], function(
    AJS,
    $
) {
    'use strict';

    /**
     * A utility function for IE and Firefox specifically that will select all text in the supplied textbox control.
     *
     * Webkit has a more sensible behaviour on focus so doesn't need this.
     */
    var selectAll = function($textbox) {
        var textElem = $textbox[0];
        if (textElem.setSelectionRange) {
            var length = $textbox.val().length;
            textElem.setSelectionRange(0, length);
        } else if (textElem.createTextRange) {
            var range = textElem.createTextRange();
            range.execCommand('SelectAll');
            range.select();
        }
    };

    return function() {
        var $username;
        var $email;

        var usernameIsCustom = function() {
            return $username.data('custom');
        };

        var extractUsernameFromEmail = function() {
            var emailVal = $email.val();

            // The regex here should comply with the validation rules in UserFormValidator.
            // It ignores "anonymous" user, but this is quite unlikely to be a real address.
            var usernameMatches = emailVal.match(/[^@]+/);

            return (usernameMatches ? usernameMatches[0].replace(/[\\,+<>'"\s]/g, '').toLowerCase() : '');
        };

        var updateUsername = function() {
            if (usernameIsCustom()) { return; }

            var usernameVal = extractUsernameFromEmail();
            $username.val(usernameVal);
        };

        var updateUsernameSelection = function() {
            selectAll($username);
        };

        var setCustomUsername = function() {
            var currentUsername = $username.val();
            if (currentUsername && currentUsername !== extractUsernameFromEmail()) {
                $username.data('custom', currentUsername);
            } else {
                $username.removeData('custom');
            }
        };

        return {
            load: function() {
                $username = $('#username');
                $email = $('#email');
                setCustomUsername();
                return this;
            },

            bindEvents: function() {
                $email.bind('keyup paste blur', updateUsername);
                $username.bind('blur', setCustomUsername);
                $username.bind('focus', updateUsernameSelection);

                $('form[name="signupform"]').bind('reset', function() {
                    $username.removeData('custom');
                });

                return this;
            }
        };
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/signup', 'Confluence.SignUpForm', function(SignUpForm) {
    'use strict';

    require('ajs').toInit(function() {
        SignUpForm().load().bindEvents();
    });
});
