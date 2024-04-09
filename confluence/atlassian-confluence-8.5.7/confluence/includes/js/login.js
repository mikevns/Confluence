/**
 * @module confluence/login
 */
define('confluence/login', [
    'jquery',
    'ajs',
    'document'
], function(
    $,
    AJS,
    document
) {
    'use strict';

    return function() {
        function showSignup() {
            var $signupSection = $('.signup-section');

            if ($signupSection.length !== 0) {
                $('.login-section').hide();
                $signupSection.show();
            }
        }

        function showLogin() {
            $('.login-section').show();
            $('.signup-section').hide();
        }

        if (document.URL.indexOf('login.action') > -1 || document.URL.indexOf('logout.action') > -1) {
            showLogin();
        }

        if (document.URL.indexOf('signup.action') > -1) {
            showSignup();
        }

        $('#signupMessage').delegate('click', 'a', function(e) {
            e.preventDefault();
            showSignup();
        });

        $('#loginMessage').delegate('click', 'a', function(e) {
            e.preventDefault();
            showLogin();
        });

        var errorTemplate = '<div id="os_{field}_error" class="error" style="display:none"><span class="error">{message}</span></div>';

        var $usernameErrorMessage = $(AJS.template(errorTemplate).fill({ field: 'username', message: AJS.I18n.getText('login.username.required') }).toString());
        var $passwordErrorMessage = $(AJS.template(errorTemplate).fill({ field: 'password', message: AJS.I18n.getText('login.password.required') }).toString());

        var $username = $('#os_username');
        var $password = $('#os_password');

        var validate = function() {
            var inputIsValid = true;

            if ($username.val().length < 1) {
                inputIsValid = false;
                $username.after($usernameErrorMessage.show());
            } else {
                $usernameErrorMessage.hide();
            }

            if ($password.val().length < 1) {
                inputIsValid = false;
                $password.after($passwordErrorMessage.show());
            } else {
                $passwordErrorMessage.hide();
            }

            return inputIsValid;
        };

        var $loginButton = $('#loginButton');
        var $loginForm = $loginButton.closest('form');
        $loginForm.submit(function(e) {
            $loginButton.attr('enabled', 'false');
            var formIsValid = validate();
            if (!formIsValid) {
                $loginButton.attr('enabled', 'true');
            }
            formIsValid || e.preventDefault();
        });
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/login', function(Login) {
    'use strict';

    require('ajs').toInit(Login);
});
