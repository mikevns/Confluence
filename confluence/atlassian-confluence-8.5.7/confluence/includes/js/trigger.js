/**
 * @module confluence/trigger
 */
define('confluence/trigger', [
    'jquery',
    'window'
], function(
    $,
    window
) {
    'use strict';

    // HACK - from JIRA's 'util.js', this version of AJS.trigger overwrites the AUI version. Renamed to AJS.jiraTrigger
    // until we can come up with something common that won't bork.
    /**
     * Utility method for triggering a given event on a given target.
     *
     * @param {string | Object} event -- what event to trigger
     * @param {Object=} target -- what
     * @returns {boolean} -- whether the default action was prevented
     */
    return function(event, target) {
        event = new $.Event(event);
        $(target || window.top.document).trigger(event);
        return !event.isDefaultPrevented();
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/trigger', 'AJS.jiraTrigger');
