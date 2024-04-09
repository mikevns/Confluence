define('confluence/message-controller', [
    'ajs',
    'jquery',
    'confluence/flag',
    'confluence/api/event',
    'confluence/api/logger'
    /**
     * Helper functions to simplify xhr error handling code.
     * Allows easy conversion of an xhr error response into an i18n string.
     * Also supports displaying an error flag or a warning banner at the top of the page.
     * @since 6.9.0
     */
], function(
    AJS,
    $,
    Flag,
    event,
    Logger
) {
    'use strict';

    var displayedFlags = [];

    var LocationEnum = function(name) {
        this.name = name;
    };

    var Location = {
        FLAG: new LocationEnum('flag'),
        BANNER: new LocationEnum('banner'),
        ALL: new LocationEnum('all'),
        ANY: new LocationEnum('any') // only used in hasErrors
    };

    var defaultErrorOptions = {
        type: 'error',
        close: 'manual',
        fifo: false
    };

    // The ID of warning or success banner in the container div with id 'messageContainer' always starts with this prefix
    var ID_PREFIX = 'confluence-message-';

    var messageContainerSelector = '#messageContainer';

    /**
     * Find a banner by the suffix of its ID
     * @param {string} suffix the suffix of the ID
     * @private
     * @since 6.10.0
     */
    function findBannerByIdSuffix(suffix) {
        return $(messageContainerSelector).find('#' + ID_PREFIX + suffix);
    }

    /**
     * Initialize the messageContainer if it is not present
     * @returns {*|jQuery|HTMLElement} the messageContainer object
     * @private
     * @since 6.10.0
     */
    function initMessageContainer() {
        var $messageContainer = $(messageContainerSelector);
        if ($messageContainer.length === 0) {
            $messageContainer = $('<ul id="messageContainer"></ul>');
            $('#full-height-container').prepend($messageContainer);
        }
        return $messageContainer;
    }

    /**
     * Clear the warning banner if it exists
     * @returns {*|jQuery|HTMLElement} the jQuery element representing the banner <ul>
     * @private
     * @since 6.9.0
     */
    function clearWarningBanner() {
        var $messageContainer = initMessageContainer();
        var $warningBanner = findBannerByIdSuffix('warning-banner');
        $warningBanner.slideUp('normal', function() {
            $warningBanner.remove();
            event.trigger('confluence.header-resized');
        });
        return $messageContainer;
    }

    /**
     * Remove the success banner if it exists
     * @returns {*|jQuery|HTMLElement} the jQuery element representing the banner <ul>
     * @private
     * @since 6.9.0
     */
    function clearSuccessBanner() {
        var $messageContainer = initMessageContainer();
        var $successBanner = findBannerByIdSuffix('success-banner');
        $successBanner.slideUp('normal', function() {
            $successBanner.remove();
            event.trigger('confluence.header-resized');
        });
        return $messageContainer;
    }

    /**
     * Initialize the options of a flag or banner message
     * @param {object|string} error the error object or string
     * @returns {object} the initial options
     * @private
     * @since 6.9.0
     */
    function initOptions(error) {
        var options = {};
        if (typeof error === 'string') {
            options.body = error;
        } else {
            options.title = error.title;
            options.body = error.body;
        }
        return options;
    }

    /**
     * Clear the error flags
     * @private
     * @since 6.9.0
     */
    function clearErrorFlags() {
        var i;
        for (i = 0; i < displayedFlags.length; i++) {
            displayedFlags[i].close();
        }
        displayedFlags = [];
    }

    /**
     * Clear displayed flags and show a new one in the corner of the screen.
     * @param {object} error The error title and message to display.
     * @private
     * @since 6.9.0
     */
    function setErrorFlag(error) {
        var options = $.extend({}, defaultErrorOptions, initOptions(error));
        clearErrorFlags();
        displayedFlags.push(new Flag(options));
    }

    /**
     * Append a warning banner to the messageContainer with the specified id.
     * @param {object} error the warning message to use
     * @param {string} id the DOM id that will be added to the warning element.
     * @private
     * @since 6.9.0
     */
    function addWarningBanner(error, id) {
        var options = $.extend({
            id: id,
            closeable: false
        }, initOptions(error));
        // We need to create a <li> element first
        $('<li id="' + id + '"></li>').appendTo(messageContainerSelector);
        AJS.messages.warning('#' + id, options);
        event.trigger('confluence.header-resized');
    }

    /**
     * Clear all banners from the message container, and add a new one with the specified text.
     * @param {object} error The error title and message of the warning banner to setup.
     * @param {string} id The id to attach to the warning banner.
     * @private
     * @since 6.9.0
     */
    function setWarningBanner(error, id) {
        clearWarningBanner();
        addWarningBanner(error, id);
    }

    /**
     * Parses the response and returns the appropriate error message for the status and reason
     *
     * @param {object} xhr containing the fields `status` and  `responseText` , which is a JSON-formatted string potentially containing a `reason` field.
     * The `reason` field can be used to distinguish between different specific errors with the same HTTP code.
     * @param {string} defaultErrorMessage the default error message will be shown if provided, otherwise 'server.error.message' i18n string will be shown
     * @returns {string} errorMessage an error message appropriate for the status, or a generic 500-style error if a match is not found.
     * @since 6.9.0
     */
    function parseError(xhr, defaultErrorMessage) {
        var errorMessage;
        var reason;
        try {
            reason = JSON.parse(xhr.responseText).reason;
        } catch (err) {
            Logger.debug('No error-specific reason was provided. Using fallback messages...');
        }
        switch (xhr.status) {
        case 403:
            errorMessage = AJS.I18n.getText('operation.forbidden.message');
            break;
        case 405:
            if (typeof reason !== 'undefined' && reason === 'READ_ONLY') {
                errorMessage = AJS.I18n.getText('read.only.mode.default.error.short.message');
            } else {
                errorMessage = defaultErrorMessage !== undefined ? defaultErrorMessage : AJS.I18n.getText('server.error.message');
            }
            break;
        default:
            errorMessage = defaultErrorMessage !== undefined ? defaultErrorMessage : AJS.I18n.getText('server.error.message');
        }
        return errorMessage;
    }

    /**
     * Display an error as a Flag or a Banner on the page.
     * @param {object} error the error title and message to display
     * @param {object} location where it should be displayed: MessageController.Location.FLAG or MessageController.Location.BANNER.
     * @since 6.9.0
     */
    function showError(error, location) {
        var id = ID_PREFIX + 'warning-banner';
        switch (location) {
        case Location.FLAG:
            setErrorFlag(error);
            break;
        case Location.BANNER:
            setWarningBanner(error, id);
            break;
        case Location.ALL:
            setErrorFlag(error);
            setWarningBanner(error, id);
            break;
        default:
            Logger.debug('Invalid location to display an error provided.');
        }
    }

    /**
     * Clear (closes) the error in the specific location
     * @param {object} location The location of the error message
     * @private
     * @since 6.9.0
     */
    function clearErrors(location) {
        switch (location) {
        case Location.FLAG:
            clearErrorFlags();
            break;
        case Location.BANNER:
            clearWarningBanner();
            break;
        case Location.ALL:
            clearErrorFlags();
            clearWarningBanner();
            break;
        default:
            Logger.error('Invalid location to clear errors.');
        }
    }

    /**
     *
     * @param {object} location The location of the error message
     * @returns {boolean} true if the warning flag/banner is present
     */
    function hasErrors(location) {
        var $warningBanner = findBannerByIdSuffix('warning-banner');
        switch (location) {
        case Location.FLAG:
            return displayedFlags.length > 0;
        case Location.BANNER:
            return $warningBanner.length > 0;
        case Location.ANY:
            return displayedFlags.length > 0 || $warningBanner.length > 0;
        default:
            Logger.error('Invalid location to check if there are any errors in');
        }
        return false;
    }

    /**
     * Check if a success flag/banner is already present
     * @param {object} location the location to be checked against
     * @returns {boolean} true if the success flag/banner is present
     * @since 6.10.0
     */
    function hasSuccess(location) {
        var $successBanner = findBannerByIdSuffix('success-banner');
        switch (location) {
        case Location.BANNER:
        case Location.ANY:
            return $successBanner.length > 0;
        default:
            Logger.error('Invalid location to check the success flag/banner.');
        }
        return false;
    }

    /**
     * Add a new one with the specified text.
     * @param {object} success The success title and message of the warning banner to setup.
     * @param {object} location where it should be displayed: MessageController.Location.FLAG or MessageController.Location.BANNER
     * @param {object} args the optional arguments
     * @private
     * @since 6.9.0
     */
    function showSuccess(success, location, args) {
        var options = $.extend({
            closeable: args ? args.closeable : false
        }, initOptions(success));

        var id = ID_PREFIX + 'success-banner';

        switch (location) {
        case Location.BANNER:
            initMessageContainer(); // we make sure that the container div is initialized
            clearSuccessBanner();
            $('<li id="' + id + '"></li>').appendTo(messageContainerSelector);
            AJS.messages.success('#' + id, options);
            event.trigger('confluence.header-resized');
            break;
        default:
            Logger.error('Invalid location to show success');
        }
    }

    /**
     * Clear (closes) the success in the specific location
     * @param {object} location The location of the error message or all
     * @private
     * @since 6.9.0
     */
    function clearSuccess(location) {
        switch (location) {
        case Location.BANNER:
        case Location.ALL:
            clearSuccessBanner();
            break;
        default:
            Logger.error('Invalid location to clear success');
        }
    }

    return {
        parseError: parseError,
        showError: showError,
        clearErrors: clearErrors,
        hasErrors: hasErrors,
        showSuccess: showSuccess,
        clearSuccess: clearSuccess,
        hasSuccess: hasSuccess,
        Location: Location
    };
});
