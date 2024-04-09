/**
 * @module confluence/dialog-breadcrumbs
 */
define('confluence/dialog-breadcrumbs', [
    'ajs',
    'jquery',
    'confluence/meta',
    'confluence/templates'
], function(
    AJS,
    $,
    Meta,
    Templates
) {
    'use strict';

    // returns false if the breadcrumb contains the current page
    function isValidLocation(breadcrumbs) {
        for (var i = 1; i < breadcrumbs.length; i++) { // skip dashboard and space title
            if (breadcrumbs[i].title === Meta.get('page-title')) {
                return false;
            }
        }
        return true;
    }

    var breadcrumbCache = {}; // cached for entire request -- if this isn't okay, move it into Breadcrumbs class below

    /**
     * Handles retrieval of breadcrumbs via AJAX and caching of the responses until the page reloads.
     *
     * Possible options:
     *
     * spaceKey - The space key for the space containing the object you want breadcrumbs for. It can be the space by itself or an
     *            object within the space.
     * pageId - The id for the page you want breadcrumbs for or a page with an attachment you want breadcrumbs for.
     * title - The page title for the page you want breadcrumbs for or a page with an attachment you want breadcrumbs for.
     * fileName - the name of the attachment you want breadcrumbs for.
     * userName - the name of the User you want breadcrumbs for. If this option is specified, the others are ignored and the user
     *            breadcrumbs are returned.
     */
    var getBreadcrumbsDefault = function(options, success, error) {
        var cacheKey = options.userName ? options.userName
            : (options.pageId ? (options.pageId + ':' + options.fileName)
                : (options.spaceKey + ':' + options.title + ':' + options.postingDay + ':' + options.fileName));

        if (cacheKey in breadcrumbCache) {
            success(breadcrumbCache[cacheKey], 'success');
            return;
        }

        $.ajax({
            type: 'GET',
            dataType: 'json',
            data: options,
            url: AJS.contextPath() + '/pages/breadcrumb.action',
            error: error || function() { },
            success: function(data, textStatus) {
                if (!data || !data.breadcrumbs) {
                    error(data, textStatus);
                    return;
                }

                var breadcrumbs = $.makeArray(data.breadcrumbs);

                // Strip out "People"
                while (breadcrumbs[0] && data.type !== 'userinfo' && /peopledirectory\.action$/.test(breadcrumbs[0].url)) {
                    breadcrumbs.shift();
                }

                // Strip out "Pages"
                if (data.type === 'page' && breadcrumbs[1] && /pages\.action/.test(breadcrumbs[1].url)) {
                    breadcrumbs.splice(1, 1);
                }

                breadcrumbs.type = data.type;

                breadcrumbCache[cacheKey] = breadcrumbs;
                success(breadcrumbs, textStatus);
            }
        });
    };

    /**
     * Returns an object with an 'update' method, which can be called to render a breadcrumb
     * with that location inside the breadcrumbsElement.
     *
     * @param breadcrumbsElement the element (usually a 'ul') where the breadcrumb will be
     * rendered.
     * @param getBreadcrumbs (optional) specify a custom function by which to retrieve breadcrumbs. The function signature should be similar to AJS.MoveDialog.getBreadcrumbs
     */
    var Breadcrumbs = function(breadcrumbsElement, getBreadcrumbs) {
        var requestCount = 0;

        function displayBreadcrumbs(spaceKey, breadcrumbs, controls) {
            breadcrumbsElement.renderBreadcrumbs(breadcrumbs);
            var validLocation = spaceKey !== Meta.get('space-key') || isValidLocation(breadcrumbs);
            if (validLocation) {
                controls.clearErrors();
                $(controls.moveButton).prop('disabled', false);
            } else {
                controls.error(AJS.I18n.getText('move.page.dialog.invalid.location'));
                $('li:last-child', breadcrumbsElement).addClass('warning');
            }
        }

        return {
            /**
             * Updates the breadcrumb to the specified location. Any errors are handled by
             * calling 'controls.error' with the message.
             *
             * @param options available options
             *
             * spaceKey - The space key for the space containing the object you want breadcrumbs for. It can be the space by itself or an
             *            object within the space
             * title - The page title for the page you want breadcrumbs for or a page with an attachment you want breadcrumbs for.
             * fileName - the name of the attachment you want breadcrumbs for.
             * userName - the name of the User you want breadcrumbs for. If this option is specified, the others are ignored and the user
             *            breadcrumbs are returned.
             * @param controls should contain an 'error' function which is used to pass
             * errors back to the caller, and a 'clearErrors' which indicates no errors
             * occurred
             */
            update: function(options, controls) {
                breadcrumbsElement.html(Templates.Dialog.breadcrumbLoading());
                var thisRequest = requestCount += 1;

                // Breadcrumbs and errors should only be displayed for the latest request.
                var isRequestStale = function() {
                    if (thisRequest !== requestCount) {
                        AJS.debug('Breadcrumb response for ', options, ' is stale, ignoring.');
                        return true;
                    }
                    return false;
                };

                (getBreadcrumbs || getBreadcrumbsDefault)(options,
                    function(breadcrumbs, textStatus) {
                        if (isRequestStale()) { return; }

                        if (textStatus !== 'success' || !breadcrumbs) {
                            breadcrumbsElement.html(Templates.Dialog.breadcrumbError());
                            return;
                        }
                        displayBreadcrumbs(options.spaceKey, breadcrumbs, controls);
                    },
                    function(xhr) {
                        if (isRequestStale()) { return; }

                        breadcrumbsElement.html(Templates.Dialog.breadcrumbError());
                        if (xhr.status === 404) {
                            controls.error(AJS.I18n.getText('move.page.dialog.location.not.found'));
                        }
                    }
                );
            }
        };
    };

    /**
     * Retrieves breadcrumbs for the an entity with the specified id and type (inside options object)
     *
     * @param options (required) options.id and options.type are required.
     * @param success the function to call on successful retrieval of breadcrumbs
     * @param error the function to call when there is an error retrieving breadcrumbs
     */
    var getBreadcrumbsLegacy = function(options, success, error) {
        if (!options.id) {
            throw new Error('id is a required parameter in \'options\'');
        }
        if (!options.type) {
            throw new Error('type is a required parameter in \'options\'');
        }

        var cacheKey = options.id + ':' + options.type;

        if (cacheKey in breadcrumbCache) {
            success(breadcrumbCache[cacheKey], 'success');
            return;
        }

        $.ajax({
            type: 'GET',
            dataType: 'json',
            data: options,
            url: AJS.contextPath() + AJS.REST.getBaseUrl() + 'breadcrumb',
            error: error || function() { },
            success: function(data, textStatus) {
                if (!data || !data.breadcrumbs) {
                    error(data, textStatus);
                    return;
                }

                var breadcrumbs = $.makeArray(data.breadcrumbs);

                // Strip out "People"
                while (breadcrumbs[0] && data.type !== 'userinfo' && /peopledirectory.action$/.test(breadcrumbs[0].url)) {
                    breadcrumbs.shift();
                }
                breadcrumbs.type = data.type;

                breadcrumbCache[cacheKey] = breadcrumbs;
                success(breadcrumbs, textStatus);
            }
        });
    };

    return {
        getBreadcrumbsDefault: getBreadcrumbsDefault,
        Breadcrumbs: Breadcrumbs,
        getBreadcrumbsLegacy: getBreadcrumbsLegacy
    };
});

