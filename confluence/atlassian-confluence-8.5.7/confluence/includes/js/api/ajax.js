define('confluence/api/ajax', [
    'jquery'
], function(
    $
) {
    'use strict';

    /**
     * Helper methods for making ajax requests. Calls through to jQuery in most cases, but automatically appends an XSRF
     * token when necessary.
     * @exports confluence/api/ajax
     * @requires jquery
     */
    var Ajax = {};

    var originalAjax = $.ajax;

    /**
     * Perform an asynchronous HTTP (Ajax) request with a secure token included. The secure token will be read from
     * the element on the page with an id of "atlassian-token".
     *
     * @param options {Object} A set of key/value pairs that configure the Ajax request. (See
     * http://api.jquery.com/jquery.ajax/ for full list of options)
     * @returns {jqXHR} https://api.jquery.com/jQuery.ajax/#jqXHR
     * @see http://api.jquery.com/jquery.ajax/
     */
    Ajax.ajax = function ajax(options) {
        if (options.data && typeof options.data === 'object') {
            options.data.atl_token = $('#atlassian-token').attr('content');
            return originalAjax(options);
        }
    };

    /**
     * Load data from the server using a HTTP GET request.
     *
     * @param url {String} A string containing the URL to which the request is sent.
     * @param data {Object|String} A plain object or string that is sent to the server with the request.
     * @param callback {Function} A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param dataType {String} The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     * @returns {jqXHR} https://api.jquery.com/jQuery.ajax/#jqXHR
     * @see http://api.jquery.com/jquery.get/
     */
    Ajax.get = function get(url, data, callback, dataType) {
        $.ajax = Ajax.ajax;
        try {
            return $.get.apply($, arguments);
        } finally {
            $.ajax = originalAjax;
        }
    };

    /**
     * Load a JavaScript file from the server using a GET HTTP request, then execute it.
     *
     * @param url {String} A string containing the URL to which the request is sent.
     * @param callback {Function} A callback function that is executed if the request succeeds.
     * @returns {jqXHR} https://api.jquery.com/jQuery.ajax/#jqXHR
     * @see http://api.jquery.com/jquery.getscript/
     */
    Ajax.getScript = function(url, callback) {
        return Ajax.get(url, null, callback, 'script');
    };

    /**
     * Load JSON-encoded data from the server using a GET HTTP request.
     *
     * @param url {String} A string containing the URL to which the request is sent.
     * @param data {Object|String} A plain object or string that is sent to the server with the request.
     * @param callback {Function} A callback function that is executed if the request succeeds.
     * @returns {jqXHR} https://api.jquery.com/jQuery.ajax/#jqXHR
     * @see http://api.jquery.com/jquery.getjson/
     */
    Ajax.getJSON = function(url, data, callback) {
        return Ajax.get(url, data, callback, 'json');
    };

    /**
     * Load data from the server using a HTTP POST request.
     *
     * @param url {String} A string containing the URL to which the request is sent.
     * @param data {Object|String} A plain object or string that is sent to the server with the request.
     * @param callback {Function} A callback function that is executed if the request succeeds. Required if dataType is provided, but can be null in that case.
     * @param dataType {String} The type of data expected from the server. Default: Intelligent Guess (xml, json, script, text, html).
     * @returns {jqXHR} https://api.jquery.com/jQuery.ajax/#jqXHR
     * @see http://api.jquery.com/jquery.post/
     */
    Ajax.post = function post(url, data, callback, dataType) {
        $.ajax = Ajax.ajax;
        try {
            return $.post.apply($, arguments);
        } finally {
            $.ajax = originalAjax;
        }
    };

    return Ajax;
});

/* istanbul ignore next */
require('confluence/module-exporter').exportModuleAsGlobal('confluence/api/ajax', 'AJS.safe', function(SafeAjax) {
    'use strict';

    var AJS = require('ajs');

    // DEPRECATED: Use ajax method of confluence/api/ajax module
    AJS.safeAjax = function(options) {
        return SafeAjax.ajax(options);
    };
});
