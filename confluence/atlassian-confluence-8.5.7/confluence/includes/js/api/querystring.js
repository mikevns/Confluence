/**
 * Converts querystrings from a string to an object and back again.
 * @module confluence/api/querystring
 */
define('confluence/api/querystring', [
],
function(
) {
    'use strict';

    return {
        /**
         * Parse an object and returns a querystring.
         *
         * @example
         * // Returns "max-result=10&project-key=CONF"
         * querystring.stringify({ "max-result" : [ "10" ], "project-key" : [ "CONF" ] })
         *
         * @deprecated since 7.19.14 Use stringifyMap instead of this function
         * @param {Object} queryParams Parameters from which to build the query string. These parameters should already be
         * URL encoded as buildQueryString does not add additional encoding
         *
         * @returns {String}
         *
         */
        /* eslint-disable vars-on-top */
        stringify: function(queryParams) {
            var queryString = '';

            for (var param in queryParams) {
                for (var i = 0; i < queryParams[param].length; i++) {
                    queryString += '&' + param;
                    if (queryParams[param][i]) {
                        queryString += '=' + queryParams[param][i];
                    }
                }
            }

            return queryString.substring(1);
        },
        /**
         * Parse a map and returns a querystring.
         *
         * @example
         * // Returns "max-result=10&project-key=CONF"
         * querystring.stringifyMap(new Map([ [ 'max-result', [ '10' ] ], [ 'project-key', ['CONF'] ] ]))
         *
         * @param {Map} queryParams Parameters from which to build the query string. These parameters should already be
         * URL encoded as buildQueryString does not add additional encoding
         *
         * @returns {String}
         *
         */
        stringifyMap: function(queryParams) {
            var queryString = '';

            var queryParamsArray = Array.from(queryParams);
            for (var i = 0; i < queryParamsArray.length; i++) {
                var param = queryParamsArray[i][0];
                var values = queryParamsArray[i][1];
                for (var j = 0; j < values.length; j++) {
                    queryString += '&' + param;
                    if (values[j]) {
                        queryString += '=' + values[j];
                    }
                }
            }
            return queryString.substring(1);
        },
        /**
         * Parses a querystring and returns an object. Return an empty object if the querystring is an empty string or
         * undefined.
         *
         * @example
         * // Returns { "max-result" : [ "10" ], "project-key" : [ "CONF" ] }
         * querystring.parse("max-result=10&project-key=CONF");
         *
         * // Returns { "params" : [ "firstName", "lastName" ]}
         * querystring.parse("params=firstName&params=lastName");
         *
         * // Returns { "search" : [ "My%20favourites" ] } when executed on
         * // page http://www.mywebsite.com/?search=My%20Favourites
         * querystring.parse(window.location.search);
         *
         * @deprecated since 7.19.14 Use parseMap instead of this function
         * @param querystring The querystring that will be converted to an object.
         * @returns {Object}
         */
        parse: function(querystring) {
            var queryParams = {};

            if (querystring) {
                if (querystring.substr(0, 1) === '?') {
                    querystring = querystring.substr(1);
                }

                var parsedQueryString = querystring.split('&');

                for (var i = 0; i < parsedQueryString.length; i++) {
                    var parsedParamString = parsedQueryString[i].split('=');

                    if (!queryParams[parsedParamString[0]]) {
                        queryParams[parsedParamString[0]] = [];
                    }
                    // Don't use parsedParamString[1] to retrieve the parameter value in case of query strings such as "src=something=something"
                    // The '=' in the value will cause the string to be split
                    queryParams[parsedParamString[0]].push(parsedQueryString[i].substring(parsedParamString[0].length + 1));
                }
            }

            return queryParams;
        },
        /**
         * Parses a querystring and returns a Map. Return an empty map if the querystring is an empty string or
         * undefined.
         *
         * @param {String} querystring The querystring that will be converted to a map.
         * @returns {Map<String,Object>}
         */
        /* eslint-disable no-undef, no-param-reassign */
        parseMap: function(querystring) {
            var queryParams = new Map();

            if (querystring) {
                if (querystring.substr(0, 1) === '?') {
                    querystring = querystring.substr(1);
                }

                var parsedQueryString = querystring.split('&');

                for (var i = 0; i < parsedQueryString.length; i++) {
                    var parsedParamString = parsedQueryString[i].split('=');

                    if (!queryParams.has(parsedParamString[0])) {
                        queryParams.set(parsedParamString[0], []);
                    }
                    queryParams.get(parsedParamString[0]).push(parsedQueryString[i].substring(parsedParamString[0].length + 1));
                }
            }
            return queryParams;
        }
    };
});
