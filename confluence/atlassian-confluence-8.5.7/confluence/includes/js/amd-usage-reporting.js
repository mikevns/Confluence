/* eslint-disable no-implicit-globals */
/* eslint @atlassian/confluence-server/must-use-amd:0, no-undef:0 */
AmdUsageReporting = function(amdInstrumenter, configObject) {
    'use strict';

    this.amdInstrumenter = amdInstrumenter;
    this.configObject = configObject;
};

AmdUsageReporting.prototype.enable = function() {
    'use strict';

    var darkFeatureMetaTag = document.querySelector('meta[name="ajs-enabled-dark-features"]');

    if (darkFeatureMetaTag !== null) {
        var darkFeatureMetaContent = darkFeatureMetaTag.getAttribute('content');
        if (darkFeatureMetaContent !== null) {
            var darkFeatureKeys = darkFeatureMetaContent.split(',');
            if (darkFeatureKeys.indexOf('confluence.frontend.stats') > -1 && darkFeatureKeys.indexOf('confluence.frontend.amd.stats') > -1) {
                var amdInstrumenter = new this.amdInstrumenter(this.configObject);
                if (window.jsReporting) {
                    window.jsReporting.addInstrumenter('amdInstrument', amdInstrumenter);
                } else {
                    window.console.warn('Js Reporting plugin is undefined.');
                }
            }
        }
    }
};

if (typeof AmdInstrumenter !== 'undefined') {
    var amdUsageReporter = new AmdUsageReporting(AmdInstrumenter, { flushAtCount: 50, flushAtTime: 60000 });
    amdUsageReporter.enable();
}
