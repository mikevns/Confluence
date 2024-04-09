/**
 * confluence/meta is used to access dynamic metadata passed from the
 * server to JavaScript via the page HTML.
 *
 * @since 3.6
 * @module confluence/meta
 */
define('confluence/meta', ['confluence/api/type-helpers'], function(TypeHelpers) {
    'use strict';

    // A backing map to use if the user sets data.
    var overrides = {};

    return {
        /**
         * Sets metadata with a key and value, for use when the state of the page changes after
         * loading from the server
         * @param {String} key
         * @param {String|boolean} value
         */
        set: function(key, value) {
            overrides[key] = value;
        },

        /**
         * Returns a value given a key. If no entry exists with the key, undefined is returned.
         * If the string value is "true" or "false" the respective boolean value is returned.
         * If the type is defined in an override, the return value will respect/have the overridden type.
         *
         * The function doesn't implement any caching. Note that <meta> tags are mutable, e.g. the comment editor relies on it.
         *
         * @method get
         * @param {String} key
         * @return {String|boolean}
         */
        get: function(key) {
            if (typeof overrides[key] !== 'undefined') {
                return overrides[key];
            }

            // First query <head> where all meta tags should live
            var metaEl = document.head.querySelector('meta[name="ajs-' + key + '"]');
            if (!metaEl) {
                // Second pass queries all DOM including <body> (if it already exists)
                metaEl = document.querySelector('meta[name="ajs-' + key + '"]');
                if (!metaEl) {
                    return undefined;
                }
            }

            var value = metaEl.getAttribute('content');
            return TypeHelpers.asBooleanOrString(value);
        },

        /**
         * Returns true if the value for the provided key is equal to "true", else returns false.
         *
         * @method getBoolean
         * @param {String} key
         * @return {boolean}
         */
        getBoolean: function(key) {
            return this.get(key) === true;
        },

        /**
         * Returns a number if the value for the provided key can be converted to one.
         * Good for retrieving content ids to check truthiness (e.g. '0' is truthy but 0 is falsy).
         *
         * @method getNumber
         * @param {String} key
         * @return {number}
         */
        getNumber: function(key) {
            return +this.get(key);
        },

        /**
         * Mainly for use when debugging, returns all Data pairs in a map for eyeballing.
         * @return {object}
         */
        getAllAsMap: function() {
            var map = {};
            document.querySelectorAll('meta[name^="ajs-"]').forEach(function(meta) {
                map[meta.getAttribute('name').substring(4)] = meta.getAttribute('content');
            });
            return Object.assign(map, overrides);
        }
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/meta', 'AJS.Meta');
