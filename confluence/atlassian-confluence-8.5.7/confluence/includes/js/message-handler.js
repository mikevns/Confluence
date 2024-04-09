/**
 * @module confluence/message-handler
 */
define('confluence/message-handler', [
    'jquery',
    'ajs'
], function(
    $,
    AJS
) {
    'use strict';

    // Represents a default message-handling controller.
    // Expects a context with a message container as the baseElement.
    // By default, errors will be added to an unordered list element directly inside this container.
    var getDefaultController = function(context) {
        var getMessageContainer;
        var getMessageList;

        // Returns the message container that is generally shown and hidden based on whether messages exist.
        getMessageContainer = function() {
            return context.baseElement;
        };

        // Returns a new or existing list element inside the message container
        getMessageList = function(messageContainer) {
            var messageList = $('ul', messageContainer);
            if (!messageList.length) {
                messageList = $('<ul></ul>').appendTo(messageContainer);
            }
            return messageList;
        };

        return {

            getMessageContainer: getMessageContainer,

            // Removes any messages from the container and hides it.
            clearMessages: function() {
                getMessageContainer().addClass('hidden').empty();
            },

            // Adds errors to the container and displays it
            displayMessages: function(messages) {
                if (!messages || !messages.length) { return; }
                if (!$.isArray(messages)) { messages = [messages]; }

                var messageContainer = getMessageContainer();
                var messageList = getMessageList(messageContainer);

                for (var i = 0, ii = messages.length; i < ii; i++) {
                    $('<li></li>').text(messages[i]).appendTo(messageList);
                }
                messageContainer.removeClass('hidden');
            },

            // Extracts XWork-style errors from a response object and displays them.
            // Returns true if errors were found and handled, false otherwise.
            handleResponseErrors: function(response, defaultMessage) {
                var errors = [].concat(response.validationErrors || []).concat(response.actionErrors || []).concat(response.errorMessage || []);
                if (errors.length) {
                    this.displayMessages(defaultMessage || errors);
                    return true;
                }
                return false;
            }
        };
    };

    /**
     * Handles the display of messages in a container.
     *
     * @param context with:
     *  - baseElement: the DOM element containing the message container, or the message container itself
     *
     *  @param getOverrideController (optional), a function that takes the context and returns a controller
     */
    var MessageHandler = function(context, getOverrideController) {
        var controller = $.extend(
            getDefaultController(context),
            getOverrideController && getOverrideController(context)
        );

        // Used for styling messages consistently
        controller.getMessageContainer().addClass('message-handler');

        controller.clearMessages();
        return controller;
    };

    var closeOnNew = false;
    var actionMessagesContainer;

    /**
     * If set to true, new messages will close old messages automatically.
     * @param val
     */
    MessageHandler.closeOnNew = function(val) {
        if (typeof val !== 'undefined') {
            closeOnNew = val;
        } else {
            return closeOnNew;
        }
    };

    MessageHandler.message = function($container, body, level) {
        level = level || 'success';

        if (closeOnNew) {
            $container.empty();
        }

        return AJS.messages[level]($container, {
            body: body,
            closeable: true,
            shadowed: true
        });
    };

    MessageHandler.error = function($container, body) {
        return MessageHandler.message($container, body, 'error');
    };

    MessageHandler.actionMessage = function(body, level) {
        actionMessagesContainer = actionMessagesContainer || $($('#action-messages', '#action-messages-notifications')[0]);
        return MessageHandler.message(actionMessagesContainer, body, level);
    };

    MessageHandler.loading = function(body) {
        return MessageHandler.actionMessage(body, 'info');
    };

    MessageHandler.flag = function(options) {
        var Flag = require('aui/flag');
        return Flag($.extend({}, {
            type: 'success',
            close: 'manual'
        }, options));
    };

    return MessageHandler;
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/message-handler', 'AJS.MessageHandler');
