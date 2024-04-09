/**
 * Provides a function that returns a dictionary for storing key value pairs.
 * @module confluence/api/dictionary
 */
define('confluence/api/dictionary', [], function() {
    'use strict';

    return function() {
        var dictionary = {};

        return {
            /**
             * Get a value corresponding to a particular key
             *
             * @param {string} key The key corresponding to the value you wish to retrieve.
             *
             * @returns {*} value
             */
            get: function(key) {
                return dictionary[key];
            },
            /**
             * Add a new key value pair to the dictionary.
             *
             * @param {string} key The key
             * @param {*} value The value
             *
             * @returns value
             */
            put: function(key, value) {
                dictionary[key] = value;
                return value;
            },
            /**
             * Removes all key value pairs
             */
            reset: function() {
                dictionary = {};
            },
            /**
             * Returns an object containing all key value pairs
             *
             * @returns {object} dictionary object
             */
            elements: function() {
                return dictionary;
            }
        };
    };
});
