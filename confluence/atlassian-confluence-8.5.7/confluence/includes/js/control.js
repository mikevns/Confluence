/**
 * @module confluence/control
 */
define('confluence/control', [
    'confluence/class',
    'confluence/trigger',
    'confluence/api/logger',
    'confluence/api/keyboard',
    'jquery',
    'document'
], function(
    Class,
    trigger,
    logger,
    Keyboard,
    $,
    document
) {
    'use strict';

    // TODO CONFDEV-4208 - note, this is forked from JIRA code as of r142772 - if it works in Confluence it should be moved to AUI. dT
    // See https://atlaseye.atlassian.com/browse/jira/jira/trunk/jira-components/jira-webapp/src/main/webapp/includes/ajs/control/Control.js
    // for the original.


    /**
     * An abstract class, providing utility methods helpful when building controls
     *
     * @constructor Control
     */
    return Class.extend({

        INVALID: 'INVALID',

        /**
         * An error for people trying to access private properties
         *
         * @method _throwReadOnlyError
         * @param property - property attempted to be read
         */
        _throwReadOnlyError: function(property) {
            new Error(this.CLASS_SIGNATURE + ': Sorry [' + property + '] is a read-only property');
        },

        /**
         * Allows binding of multiple events via a group. Event groups are stored under the _events property of the class.
         *
         * @method _assignEvents
         * @protected
         * @param {String} group - name of object group containing events
         * @param {String | HTMLElement | jQuery} $target - element to bind events to
         */
        _assignEvents: function(group, $target) {
            this._unassignEvents(group, $target); // Prevent duplicate event handlers.
            if (typeof $target === 'string') {
                for (var eventType in this._events[group]) {
                    $(document).delegate($target, eventType, this._getDispatcher(group, eventType));
                }
            } else {
                $target = $($target);
                for (eventType in this._events[group]) {
                    $target.bind(eventType, this._getDispatcher(group, eventType));
                    logger.debug('Control bound eventType \'' + eventType + '\' for group \'' + group + '\' on target \'' + ($target[0].type || $target[0]) + '\'');
                }
            }
        },

        /**
         * Allows unbinding of multiple events via a group. Event groups are stored under the _events property of the class.
         *
         * @method _assignEvents
         * @protected
         * @param {String} group - name of object group containing events
         * @param {String | HTMLElement | jQuery} $target - element to unbind events from
         */
        /*eslint-disable */
        _unassignEvents: function (group, $target) {
            if (typeof $target === "string") {
                for (var eventType in this._events[group]) {
                    $(document).undelegate($target, eventType, this._getDispatcher(group, eventType));
                }
            } else {
                $target = $($target);
                try {
                    for (eventType in this._events[group]) {
                        $target.unbind(eventType, this._getDispatcher(group, eventType));
                    }
                } catch (err) {
                    // jQuery 1.4.2 can't unbind events on abstract targets. Remove event handlers manually.
                    var events = $._data($target[0], "events");
                    if (events) {
                        for (eventType in events) {
                            if (eventType in this._events[group]) {
                                var dispatcher = this._getDispatcher(group, eventType);
                                var handlers = events[eventType];
                                for (var i = 0; i < handlers.length; i++) {
                                    if (handlers[i] === dispatcher) {
                                        handlers.splice(i, 1);
                                        break;
                                    }
                                }
                                logger.debug("Control unbound eventType '" + eventType + "' for group '" + group + "' on target '" + ($target[0].type || $target[0]) + "'");
                            }
                        }
                    }
                }
            }
        },
        /* eslint-enable */

        /**
         * Helper method for _assignEvents, _unassignEvents
         *
         * @param {string} group
         * @param {string} eventType
         */
        _getDispatcher: function(group, eventType) {
            var ns = group + '/' + eventType;
            if (!this._dispatchers) {
                this._dispatchers = {};
            }
            if (!this._dispatchers[ns]) {
                var handler = this._events[group][eventType];
                var instance = this;
                this._dispatchers[ns] = function(event) {
                    logger.debug('Control dispatching eventType \'' + eventType + '\' for group \'' + group + '\' on instance \'' + instance.type + '\'');
                    return handler.call(instance, event, $(this));
                };
            }
            return this._dispatchers[ns];
        },

        /**
         * @method _isValidInput
         * @return {Boolean}
         */
        _isValidInput: function() {
            return true;
        },

        /**
         * A more descriptive way to handle key events. Use this method to delegate key events to the keys property map.
         *
         * An example of a keys property map looks like this (property names should be a shortcut as supported by
         * Keyboard.shortcutEntered; the 'onEdit' key handles editing the input):
         *
         * keys: {
         *      "ctrl+a": function (e) {
         *           // handle ctrl+a
         *      },
         *      "return": function (e) {
         *          // do something on enter/return
         *      },
         *      onEdit: function (e, character) {
         *         // handle input edited (character may be undefined, e.g., during backspace or delete).
         *      }
         * }
         *
         * @method _handleKeyEvent
         * @param {Object} e - event object
         */
        _handleKeyEvent: function(e) {
            var instance = this;
            if (instance._isValidInput(e)) {
                var SpecialKey = Keyboard.SpecialKey;
                var shortcut = Keyboard.shortcutEntered(e);
                if (shortcut) {
                    if (instance.keys[shortcut]) {
                        instance.keys[shortcut].call(instance, e);
                        return;
                    } if ((shortcut === SpecialKey.BACKSPACE || shortcut === SpecialKey.DELETE) && instance.keys.onEdit) {
                        instance.keys.onEdit.call(instance, e);
                        return;
                    }
                }

                var character = Keyboard.characterEntered(e);
                if (character && instance.keys.onEdit) {
                    instance.keys.onEdit.call(instance, e, character);
                }
            }
        },

        /**
         * Appends the class signature to the event name for more descriptive and unique event names.
         *
         * @method getCustomEventName
         * @param {String} methodName
         * @return {String}
         */
        getCustomEventName: function(methodName) {
            return (this.CLASS_SIGNATURE || '') + '_' + methodName;
        },

        /**
         * Gets default arguments to be passed to the custom event handlers
         *
         * @method _getCustomEventArgs
         * @protected
         * @return {Array}
         */
        _getCustomEventArgs: function() {
            return [this];
        },

        /**
         * Used to fire custom events on the Control instance.
         *
         * @method trigger
         * @param {String} event -- The name of the event to trigger.
         */
        trigger: function(event) {
            return trigger(event, this);
        },

        /**
         * Does the browser support css3 box shadows
         *
         * @method _supportsBoxShadow
         * @return {Boolean}
         */
        _supportsBoxShadow: function() {
            var s = document.body.style;
            return s.WebkitBoxShadow !== undefined || s.MozBoxShadow !== undefined || s.boxShadow !== undefined;
        },


        /**
         * Overrides default options with user options. If the element property is set to a field set, it will attempt
         * to parse options the options from fieldset
         *
         * @method _setOptions
         * @param options
         * @return {String | undefined} if invalid will return this.INVALID
         */
        _setOptions: function(options) {
            var element;
            var optionsFromDOM;

            options = options || {};

            // just supplied element selector
            if (options instanceof $ || typeof options === 'string' || (typeof options === 'object' && options.nodeName)) {
                options = { element: options };
            }

            element = $(options.element);

            optionsFromDOM = element.getOptionsFromAttributes();

            this.options = $.extend(true, this._getDefaultOptions(options), optionsFromDOM, options);

            if (element.length === 0) {
                return this.INVALID;
            }

            return undefined;
        },

        /**
         * Gets position of carot in field
         *
         * @method getCaret
         * @param {HTMLElement} node
         * @return {Number} - The caret position within node, or -1 if some text is selected (and no unique caret position exists).
         */
        getCaret: function(node) {
            var startIndex = node.selectionStart;

            if (startIndex >= 0) {
                return (node.selectionEnd > startIndex) ? -1 : startIndex;
            }

            if (document.selection) {
                var textRange1 = document.selection.createRange();

                if (textRange1.text.length === 0) {
                    var textRange2 = textRange1.duplicate();

                    textRange2.moveToElementText(node); // Set textRange2 to select all text in node.
                    textRange2.setEndPoint('EndToStart', textRange1); // Set the end point of textRange2 to the start point of textRange1.

                    return textRange2.text.length;
                }
            }

            return -1;
        },


        /**
         * Delegates DOM rendering
         *
         * @method _render
         * @protected
         * @return {jQuery}
         */
        _render: function() {
            var i;
            var name = arguments[0];
            var args = [];

            for (i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            return this._renders[name].apply(this, args);
        }
    });
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/control', 'AJS.Control');
