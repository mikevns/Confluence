/**
 * @module confluence/licensedetails
 */
define('confluence/licensedetails', [
    'jquery',
    'ajs',
    'aui/form-validation',
    'confluence/templates',
    'aui/dialog2',
    'confluence/api/constants',
    'confluence/api/ajax',
    'confluence/analytics-support'
], function(
    $,
    AJS,
    validator,
    Templates,
    dialog2,
    Constants,
    ajax,
    Analytics
) {
    'use strict';

    function SubmitWarning() {
        var warn = null;
        var $form = $('#updateLicenseForm')
            .on('aui-valid-submit', function(e) {
                if (warn !== null) {
                    e.preventDefault();
                    warn();
                }
            });

        this.clear = function() {
            warn = null;
        };

        this.validate = function(license) {
            if (license.crossgradeableApps.length > 0) {
                warn = function() {
                    var publishAnalytics = function(suffix) {
                        Analytics.publish('confluence.license-compatibility-dialog-' + suffix,
                            { appCrossgradeCount: license.crossgradeableApps.length });
                    };

                    var dialog = dialog2(Templates.LicenseDetails.crossgradeWarningDialog(license));
                    dialog.$el
                        .on('click', 'button.show-apps', function() {
                            var windowOpened = window.open();
                            windowOpened.document.write(Templates.LicenseDetails.showApps(license));
                            windowOpened.opener = null;
                            publishAnalytics('see-data-center-apps-clicked');
                        })
                        .on('click', 'button.cancel', function() {
                            publishAnalytics('cancel');
                            $('#licenseString').val('');
                            dialog.remove();
                        })
                        .on('click', 'button.confirm', function() {
                            warn = null;
                            publishAnalytics('finish');
                            $form.submit();
                        })
                        .on('click', 'a.learn-more', function() {
                            publishAnalytics('learn-more-clicked');
                        });
                    dialog.show();
                    publishAnalytics('shown');
                };
            }
        };
    }

    return function LicenseDetails() {
        var flagBody = AJS.I18n.getText('licence.update.flag.body', AJS.I18n.getText('license.update.flag.learn.more.link'), AJS.I18n.getText('license.update.flag.clustering.link'));

        var warning = new SubmitWarning();
        var contextPath = Constants.CONTEXT_PATH;
        validator.register(['validlicense'], function(field) {
            warning.clear();
            ajax.post(
                contextPath + '/rest/license/1.0/license/validate',
                { licenseKey: field.$el.val() },
                function(license) {
                    warning.validate(license);
                    field.validate();
                }
            ).fail(function(jqXHR) {
                field.invalidate(jqXHR.responseText);
            });
        });

        if (window.location.hash === '#updateSuccessful') {
            $.get(contextPath + '/rest/license/1.0/license/details',
                function(licenseDetails) {
                    if (licenseDetails.dataCenter) {
                        AJS.flag({
                            type: 'success',
                            title: AJS.I18n.getText('licence.update.flag.title'),
                            body: flagBody,
                            close: 'manual',
                        });
                    }
                }
            );

            window.location.hash = '';
        }
    };
});

require('confluence/module-exporter').safeRequire('confluence/licensedetails', function(LicenseDetails) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(LicenseDetails);
});
