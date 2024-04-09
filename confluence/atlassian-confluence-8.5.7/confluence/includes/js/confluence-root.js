/* eslint-disable @atlassian/confluence-server/no-confluence-getcontextpath */
/* eslint-disable @atlassian/confluence-server/confluence-amd-module-names */
define('confluence/root', [
    'ajs',
    'confluence-rest/confluence-rest',
    'confluence/api/logger',
    'confluence/meta',
    'jquery',
    'window'
], function(
    AJS,
    legacyRest,
    logger,
    Meta,
    $,
    window
) {
    'use strict';

    /**
     * Generic Confluence helper functions.
     *
     * @static
     * @since 3.3
     * @exports confluence/root
     * @requires AJS, jQuery
     */
    var Confluence = {};

    /**
     * Returns the context path defined in the 'ajs-context-path' meta tag.
     *
     * e.g. /confluence
     *
     * @method getContextPath
     * @return {String}
     */
    Confluence.getContextPath = function() {
        return Meta.get('context-path');
    };

    /**
     * Returns the configured Confluence base url. This is retrieved from a meta tag.
     *
     * @method getBaseUrl
     * @return {String}
     */
    Confluence.getBaseUrl = function() {
        return $('#confluence-base-url').attr('content') || '';
    };

    /**
     * Returns the product Build Number defined in the 'ajs-build-number' meta tag.
     *
     * e.g. 2021
     *
     * @method getBuildNumber
     * @return {String}
     */
    Confluence.getBuildNumber = function() {
        return Meta.get('build-number');
    };

    /**
     * Returns the ID of the appropriate content object to use when rendering the editor's content.
     * For pages, blogs, existing comments or drafts it is the ID of that object.
     * For new comments it is the ID of the page or blog to which the comment belongs.
     */
    Confluence.getContentId = function() {
        var id = Meta.get('content-id');
        if (!+id) {
            id = Meta.get('page-id');
        }
        if (!+id) {
            id = '0'; // ensure we always return "0" or an actual id.
        }
        return id;
    };

    /**
     * @return the XSRF token for the current page.
     */
    Confluence.getXsrfToken = function() {
        return Meta.get('atl-token');
    };

    /**
     * Binder components, in the AJS.Confluence.Binder namespace are executed.
     * This can be called when new elements are added to the page after page load
     * (e.g. dialog is created) and the components need to bound to the new elements.
     *
     * @method runBinderComponents
     */
    Confluence.runBinderComponents = function() {
        for (var i in Confluence.Binder) {
            if (Confluence.Binder.hasOwnProperty(i)) {
                try {
                    Confluence.Binder[i]();
                } catch (e) {
                    logger.logError('Exception in initialising of component \'' + i + '\': ' + e.message);
                }
            }
        }
    };

    /**
     * @deprecated Use AJS.Confluence.Binder.placeFocus instead.
     */
    Confluence.placeFocus = function() {
        Confluence.Binder.placeFocus();
    };

    /**
     * Unescapes am xml-encoded string into raw format.
     * @method unescapeEntities
     * @param str
     * @returns unescaped string
     */
    Confluence.unescapeEntities = function(str) {
        var entities = {
            amp: '&',
            lt: '<',
            gt: '>',
            '#39': '\'',
            quot: '"'
        };

        if (str == null) {
            return str;
        }

        return ('' + str).replace(/&[#\d\w]+;/g, function(c) {
            // remove the '&' and ';'
            var encoded = c.substring(1, c.length - 1);
            return entities[encoded] || c;
        });
    };

    /**
     * Checks that the remote-user is still logged in, and displays a message if not.
     */
    Confluence.sessionCheck = function($container, message) {
        var remoteUser = Meta.get('remote-user');
        if (!remoteUser) { return; } // anonymous users are ok.

        var url = this.getContextPath() + legacyRest.REST.getBaseUrl() + 'session/check/' + remoteUser;
        var that = this;

        // Return the Deferred object so that callers can take further action on failure, if necessary.
        return $.getJSON(url)
            .done(function() {
                logger.debug('SESSION CHECK - OK - ' + remoteUser);
            })
            .fail(function() {
                logger.log('SESSION CHECK - FAIL - ' + remoteUser);
                that.sessionFail($container, message);
            });
    };

    /**
     * Shows a message in a container.
     *
     * FIXME - could be more generic, split out the session code from the fancy container + message code.
     *
     * @param $container (optional) if blank, the container is assumed to be a dialog
     * @param message (optional) if blank, the session-timeout message is shown
     */
    Confluence.sessionFail = function($container, message) {
        if (!$container) {
            // Try to guess! If a dialog is visible, that's probably it.
            var visibleDialog = $('.aui-dialog:visible');
            if (visibleDialog.length) {
                // Don't hide the dialog heading/buttons, so that the unfortunate user isn't too 'lost'.
                $container = visibleDialog.find('.dialog-panel-body').empty();

                // Disable the dialog buttons, though - people shouldn't be tempted to press things.
                visibleDialog.find('.aui-button').attr('disabled', 'disabled');
            } else {
                throw new Error('sessionFail method really expected a visible dialog about now :/');
            }
        }

        if (!message) {
            var startTag = '<a class="reload" href="">';
            var endTag = '</a>';
            message = AJS.I18n.getText('user.session.timed.out', startTag, endTag);
            $container.on('click', 'a.reload', function() {
                window.location.reload();
            });
        }

        AJS.messages.warning($container, {
            body: message,
            closeable: false,
            shadowed: true
        });
    };

    /**
     * Binders are components that bind, dependent on the markup in the page.
     * <p>
     * Objects added to the AJS.Confluence.Binder namespace are run on page load and must be
     * functions which can be executed several times on a page.
     *
     * @namespace
     */
    Confluence.Binder = {
        /**
         * Automatically place the focus on an input field with class 'data-focus'.  The element
         * with the highest value wins.  If more than one index has the same value, one will be picked
         * indeterminately.
         *
         * Note, we could use the HTML5 autofocus attribute, but it only expects one element in the document
         * to have such an attribute specified.
         *
         * @method placeFocus
         */
        placeFocus: function() {
            var element;
            var max = -1;
            $('input[data-focus]').each(function() {
                var $this = $(this);
                var thisFocus = $this.attr('data-focus');
                if (thisFocus > max) {
                    max = thisFocus;
                    element = $this;
                }
            });
            element && element.focus();
        }
    };

    /**
     * Manager to get hints in sequential order from a random
     * point in the given array of hints.
     *
     * @method hintManager
     * @param {Array} hints an array of hints
     */
    Confluence.hintManager = function(hints) {
        if (!$.isArray(hints)) {
            throw new Error('Hints passed in must be an array of strings');
        }

        var nextHint = Math.floor(Math.random() * hints.length);

        return {
            getNextHint: function() {
                var hint = hints[nextHint];
                nextHint = (nextHint + 1) % hints.length;
                return hint;
            }
        };
    };

    Confluence.debugTime = function(key) {
        if (AJS.debugEnabled() && console.time) {
            console.log(key + ' started');
            console.time(key);
        }
    };

    Confluence.debugTimeEnd = function(key) {
        if (AJS.debugEnabled() && console.timeEnd) {
            console.timeEnd(key);
        }
    };

    return Confluence;
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/root', 'Confluence', function(Confluence) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(function() {
        Confluence.runBinderComponents();
    });

    /**
     * @deprecated since 4.0, Use Confluence instead.
     */
    AJS.Confluence = Confluence;
});
