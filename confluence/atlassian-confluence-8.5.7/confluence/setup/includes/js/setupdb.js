define('confluence/setup/setupdb', [
    'confluence/setup/setup',
    'ajs',
    'jquery',
    'wrm/context-path'
],
function(
    setup,
    AJS,
    $,
    contextPath
) {
    'use strict';

    function _getTestConnectionURL() {
        if ($('form[name=setupdbtype]').length > 0) {
            return contextPath() + '/setup/setupstandarddb-testconnection.action';
        }
        return contextPath() + '/setup/setupdatasourcedb-testconnection.action';
    }

    /**
     * Event handler for testing connection via AJAX without triggering submit event.
     *
     * @param event - click event.
     * @returns false all time.
     */
    function testConnection(event) {
        event.preventDefault();
        hideSuccessMessage();
        removeErrorMessage();
        setButtonDisabled(true);
        $('#setupdb-spinner').spin();
        $.post(_getTestConnectionURL(), $('form').serialize(), 'json')
            .done(function(data) {
                if (data.status) {
                    _showSuccessMessage();
                } else {
                    AJS.messages.error('#action-messages', {
                        title: data.title,
                        body: _getMessageDetails(data)
                    });
                    $('#action-messages p.title').html('<strong>' + data.title + '</strong>');
                }
            }).always(function() {
                $('#setupdb-spinner').spinStop();
                setButtonDisabled(false);
            });
        return false;
    }

    /**
     * Tests the connection with AJAX first if not yet, and submit the form on success.
     *
     * @param event - click event for submit button.
     * @returns false all time.
     */
    function testAndSubmit(event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        setButtonDisabled(true);
        if ($('#setupdb-successMessage').is(':visible')) {
            _creatingDatabase();
            return false;
        }
        hideSuccessMessage();
        removeErrorMessage();
        $('#setupdb-spinner').spin();
        $.post(_getTestConnectionURL(), $('form').serialize(), 'json')
            .done(function(data) {
                if (data.status) {
                    _showSuccessMessage();
                    _creatingDatabase();
                } else {
                    AJS.messages.error('#action-messages', {
                        title: data.title,
                        body: _getMessageDetails(data)
                    });
                    $('#action-messages p.title').html('<strong>' + data.title + '</strong>');
                    setButtonDisabled(false);
                }
            }).fail(function() {
                setButtonDisabled(false);
            }).always(function() {
                $('#setupdb-spinner').spinStop();
            });
        return false;
    }

    function _creatingDatabase() {
        $('#backLink').prop('disabled', true);
        _showCreatingMessage();
        $('form').submit();
    }

    function _getMessageDetails(data) {
        var message = '';
        if (data.sqlState !== '') {
            message += 'SQLState - ' + data.sqlState + '<br/>';
        }
        if (data.errorCode !== 0) {
            message += 'Error Code - ' + data.errorCode + '<br/>';
        }
        message += data.message;
        return message;
    }

    /**
     * Sets the statuses for the Test connection button and Next button
     *
     * @param disable - set to true to disable these buttons, false to enable instead.
     */
    function setButtonDisabled(disable) {
        $('#testConnection').prop('disabled', disable);
        $('#setup-next-button').prop('disabled', disable);
    }

    /**
     * Hides the success message if exists.
     */
    function hideSuccessMessage() {
        $('#setupdb-successMessage').hide();
    }

    /**
     * Clears existing error message if exists.
     */
    function removeErrorMessage() {
        $('.aui-message').remove();
    }

    function _showSuccessMessage() {
        $('#setupdb-successMessage').css('display', 'inline-block');
    }

    function _showCreatingMessage() {
        setup.showSpinner(AJS.I18n.getText('embedded.setup.loading'));
    }

    function _fieldNotValid(fieldId) {
        var field = $('#' + fieldId);
        if (field.is(':visible') && field.val().trim() === '') {
            return true;
        }
        return false;
    }

    function _validateFields() {
        if (_fieldNotValid('dbConfigInfo-hostname')
                || _fieldNotValid('dbConfigInfo-databaseName')
                || _fieldNotValid('dbConfigInfo-serviceName')
                || _fieldNotValid('dbConfigInfo-username')
                || _fieldNotValid('dbConfigInfo-databaseUrl')
                || _fieldNotValid('dbConfigInfo-username')) {
            return false;
        }

        if ($('#dbConfigInfo-port').is(':visible')) {
            var port = $('#dbConfigInfo-port').val().trim();
            var portNum = parseInt(port);
            // check if it is a valid port
            if (!/^[1-9][0-9]+$/.test(port) || portNum < 1025 || portNum > 65535) {
                return false;
            }
        }

        return true;
    }

    /**
     * Validate the required fields and set the button status accordingly
     */
    function validateFields() {
        if (_validateFields()) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }

        return false;
    }

    return {
        testConnection: testConnection,
        testAndSubmit: testAndSubmit,
        setButtonDisabled: setButtonDisabled,
        hideSuccessMessage: hideSuccessMessage,
        removeErrorMessage: removeErrorMessage,
        validateFields: validateFields
    };
});
