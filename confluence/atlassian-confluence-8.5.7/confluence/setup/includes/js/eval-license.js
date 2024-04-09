/*
    The contents of this file are mostly copied from setup-license.js in JIRA. JIRA already implemented the same flow and
    their code has been in production for a year at the time of writing.
*/

require([
    'jquery',
    'underscore',
    'ajs',
    'confluence/setup/setup',
    'confluence/setup/setup-tracker',
    'confluence/setup/utils'
],
function(
    $,
    _,
    AJS,
    setup,
    setupTracker,
    utils
) {
    'use strict';

    $(function() {
        if (isDevMode()) {
            $('.pageheader')
                .append('<small style="display: block">'
                        + 'dev mode active: running against lasso/hamlet staging servers. '
                        + 'feel free to create accounts and generate keys with fake data'
                        + '</small>');
        }
    });

    function isDevMode() {
        return utils.getMeta('dev-mode');
    }

    function disableRadioButtons() {
        $('input[name="license-selector"]').attr('disabled', 'disabled');
    }

    function clearErrorsOnForm() {
        $('.error').remove();
    }

    $(function() {
        $('#importLicenseForm').submit(function() {
            setupTracker.insert('havekey');
            clearErrorsOnForm();
            disableRadioButtons();
            setup.showSpinner(AJS.I18n.getText('setup.evallicense.importlicense.loading'));
        });
    });
});
