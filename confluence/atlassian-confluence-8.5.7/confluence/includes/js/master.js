/**
 * @module confluence/master
 */
/* eslint @atlassian/confluence-server/no-confluence-getcontextpath:0 */
define('confluence/master', [
    'confluence/effects',
    'ajs',
    'confluence/legacy',
    'jquery'
], function(
    Effects,
    AJS,
    Confluence,
    $
) {
    'use strict';

    var Master = {};

    Master.init = function($) {
        // Moved out of macros.vm displayGlobalMessages
        $('#messageContainer').find('.confluence-messages').each(function() {
            var message = this;
            if (!Effects.getCookie(message.id)) {
                $(message).show();
                $('.message-close-button', message).click(function() {
                    $(message).slideUp();
                    Effects.setCookie(message.id, true);
                });
            }
        });
    };

    Master.domready1 = function() {
        // Stops the same plugin having 18n loaded twice.
        var loadedPlugins = {};

        /**
         * @deprecated Since 5.7. I18n translations are not performed using a web-resource transformer by regex'ing for
         * usages of AJS.I18n.getText('i18n.key') and replacing them with the appropriate translated string. This code can
         * safely be removed if no Javascript references remain to AJS.I18n.keys, AJS.I18n.get() and AJS.I18n.load()
         */
        AJS.I18n = {
            keys: {},

            /**
             * Get the I18n keys for the current user. This should be called immediately on script load.
             *
             * Note: requests are cached with last modified headers by the REST service
             */
            get: function(pluginKey, successCallback, errorCallback) {
                var loaded = true;
                var url = AJS.contextPath() + '/rest/prototype/1/i18n';
                var data = {
                    locale: AJS.params.userLocale // request should be cached against the user's locale
                };
                // load multiple plugins
                if ($.isArray(pluginKey)) {
                    for (var key in pluginKey) {
                        if (!loadedPlugins[key]) {
                            loaded = false;
                        }
                    }
                    data.pluginKeys = pluginKey;
                } else { // load one plugin
                    loaded = loadedPlugins[pluginKey];
                    url += '/' + pluginKey;
                }

                if (loaded) {
                    if (typeof successCallback === 'function') {
                        successCallback(AJS.I18n.keys);
                    }
                    return;
                }

                $.ajax({
                    url: url,
                    data: data,
                    dataType: 'json',
                    success: function(data) {
                        AJS.I18n.load(data);
                        loadedPlugins[pluginKey] = true;
                        if (typeof successCallback === 'function') {
                            successCallback(data);
                        }
                    },
                    error: function(request, textStatus) {
                        AJS.log('Error loading I18n for ' + pluginKey + ':' + textStatus);
                        if (typeof errorCallback === 'function') {
                            errorCallback(textStatus);
                        }
                    }
                });
            },
            load: function(data) {
                $.extend(AJS.I18n.keys, data);
            },
            /**
             * Returns the i18n string for the provided key. This method should only be called in the callback of
             * AJS.I18n.load() to ensure that the translations are loaded.
             *
             * First looks in AJS.params with the given key prefixed with "i18n.". If not found, it will try to
             * look it up in the prefetched calls to AJS.I18n.load(). The original key is returned if translations
             * could not be found.
             *
             * @param i18nKey an i18n key. Should be the same as entered in an i18n .properties file.
             * @param args either an array of strings or a string, optionally followed by more string parameters
             */
            getText: function(i18nKey, args) {
                var text = AJS.params['i18n.' + i18nKey] || AJS.I18n.keys[i18nKey] || i18nKey;
                if (!args) {
                    return text;
                }

                if (arguments.length === 2 && args instanceof Array) {
                    // User has passed an array as the second method argument
                    args.unshift(text);
                } else {
                    // User has passed varargs
                    args = Array.prototype.slice.call(arguments, 0);
                    args[0] = text;
                }
                return AJS.format.apply(AJS, args);
            }
        };
    };

    Master.domready2 = function() {
        /**
         * @deprecated since 7.2. Use String.trim directly instead.
         * @type {*|Function}
         * @param {string} str
         * @return {string} str trimmed of leading and trailing whitespace
         */
        AJS.trim = AJS.trim || function(str) {
            if (!str) {
                return '';
            }
            return str.trim();
        };
    };

    /**
     * @deprecated Since 4.0. Use the Confluence namespace instead.
     * AJS.General.getContextPath is still in use by embedded-crowd-admin-plugin and cannot be removed until it's removed
     * from that plugin.
     */
    Master.General = {
        /**
         * @deprecated Use AJS.contextPath instead.
         */
        getContextPath: Confluence.getContextPath,
        /**
         * @deprecated Use Confluence.getBaseUrl instead.
         */
        getBaseUrl: Confluence.getBaseUrl
    };

    /**
     * Makes the current element selectable with effects by adding 'hover' and 'selected' class names.
     *
     * This is typically used for table row elements which can be selected.
     *
     * @param container the parent container which contains all selectable elements
     * @param onSelect the function to be invoked when the element is clicked on.
     * It should take two parameters, the element that was clicked on followed by the properties.
     * @param properties the properties to be stored against the element and passed into the onSelect function.
     */
    Master.selectableEffects = function(container, onSelect, properties) {
        var el = $(this);
        if (properties) {
            el.data('properties', properties);
        }
        el.click(function(e) {
            var $this = $(this);
            if (onSelect) {
                onSelect(this, $this.data('properties'));
            }

            container.find('.selected').removeClass('selected');
            $this.addClass('selected');
            e.stopPropagation();
            return false;
        });
        el.hover(function() {
            $(this).addClass('hover');
        }, function() {
            $(this).removeClass('hover');
        });
    };

    /**
     * Shortens the set of elements by replacing the last character of each with ellipsis
     * until the condition returns true. Typical usage:
     *
     *   $("#some-list li").shortenUntil(function () { return $("#some-list").width() < 500; });
     *
     * @param condition shortening of elements will happen until this function returns true
     */
    Master.shortenUntil = function(condition) {
        var current = 0;
        while (!condition() && current < this.length) {
            var currentText = $(this[current]).text();
            if (currentText === '\u2026') {
                current++;
            } else {
                $(this[current]).text(currentText.replace(/[^\u2026]\u2026?$/, '\u2026'));
            }
        }
        return this;
    };

    return Master;
});

require('confluence/module-exporter').safeRequire('confluence/master', function(Master) {
    'use strict';

    var AJS = require('ajs');
    var $ = require('jquery');
    AJS.toInit(Master.init);
    AJS.General = Master.General;
    (Master.domready1)();
    (Master.domready2)();
    $.fn.selectableEffects = Master.selectableEffects;
    $.fn.shortenUntil = Master.shortenUntil;
});
