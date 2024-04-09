/**
 * @module confluence/api/mouse
 */
// TODO CONFDEV-4208 - note, this is forked from JIRA code as of r142772 - if it works in Confluence it should be moved to AUI. dT
// See https://atlaseye.atlassian.com/browse/jira/jira/trunk/jira-components/jira-webapp/src/main/webapp/includes/ajs/input/Mouse.js?r=142772
// for the original.
define('confluence/api/mouse', [
    'jquery',
    'window'
], function(
    $,
    window
) {
    'use strict';

    /**
     * Utility methods and classes for the mouse.
     *
     * @exports confluence/api/mouse
     */
    var Mouse = {};

    /**
     * Detects actual mouse movements, rather than mousemoves triggered by
     * content changing beneath a stationary mouse.
     *
     * @constructor
     */
    Mouse.MotionDetector = function() {
        this.reset();
    };

    /**
     * @private
     */
    Mouse.MotionDetector.prototype.reset = function() {
        /**
         * Event handler we bind so that we can unbind.
         * @private
         */
        this._handler = null;

        this._x = null;
        this._y = null;

        /**
         * Whether there was an actual mouse movement since last waiting.
         */
        this.moved = false;
    };

    /**
     * Wait for the first mousemove that changes the mouse's position.
     *
     * To be notified, you can either provide a callback or query the moved
     * property. You are only notified, at most, once per proper mouse
     * movement, i.e., you'll need to reactivate the motion detector by
     * calling wait if you need it again.
     *
     * You must call unbind when you no longer require the motion detector.
     *
     * @param {function(this:document, event)} eventHandler optional callback
     */
    Mouse.MotionDetector.prototype.wait = function(eventHandler) {
        var instance = this;
        if (!instance._handler) {
            this.reset();
            // If we're in an iframe, we need to listen to this event on the topmost window's document.
            $(window.top.document).bind('mousemove', instance._handler = function(e) {
                if (!instance._x && !instance._y) {
                    // Trap first mousemove in case it was caused by content changing underneath a stationary mouse.
                    instance._x = e.pageX;
                    instance._y = e.pageY;
                } else if (!(e.pageX === instance._x && e.pageY === instance._y)) {
                    instance.unbind();
                    instance.moved = true;
                    if (eventHandler) {
                        eventHandler.call(this, e);
                    }
                }
            });
        }
    };

    /**
     * Release resources required by the motion detector.
     *
     * If you call wait, you must call this method when you no longer require
     * the motion detector.
     */
    Mouse.MotionDetector.prototype.unbind = function() {
        if (this._handler) {
            $(window.top.document).unbind('mousemove', this._handler);
            this.reset();
        }
    };

    return Mouse;
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/api/mouse', 'AJS.Mouse');
