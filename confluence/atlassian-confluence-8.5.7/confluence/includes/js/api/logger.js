/**
 * @module confluence/api/logger
 */
define('confluence/api/logger', [
    'ajs'
], function(
    AJS
) {
    'use strict';

    return {
        debug: function() { AJS.debug.apply(this, arguments); },
        log: function() { AJS.log.apply(this, arguments); },
        logError: function() { AJS.logError.apply(this, arguments); },
        error: function() { AJS.error.apply(this, arguments); },
        warn: function() { AJS.warn.apply(this, arguments); }
    };
});
