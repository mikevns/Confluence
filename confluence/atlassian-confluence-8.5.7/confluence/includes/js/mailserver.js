/**
 * @module confluence/mailserver
 */
define('confluence/mailserver', [
    'jquery',
    'ajs',
    'confluence/message-controller',
    'wrm/context-path'
], function(
    $,
    AJS,
    MessageController,
    contextPath
) {
    'use strict';

    var testConnectionUrl = contextPath() + '/admin/mail/mailserver-testconnection.action';
    var protocolsToPorts = {
        pop3: 110,
        pop3s: 995,
        imap: 143,
        imaps: 993
    };
    var MailServer = {
        init: function() {
            var authorizationSelect = $('#authorization');
            var isBasicAuth = authorizationSelect.val() === 'BasicAuth';
            var password = $('#password');
            var token = $('#token');
            var hasToken = token.val() !== undefined && token.val() !== '';
            var confirmButton = $('input[name=\'confirm\']');
            var authorizeButton = $('input[name=\'authorize\']');
            var testConnectionButton = $('input[name=\'testConnection\']');
            var portInput = $('#port');
            var protocolSelect = $('select[name=\'protocol\']');
            var isSmtp = $('input[name=\'protocol\']').val() === 'smtp';
            testConnectionButton.click(function(e) {
                var input = {
                    token: token.val(),
                    protocol: protocolSelect.val(),
                    hostname: $('input[name=\'hostname\']').val(),
                    port: portInput.val(),
                    userName: $('input[name=\'userName\']').val(),
                    authorization: authorizationSelect.val()
                };
                e.preventDefault();
                e.stopImmediatePropagation();
                // send an ajax request to the test connection action to get the result
                MailServer.postTestConnectionRequest(input);
                return false;
            });

            protocolSelect.change(function() {
                var protocol = $(this).val();
                // The protocol list is pre-populated automatically, this is just a precaution
                if (!protocolsToPorts.hasOwnProperty(protocol)) {
                    MessageController.showError(AJS.I18n.getText('mail.server.protocol.unsupported', protocol), MessageController.Location.FLAG);
                } else {
                    portInput.val(protocolsToPorts[protocol]);
                }
            });

            authorizationSelect.change(function(e) {
                var isBasicAuthSelected = $(this).val() === 'BasicAuth';
                e.preventDefault();
                password.parent().css('display', isBasicAuthSelected ? 'inline-block' : 'none');
                password.val('');
                confirmButton.prop('disabled', (!isBasicAuthSelected && token.val() === ''));
                authorizeButton.prop('disabled', isBasicAuthSelected);
                testConnectionButton.prop('disabled', isBasicAuthSelected || !hasToken);
            });

            // The password field should be always hidden if Basic Auth is not selected and the protocol is not 'smtp' when the page is rendered
            if (!isBasicAuth && !isSmtp) {
                password.parent().css('display', 'none');
            }

            // The Submit button should be enabled if Basic Auth is selected or there is a token (OAuth2 is selected and authorized)
            if (isBasicAuth || hasToken) {
                confirmButton.prop('disabled', false);
            }

            // The Authorize button should be disabled only when Basic Auth is selected
            authorizeButton.prop('disabled', isBasicAuth);

            // The Test Connection button should be disabled when Basic Auth is selected or there is no token (OAuth2 is selected but not authorized yet)
            testConnectionButton.prop('disabled', isBasicAuth || !hasToken);
        },
        postTestConnectionRequest: function(input) {
            var testConnectionButton = $('input[name=\'testConnection\']');
            var successMessageContainer = $('#action-messages');
            var errorMessageContainer = $('#admin-body-content');
            var defaultOptions = {
                closeable: false
            };
            // remove all messages
            $('.aui-message').remove();
            testConnectionButton.prop('disabled', true);
            $('#testConnection-spinner').spin();
            return $.post(testConnectionUrl, input, 'json')
                .done(function(data) {
                    if (data.status === 'OK') {
                        successMessageContainer.append(
                            AJS.messages.success(
                                $.extend({ body: data.message }, defaultOptions)
                            ));
                    } else {
                        errorMessageContainer.prepend(
                            AJS.messages.error(
                                $.extend({ body: data.message }, defaultOptions)
                            ));
                    }
                })
                .fail(function() {
                    var errorMessage = AJS.I18n.getText('setup.mail.server.test.connection.error');
                    errorMessageContainer.prepend(
                        AJS.messages.error(
                            $.extend({ body: errorMessage }, defaultOptions)
                        ));
                })
                .always(function() {
                    $('#testConnection-spinner').spinStop();
                    testConnectionButton.prop('disabled', false);
                });
        }
    };

    return MailServer;
});

require('confluence/module-exporter').safeRequire('confluence/mailserver', function(MailServer) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(MailServer.init);
});
