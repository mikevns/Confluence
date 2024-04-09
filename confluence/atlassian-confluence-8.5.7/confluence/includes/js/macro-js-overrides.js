/**
 * A specialised dictionary containing information needed for connect apps to override certain functionality in Confluence.
 * Javascript in Connect adds functions/data to this dictionary, which is then consumed from within Confluence.
 * @module confluence/macro-js-overrides
 */
define('confluence/macro-js-overrides', [
    'confluence/api/dictionary',
    'underscore'
], function(
    Dictionary,
    _
) {
    'use strict';

    var dictionary = new Dictionary();

    return _.extend(dictionary, {

        /**
         *
         * A utility method for collecting a function associated with a macro name. This is the most common use case for this dictionary.
         *
         * @param {String} macroName The name of the macro
         * @param {String} functionName The name of the function to get
         *
         * @returns {function | undefined}
         *
         */
        getFunction: function(macroName, functionName) {
            var value = dictionary.get(macroName);
            if (value && typeof value[functionName] === 'function') {
                return value[functionName];
            }
            return undefined;
        },

        /**
         *
         * Adds new properties to an existing macro without replacing what's already there.
         *
         * @param {String} macroName The name of the macro
         * @param {String} newObject An object containing properties to associate with the specified macro.
         *
         * @returns {void}
         *
         */
        assignFunction: function(macroName, newObject) {
            dictionary.put(
                macroName,
                _.extend({}, dictionary.get(macroName), newObject)
            );
        }
    });
});
