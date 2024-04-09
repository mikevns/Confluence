/**
 * Utility functions for converting between URL objects and strings.
 * @module confluence/api/url
 */
define('confluence/api/url', [
    'confluence/api/querystring',
    'jquery'
],
function(
    querystring,
    $
) {
    'use strict';

    var parseUriPattern = /([^?|#]+)[?]?([^#]*)[#]?(.*)/;
    var urlKeys = ['source', 'urlPath', 'queryParams', 'anchor'];

    return {
        /** Converts a URL to an object representing the URL.
         * @deprecated since 7.19.14 Use parseUrl instead of this function
         * @param {string} url
         * @returns {Object}
         */
        parse: function(url) {
            var urlComponents = {};
            var parsedUrl = parseUriPattern.exec(url);

            if (parsedUrl) {
                for (var i = 0; i < urlKeys.length; i++) {
                    urlComponents[urlKeys[i]] = parsedUrl[i];
                }
                urlComponents.queryParams = querystring.parse(urlComponents.queryParams);
            }

            return urlComponents;
        },
        /** Converts a URL to a map representing the URL.
         * @param {string} url
         * @returns {Map}
         */
        /* eslint-disable no-undef, vars-on-top */
        parseUrl: function(url) {
            var urlComponents = new Map();
            var parsedUrl = parseUriPattern.exec(url);

            if (parsedUrl) {
                for (var i = 0; i < urlKeys.length; i++) {
                    urlComponents.set(urlKeys[i], parsedUrl[i]);
                }
                urlComponents.set('queryParams', querystring.parseMap(urlComponents.get('queryParams')));
            }
            return urlComponents;
        },
        /** Converts a URL object to a string.
         * @deprecated since 7.19.14 Use formatUrl instead of this function
         * @param {Object} urlComponents
         * @returns {String}
         */
        format: function(urlComponents) {
            if ($.isEmptyObject(urlComponents)) {
                return '';
            }
            return (!urlComponents.urlPath ? '' : urlComponents.urlPath)
                        + ($.isEmptyObject(urlComponents.queryParams) ? '' : '?' + querystring.stringify(urlComponents.queryParams))
                        + (!urlComponents.anchor ? '' : '#' + urlComponents.anchor);
        },
        /** Converts a URL map to a string.
         * @param {Map} urlComponents
         * @returns {String}
         */
        formatUrl: function(urlComponents) {
            if (urlComponents.size === 0) {
                return '';
            }
            return (!urlComponents.get('urlPath') ? '' : urlComponents.get('urlPath'))
                        + (urlComponents.get('queryParams').size === 0 ? '' : '?' + querystring.stringifyMap(urlComponents.get('queryParams')))
                        + (!urlComponents.get('anchor') ? '' : '#' + urlComponents.get('anchor'));
        }
    };
});