require('confluence/module-exporter').safeRequire('confluence/dialog-breadcrumbs', function(DialogBreadcrumbs) {
    'use strict';

    var AJS = require('ajs');
    var Confluence = require('confluence/legacy');

    AJS.toInit(function() {
        if (!AJS.MoveDialog) { AJS.MoveDialog = {}; }
        AJS.MoveDialog.Breadcrumbs = DialogBreadcrumbs.Breadcrumbs;
        AJS.MoveDialog.getBreadcrumbs = DialogBreadcrumbs.getBreadcrumbsDefault;

        /*
         * @deprecated use Confluence.Dialogs.Breadcrumbs instead of AJS.Breadcrumbs
         */
        AJS.Breadcrumbs = {};
        AJS.Breadcrumbs.getBreadcrumbs = DialogBreadcrumbs.getBreadcrumbsLegacy;

        if (!Confluence.Dialogs) { Confluence.Dialogs = {}; }
        Confluence.Dialogs.Breadcrumbs = AJS.Breadcrumbs;
        Confluence.Dialogs.Breadcrumbs.getBreadcrumbs = DialogBreadcrumbs.getBreadcrumbsLegacy;
        Confluence.Dialogs.Breadcrumbs.Controller = DialogBreadcrumbs.Breadcrumbs;
        Confluence.Dialogs.Breadcrumbs.defaultGetBreadcrumbs = DialogBreadcrumbs.getBreadcrumbsDefault;
    });
});
