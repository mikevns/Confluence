/**
 * AUI Overrides
 *
 * As new versions of AUI are implemented, this JS
 * should be reviewed and adjusted as appropriate.
 *
 * @module confluence/aui-overrides
 */
define('confluence/aui-overrides', [
    'window',
    'ajs',
    'jquery',
    'confluence/api/type-helpers'
], function(
    window,
    AJS,
    $,
    TypeHelpers
) {
    'use strict';

    /**
     * Define a global jQuery reference. For a long time the global reference was defined by Workbox, causing
     * developers to rely on its presence and using $ instead of AJS.$ in their code. If Workbox was disabled,
     * the global reference would disappear and plugin Javascript code would fail.
     *
     * Since the Prototype library was discontinued in Atlassian products, there is no longer a conflict for declaring
     * $ in the global namespace. It is now safe to declare $ globally for these benefits:
     * 1. make it always available regardless of whether Workbox is enabled or not
     * 2. to fit the expectations of developers working on our products
     */
    window.$ = $;

    if (typeof AJS !== 'undefined') {
        /**
         * Confluence overrides AJS.populateParameters to copy data from meta tags to AJS.params which are consumed in Confluence.
         * In AUI 5.9, populateParameters is called in a closure, not globally any more,
         * which causes empty AJS.params object, failed http request in heartbeat and many other issues in the editor.
         *
         * This fix is to transfer the data from meta tag to AJS.params without overriding populateParameters of AUI.
         */
        metaToParams();
    }

    /**
     * @aui-override
     * Find parameters in the DOM and store them in the ajs.params object.
     * Override the AUI version so we can patch in AJS.Meta meta tag values for old scripts still using
     * AJS.params that *should* be using AJS.Meta.
     * The function is separated and its name is changed due to CONFDEV-40919.
     * @date 2011-03-17
     * @author dtaylor
     *
     */
    function metaToParams() {
        $('meta[name^=ajs-]').each(function() {
            var key = this.name;
            var value = this.content;

            // convert name from ajs-foo-bar-baz format to fooBarBaz format.
            key = key.substring(4).replace(/(-\w)/g, function(s) {
                return s.charAt(1).toUpperCase();
            });
            // Only set if not already defined
            if (typeof AJS.params[key] === 'undefined') {
                AJS.params[key] = TypeHelpers.asBooleanOrString(value);
            }
        });
    }

    /**
     * @aui-override Disable element extension to $
     *
     * @date 2009-09-23
     * @author dtaylor
     * @since confluence-3.1-m5
     *
     * @param element
     */
    function disable(element) {
        return this.each(function() {
            var el = $(this);
            if (el.is('a')) {
                el.css('pointer-events', 'none');
            }
            var id = el.prop('disabled', true).attr('aria-disabled', true).addClass('disabled').attr('id');
            if (id) {
                // Only search in the parent - element might not exist in the DOM yet.
                $('label[for=' + id + ']', el.parent()).addClass('disabled');
            }
        });
    }

    /**
     * @aui-override Enable element extension to $
     *
     * @date 2009-09-23
     * @author dtaylor
     * @since confluence-3.1-m5
     *
     * @param element
     */
    function enable(element) {
        return this.each(function() {
            var el = $(this);
            if (el.is('a')) {
                el.css('pointer-events', '');
            }
            var id = el.attr('disabled', false).attr('aria-disabled', false).removeClass('disabled').attr('id');
            if (id) {
                $('label[for=' + id + ']', el.parent()).removeClass('disabled');
            }
        });
    }

    /**
     * @aui-override Debounce function wrapper that ensures a function is not called more often than specified in delay.
     * A little bird told me that AUI is going to include underscore.js. Once it does, we can use underscore's version.
     *
     * @date 2012-06-20
     * @author nbhawnani
     * @since confluence-4.2.8
     *
     * @param delay Call the function exactly once in this amount of time.
     * @param callback The function to be debounced
     * @return A function that wraps the callback that calls the given function once per time period specified in delay.
     */
    function debounce(callback, delay) {
        var timeoutId;
        return function() {
            var that = this;
            var args = arguments;
            // if a timeout is already set, it means we've been called before the timeout expired
            if (timeoutId) {
                // discard the old timeout
                clearTimeout(timeoutId);
                timeoutId = undefined;
            }
            // create another one
            timeoutId = setTimeout(function() {
                callback.apply(that, args);
                timeoutId = undefined;
            }, delay);
        };
    }

    /**
     * @aui-override setVisible is remove from AUI 8. Just make sure it is visible for Confluence
     * @date 2019-04-30
     * @author dluong
     * @since confluence-7.0
     * @param {HTMLElement} element An element to be showed or hided.
     * @param {boolean} show Show or hide.
     * @returns {void}
    */
    function setVisible(element, show) {
        var $element = $(element);
        if (!$element) {
            return;
        }

        $(element).each(function() {
            var isHidden = $(this).hasClass('hidden');

            if (isHidden && show) {
                $(this).removeClass('hidden');
            } else if (!isHidden && !show) {
                $(this).addClass('hidden');
            }
        });
    }

    return {
        enable: enable,
        disable: disable,
        debounce: debounce,
        metaToParams: metaToParams,
        setVisible: setVisible
    };
});

require('confluence/module-exporter').safeRequire('confluence/aui-overrides', function(AUIOverrides) {
    'use strict';

    var Exporter = require('confluence/module-exporter');
    Exporter.namespace('AJS.$.debounce', AUIOverrides.debounce);
    Exporter.namespace('AJS.$.fn.enable', AUIOverrides.enable);
    Exporter.namespace('AJS.$.fn.disable', AUIOverrides.disable);
});
