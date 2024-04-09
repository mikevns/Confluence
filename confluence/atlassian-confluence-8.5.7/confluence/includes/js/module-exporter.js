/**
 * @module confluence/module-exporter
 */
/* eslint @atlassian/confluence-server/legacy-globals:0 */
define('confluence/module-exporter', [
], function(
) {
    'use strict';

    var ModuleExporter = {};

    // replace with Object.assign when using modern browsers/polyfills in karma
    /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["target"] }] */
    var assign = function(target, source) {
        // var key;
        var to;
        if (target == null) { // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }
        to = Object(target);
        if (source != null) {
            Object.keys(source).forEach(function(key) {
                to[key] = source[key];
            });
        }
        return to;
    };

    function warn(message) {
        if (window.console && window.console.warn) {
            window.console.warn(message);
        }
    }

    /**
     * Get/set the value at a compound namespace, gracefully adding values where missing.
     * @param {string} namespace
     * @param {Object} [value={}]
     * @param {Object} [context=window]
     * @return {Object} the last component of the namespace.
     * @deprecated please create AMD modules in the appropriate place in the /webapp/static/ folder!
     *             Read {@link https://extranet.atlassian.com/display/JIRADEV/JIRA+JavaScript+Documentation} for more.
     */
    ModuleExporter.namespace = function(namespace, value, context) {
        var names = namespace.split('.');
        var ctx = context || window;
        var n = names.length - 1;
        var i;
        var x;
        var v;
        for (i = 0; i < n; i++) {
            x = ctx[names[i]];
            if (x != null) {
                ctx = x;
            } else {
                ctx[names[i]] = {};
                ctx = ctx[names[i]];
            }
        }
        x = ctx[names[i]];
        if (typeof x === 'undefined') {
            v = value;
        } else if (typeof value === 'undefined') {
            v = x;
        } else if (typeof x !== 'object' || typeof value !== 'object') {
            warn('Value of "' + namespace + '" (' + typeof x + ' was overridden to be ' + typeof value);
            v = value;
        } else {
            warn('Properties of "' + namespace + '" were overwritten');
            v = assign(x, value);
        }
        ctx[names[i]] = v || {};
        return ctx[names[i]];
    };

    /**
     * Wrapper function for AMD "require" that handles common error scenarios. This function is required in unit tests
     * when requiring a module in the same file where the module is defined (which usually throws an exception).
     *
     * @method safeRequire
     * @param {String} moduleName
     * @param {Function} [cb]
     */
    ModuleExporter.safeRequire = function(moduleName, cb) {
        var module;
        if (define && define.amd === undefined) {
            module = require(moduleName);
            if (cb) {
                cb(module);
            }
        }
    };

    /**
     * Exports the given moduleName into the given global namespace.
     * @param {String} moduleName
     * @param {String} namespace
     * @param {Function} [cb]
     */
    ModuleExporter.exportModuleAsGlobal = function(moduleName, namespace, cb) {
        ModuleExporter.safeRequire(moduleName, function(module) {
            ModuleExporter.namespace(namespace, module);
            if (cb) {
                cb(module);
            }
        });
    };

    return ModuleExporter;
});
