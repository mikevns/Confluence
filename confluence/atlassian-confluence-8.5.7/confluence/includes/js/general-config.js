/**
 * @module confluence/general-config
 */
define('confluence/general-config', [
    'ajs',
    'jquery',
    'window'
], function(
    AJS,
    $,
    window
) {
    'use strict';

    var GeneralConfig = {};

    GeneralConfig.initialize = function() {
        var DEFAULT_MAX_REQUESTS_FOR_QUICK_NAV = 40;

        if (!AJS.params.editMode) {
            return;
        }

        var oldColor;
        var quickNavInput = $('#enableQuickNav');
        var maxRequests = $('#maxSimultaneousQuickNavRequests');
        var maxRequestsLabel = maxRequests.siblings('span.inline-text');
        var baseURL = $('#editbaseurl');
        var currentURL = window.location.href;

        var showBaseURLWarning = function() {
            var warningRow = $('#urlWarning');
            var newBaseURL = $('#editbaseurl').val();
            // Since this js file is used in both the general admin config and the secondary admin config pages, this element
            // may or may not be on the page. If it's not here, we can exit early since the warning msg won't be needed.
            if (!newBaseURL) {
                return;
            }
            // CONF-18134
            // Context path of the current URL will be everything up to /admin so need to check
            // that the new baseURL + /admin matches the start of the current URL
            if (newBaseURL[newBaseURL.length - 1] == '/') {
                newBaseURL += 'admin';
            } else {
                newBaseURL += '/admin';
            }
            var currentURLStart = currentURL.substring(0, newBaseURL.length);
            if (currentURLStart != newBaseURL) {
                warningRow.removeClass('hidden');
            } else {
                warningRow.addClass('hidden');
            }
        };

        var toggleQuickNav = function() {
            if (quickNavInput.prop('checked')) {
                maxRequests.prop('disabled', false).css('color', '#000');
                maxRequestsLabel.css('color', oldColor);
                if (maxRequests.val() == 0) {
                    maxRequests.val(DEFAULT_MAX_REQUESTS_FOR_QUICK_NAV);
                }
            } else {
                maxRequests.prop('disabled', true).css('color', '#ccc');
                oldColor = maxRequestsLabel.css('color');
                maxRequestsLabel.css('color', '#ccc');
            }
        };

        showBaseURLWarning();
        baseURL.change(showBaseURLWarning);

        // Change from 'click' event to 'change' event
        // To be testable and initiated an event with jQuery
        // This is a minor bug in jQuery
        // Since when a user really click on a checkbox with a click listener, it first flips the 'checked' state and then fires the event.
        // But when a click is initiated on a checkbox with jQuery, it first fires the event and then flips the 'checked' state.
        quickNavInput.change(toggleQuickNav);
        toggleQuickNav();
    };
    return GeneralConfig;
});

require('confluence/module-exporter').safeRequire('confluence/general-config', function(GeneralConfig) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(GeneralConfig.initialize);
});
