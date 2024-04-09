/**
 * @module confluence/defaultmailports
 */
define('confluence/defaultmailports', [
    'jquery',
    'window'
], function(
    $,
    window
) {
    'use strict';

    var initialize = function() {
        var protocolsToPorts = {
            pop3: 110,
            pop3s: 995,
            imap: 143,
            imaps: 993
        };
        var $portInput = $('#port');
        $('select[name=\'protocol\']').change(function() {
            var protocol = $(this).val();
            if (!protocolsToPorts.hasOwnProperty(protocol)) {
                window.alert('Protocol: ' + protocol + ' is not a supported protocol.');
            } else {
                $portInput.val(protocolsToPorts[protocol]);
            }
        });
    };
    return {
        initialize: initialize
    };
});

require('confluence/module-exporter').safeRequire('confluence/defaultmailports', function(DefaultMailPorts) {
    'use strict';

    var AJS = require('ajs');
    AJS.toInit(DefaultMailPorts.initialize);
});
