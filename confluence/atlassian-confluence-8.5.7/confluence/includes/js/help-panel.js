/**
 * @module confluence/help-panel
 */
define('confluence/help-panel', [
    'jquery',
    'window'
], function(
    $,
    window
) {
    'use strict';

    var HelpPanel = {};

    HelpPanel.initialize = function() {
        $('.help-panel-content a').click(function() {
            var linkUrl = $(this).attr('href');
            var onClickEvent = $(this).attr('onClick');
            var windowOpened;
            if (!onClickEvent && linkUrl && linkUrl.indexOf('#') !== 0 && linkUrl.indexOf(window.location) === -1) {
                windowOpened = window.open(linkUrl, '_blank');
                windowOpened.focus();
                windowOpened.opener = null;
                return false;
            }
        });
    };
    return HelpPanel;
});

require('confluence/module-exporter').safeRequire('confluence/help-panel', function(HelpPanel) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(HelpPanel.initialize);
});
