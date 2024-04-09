/**
 * @module confluence/api/constants
 */
define('confluence/api/constants', [
    'ajs'
], function(
    AJS
) {
    'use strict';

    /**
     * Commonly used constants shared across the Confluence environment.
     * @exports confluence/api/constants
     */
    var CONSTANTS = {};

    /**
     * The URL to the root of your Confluence installation (excluding protocol, host and port).
     * @example
     * // Assuming your Confluence domain is https://atlassian.net/wiki,
     * // this will log "/wiki" to the console.
     * var CONSTANTS = require('confluence/api/constants');
     * console.log(CONSTANTS.CONTEXT_PATH);
     *
     * @return {String}
     */
    CONSTANTS.CONTEXT_PATH = AJS.contextPath();

    return CONSTANTS;
});
