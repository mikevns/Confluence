/**
 * @module confluence/quicksearchdropdown
 */
define('confluence/quicksearchdropdown', [
    'jquery',
    'ajs',
    'window',
    'document',
    'confluence/input-driven-dropdown'
], function(
    $,
    AJS,
    window,
    document,
    InputDrivenDropDown
) {
    'use strict';

    /**
     * jQuery plugin that displays a quicksearch drop down for the current input element.
     * <br>
     * Options are:
     * <li>makeParams - a function that will return query parameters</li>
     * <li>makeRestMatrixFromData - a function that will build a rest matrix as expected by InputDrivenDropDown</li>
     * <li>addDropdownData - a function that will add extra data to the matrix. This is only valid if
     * makeRestMatrixFromData is specified.
     * </li>
     * See InputDrivenDropDown for additional options.
     *
     * @class quicksearch
     * @namespace $
     * @extends jQuery
     * @requires InputDrivenDropDown
     * @constructor
     * @param path {String|Function} a function or string to the JSON url
     * @param onShow {Function} DEPRECATED. Put on the options object instead.
     * @param options {Object}
     */
    function QuickSearchDropDown(path, onShow, options) {
        if (onShow) {
            options.onShow = onShow;
        }
        options.makeParams = options.makeParams || function(val) {
            return {
                query: val
            };
        };
        var getMatrix = function(json) {
            var hasErrors = json.statusMessage; // right now, we are overloading the existence of a status message to imply an error

            var matrix;
            if (hasErrors) {
                matrix = [[{ html: json.statusMessage, className: 'error' }]];
            } else if (options.makeRestMatrixFromData) {
                var restMatrix = options.makeRestMatrixFromData(json);
                matrix = AJS.REST.convertFromRest(restMatrix);
                if (options.addDropdownData) {
                    matrix = options.addDropdownData(matrix);
                }
            } else {
                matrix = json.contentNameMatches;
            }
            return matrix;
        };

        var getPath;
        var oldPath;
        if (typeof path === 'function') {
            oldPath = path();
            getPath = function(control) {
                var newPath = path();
                if (newPath != oldPath) {
                    oldPath = newPath;
                    control.clearCache();
                }
                return newPath;
            };
        } else {
            getPath = function() {
                return path;
            };
        }

        options.getDataAndRunCallback = options.getDataAndRunCallback || function(val, callback) {
            var control = this; // the input driven drop down
            var url = getPath(control, val);

            // By default, include the Url prefix
            // X-Product QuickNav will call this with options.includeUrlPrefix = false
            if (options.includeUrlPrefix == undefined || options.includeUrlPrefix) {
                url = (AJS.Meta.get('context-path') || '') + url;
            }

            var lastRequest = $.data(control, 'lastRequest');
            if (lastRequest) {
                lastRequest.abort();
            }

            var request = $.ajax({
                type: 'GET',
                dataType: 'json',
                url: url,
                xhrFields: {
                    withCredentials: true
                },
                data: options.makeParams(val),
                success: function(json, resultStatus) {
                    $(window).trigger('quicksearch.ajax-success', { url: url, json: json, resultStatus: resultStatus });
                    if (document.activeElement != qsinput[0]) { return; }

                    var matrix = getMatrix(json);

                    if (json.results && json.results.length > 0) {
                        callback.call(control, matrix, val, json.queryTokens);
                    } else {
                        callback.call(control, matrix);
                    }
                },
                global: false,
                timeout: 5000,
                error: function(xhr, resultStatus, e) { // ajax error handler
                    $(window).trigger('quicksearch.ajax-error', {
                        url: url, xmlHttpRequest: xhr, resultStatus: resultStatus, errorThrown: e
                    });
                    if (document.activeElement != qsinput[0]) { return; }

                    if (resultStatus == 'timeout') {
                        var matrix = getMatrix({ statusMessage: 'Timeout', query: val });
                        callback.call(control, matrix, null);
                    }
                },
                complete: function() {
                    $.removeData(control, 'lastRequest');
                    qsinput.trigger('quick-search-loading-stop');
                }
            });
            $.data(control, 'lastRequest', request);

            qsinput.trigger('quick-search-loading-start');
        };
        var idd = new InputDrivenDropDown('inputdriven-dropdown', options);
        var qsinput = $(this);

        qsinput.keyup(function(e) {
            if (e.which === 13 || e.which === 9) {
                return;
            }
            !qsinput.hasClass('placeholded') && idd.change(this.value, false, function(value) {
                qsinput.attr('data-last-search', value);
            });
        });
        qsinput.quickSearchControl = idd;

        qsinput.bind('clearCache.autocomplete', function() {
            idd.clearCache();
        });
        qsinput.bind('hide.autocomplete', function() {
            idd.hide();
        });

        return qsinput;
    }

    return QuickSearchDropDown;
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/quicksearchdropdown', 'AJS.$.fn.quicksearch');
