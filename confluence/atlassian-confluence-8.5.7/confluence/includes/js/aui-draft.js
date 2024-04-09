/* eslint @atlassian/confluence-server/no-ajs-data:0 */
/**
 * Where extensions to AUI that aren't ready to migrate should be stored.
 *
 * Functions added here should have a @since version and go on the roadmap to
 * be moved over after a suitable delay.
 *
 * @module confluence/aui-draft
 */
define('confluence/aui-draft', [
    'jquery',
    'ajs',
    'confluence/meta',
    'window',
    'document',
    'confluence/api/regexes',
    'confluence/aui-overrides'
], function(
    $,
    AJS,
    Meta,
    window,
    document,
    REGEXES,
    AJSOverrides
) {
    'use strict';

    var AUIDraft = {};
    var ajsLogOverride;

    $.ajaxSetup({
        traditional: true
    });

    /**
     * The purpose of these defaultIfUndefined functions are to spot for undefined in very nested cases and return the objects
     * that we are looking for. If we don't find those objects then return a default value. This is in the process of being
     * pulled into AUI: https://bitbucket.org/atlassian/aui-archive/pull-request/216
     * @since 5.0
     */
    AUIDraft.defaultIfUndefined = function(path, options) {
        var defaultValue = null;
        var obj = window;
        if (typeof options !== 'undefined') {
            if (typeof options.defaultValue === 'object') { defaultValue = options.defaultValue; }
            if (typeof options.rootObject !== 'undefined') {
                if (typeof options.rootObject === 'object' && options.rootObject) {
                    obj = options.rootObject;
                } else {
                    return defaultValue;
                }
            }
        }
        if (typeof path !== 'string') { return defaultValue; }

        var args = path.split('.');

        for (var i = 0; i < args.length; i++) {
            if (!Object.prototype.hasOwnProperty.call(obj, args[i])) {
                return defaultValue;
            }
            obj = obj[args[i]];
        }
        return obj;
    };

    var debugSwitch = (function() {
        var debugNotLocalStorageSwitch = false; // if browser doesn't support localStorage fallback to non sticky flag

        return function(enabled) {
            var DEBUG_SWITCH_LOCAL_STORAGE_KEY = 'debug-switch-enabled';
            var localStorageSupported = !!window.localStorage;

            // get
            if (typeof enabled !== 'boolean') {
                if (localStorageSupported) {
                    return localStorage.getItem(DEBUG_SWITCH_LOCAL_STORAGE_KEY) == 'true'; // localStorage stores strings
                }

                return debugNotLocalStorageSwitch;
            }

            // set
            if (localStorageSupported) {
                localStorage.setItem(DEBUG_SWITCH_LOCAL_STORAGE_KEY, enabled);
            } else {
                debugNotLocalStorageSwitch = enabled;
            }
        };
    }());

    /**
     * Similar to AJS.log but only output if debug is enabled.
     * @param obj the obj or string to output
     */
    AUIDraft.debug = function() {
        if (!debugSwitch()) { return; }
        var args = Array.prototype.slice.call(arguments); // convert into a real array
        args.splice(0, 0, 'DEBUG: ' + new Date().toLocaleTimeString());
        AJS.log.apply(AJS, args);
    };

    /**
     * Sets debug enabled state if 'enabled' param passed, else returns debug enabled state.
     * @param enabled true or false if AJS.debug should log messages
     */
    AUIDraft.debugEnabled = function(enabled) {
        if (typeof enabled !== 'boolean') {
            return debugSwitch();
        }

        debugSwitch(enabled);
        AJS.log('STICKY FLAG DEBUG ENABLED: ' + enabled);
    };

    AUIDraft.logError = function(prefix, ex) {
        // Handle IE and Mozilla style Error objects
        // see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error
        // see http://msdn.microsoft.com/en-us/library/dww52sbt%28v=vs.94%29.aspx
        var msgs = [];
        var prop;

        if ($.browser.webkit) {
            msgs.push(ex);
        } else {
            for (prop in ex) {
                msgs.push(prop + ': ' + ex[prop]);
            }
        }

        AJS.log(prefix + msgs.join(', '));
    };

    // should logging appear in the DOM?
    if (Meta.getBoolean('log-rendered')) {
        var oldLog = AJS.log;
        var logDiv = $('<div id="ajs-log" class="log"><h3>AJS Log</h3>\n</div>');
        var head = $('head');
        var body;

        // should logging appear on screen?
        logDiv.toggleClass('hidden', !Meta.getBoolean('log-visible'));

        ajsLogOverride = function(obj) {
            var str = (typeof (obj) === 'undefined') ? 'undefined' : obj;
            if (body) {
                // ensure the div is the last on the page
                if (logDiv.next().length !== 0) {
                    body.append(logDiv);
                }
            } else {
                // IE will reject your puny attempts to use jQuery's .text() method here, complaining about an 'Unexpected method or property access'
                // see http://forum.jquery.com/topic/unexpected-call-to-method-or-property-access-in-ie8
                // Using primitive DOM createElement instead
                var script = document.createElement('script');
                script.type = 'text/x-log';
                script.text = str;
                head.append(script);
            }
            logDiv.append($('<p></p>').text('\n' + str));
            oldLog.apply(AJS, arguments);
        };

        // AUI Logging is disabled if there is no console
        // we want to always log to a div as well
        AJS.log = ajsLogOverride;

        AJS.toInit(function() {
            $('body').append(logDiv);
        });
    }

    //
    /**
     * Wrapper for JSON AJAX calls; handles errors and 'successes' containing error messages in the JSON response. Also
     * handles display of any loading elements.
     *
     * @param options, including:
     *
     * - url: url to request JSON from
     * - data: data to pass in the request
     * - messageHandler: an AJS.MessageHandler for any error responses
     * - successCallback: (optional) a function to call with the returned JSON
     * - loadingElement: (optional) an element or elements to show when the request is running and hide when complete
     * - errorMessage: (optional) a string to display if an undefined error occurs
     * - errorCallback: (optional) a function to call if the request fails for any reason
     */
    AUIDraft.getJSONWrap = function(options) {
        // Ensure that relative urls are prefixed with the context path.
        var contextPath = AJS.contextPath();
        var url = options.url;
        if (url.indexOf(contextPath) !== 0 && url.indexOf('http') !== 0) {
            url = contextPath + url;
        }

        // Before sending the request display any loading message elements.
        options.loadingElement && AJSOverrides.setVisible(options.loadingElement, true);

        var msgr = options.messageHandler;
        msgr.clearMessages();

        $.ajax({
            type: 'GET',
            url: url,
            dataType: 'json',
            data: options.data,
            error: function() {
                options.loadingElement && AJSOverrides.setVisible(options.loadingElement, false);
                msgr.displayMessages(options.errorMessage || AJS.I18n.getText('unknown.server.error'));
                options.errorCallback && options.errorCallback();
            },
            success: function(data) {
                options.loadingElement && AJSOverrides.setVisible(options.loadingElement, false);
                if (msgr.handleResponseErrors(data)) {
                    // Xwork action errors were found in the response and displayed.
                    options.errorCallback && options.errorCallback();
                    return;
                }

                options.successCallback && options.successCallback(data);
            }
        });
    };

    /*
        Validates text against WWW standards.

        URL and Email regex borrowed from:
        http://bassistance.de/jquery-plugins/jquery-plugin-validation/
        which is:
        Copyright (c) 2006 - 2011 J�rn Zaefferer

        Dual licensed under the MIT and GPL licenses:
        http://www.opensource.org/licenses/mit-license.php
        http://www.gnu.org/licenses/gpl.html
     */
    AUIDraft.Validate = $.extend((function() {
        return {
            email: function(str) {
                return REGEXES.EMAIL.test(str);
            },
            url: function(str) {
                return REGEXES.URL.test(str);
            }
        };
    }()), AJS.Validate);

    AUIDraft.Meta = AJS.Data || Meta;

    return AUIDraft;
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/aui-draft', function(AUIDraft) {
    'use strict';

    var AJS = require('ajs');

    if (typeof AJS.defaultIfUndefined !== 'function') {
        AJS.defaultIfUndefined = AUIDraft.defaultIfUndefined;
    }
    AJS.debug = AUIDraft.debug;
    AJS.debugEnabled = AUIDraft.debugEnabled;
    AJS.logError = AUIDraft.logError;
    AJS.getJSONWrap = AUIDraft.getJSONWrap;
    AJS.Validate = AUIDraft.Validate;

    /**
     * @since 3.4
     * @deprecated Since 4.0. See CONFDEV-3726
     */
    AJS.Data = AUIDraft.Meta;
});
