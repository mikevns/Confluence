/**
 * This js file allows to mark a entity (space or page) as a favourite (global or personal) by clicking the star icon.
 * This can be achieved by using a binder.
 * @module confluence/favourites
*/
define('confluence/favourites', [
    'jquery',
    'ajs',
    'confluence/message-controller'
], function(
    $,
    AJS,
    MessageController
) {
    'use strict';

    var waiting = []; // used to prevent the user from triggering off another labelling operation when one is in progress

    /**
     * Check whether a entity is favourited given the favourite icon for that space/page
     * @param button the entity's favourite icon (jQuery object)
     */
    var entityIsFavourited = function(button) {
        return button.hasClass('aui-iconfont-star-filled'); // Anchor version
    };

    /**
     * Add/Remove a entity from the user's favourites.
     * @param entityId - The identifier for the entity to add as favourite (i.e. space key or page id)
     * @param type - the type of entity (i.e. page or space)
     * @param button - The button that was clicked (anchor element jQuery object)
     */
    var toggleFavourite = function(entityId, type, button) {
        var wasFavourited = entityIsFavourited(button);
        var waitIndicator = button.parent().find('.icon-wait');
        var url;
        var params;


        if (type === 'page') {
            url = AJS.contextPath() + '/json/'
                    + (wasFavourited ? 'removefavourite.action' : 'addfavourite.action');
            params = { entityId: entityId };
        } else if (type === 'space') {
            url = AJS.contextPath() + '/json/'
                    + (wasFavourited ? 'removespacefromfavourites.action' : 'addspacetofavourites.action');
            params = { key: entityId };
        } else {
            // CONF-36071 Log error here for easier cause analysis, if another 'type' should be used in the future
            console.error('Unsupported type: ' + type);
        }

        button.addClass('hidden');
        waitIndicator.removeClass('hidden');

        AJS.safe.ajax({
            url: url,
            type: 'POST',
            data: params
        }).done(function(labelsArr) {
            AJS.debug(labelsArr);
            button.parent().find(wasFavourited ? '.aui-iconfont-new-star' : '.aui-iconfont-star-filled').removeClass('hidden');
            AJS.trigger(wasFavourited ? 'remove-fav-complete' : 'add-fav-complete');
        }).fail(function(xhr, text) {
            MessageController.showError(MessageController.parseError(xhr), MessageController.Location.FLAG);
            AJS.debug('Error Toggling Favourite: ' + text);
            button.removeClass('hidden');
        }).always(function() {
            waitIndicator.addClass('hidden');
            delete waiting[entityId];
        });
    };

    var bindFavourites = function(buttons, options) {
        if (buttons.attr('data-favourites-bound')) {
            return;
        }

        buttons.delegate('.aui-iconfont-new-star, .aui-iconfont-star-filled', 'click', function(e) {
            var button = $(e.target);
            var type = buttons.attr('data-entity-type');
            var scope = buttons.attr('data-entity-scope');
            var entityId;

            if (options && options.getEntityId && typeof options.getEntityId === 'function') {
                entityId = options.getEntityId(button);
            } else {
                entityId = buttons.attr('data-entity-id');
            }
            if (waiting[entityId]) {
                AJS.log('Already busy toggling favourite for ' + type + ' \'' + entityId + '\'. Ignoring request.');
                return;
            }

            /**
             * CONFDEV-33536 - Confluence simplify journeys
             *
             *  Adding favourite sends an analytics event
             *
             *  - confluence.space-directory.space.favourite.click
             *
             *  data-entity-scope should be provided to trigger this metric
             */

            if (scope) {
                var actionName = entityIsFavourited(button) ? 'unfavourite' : 'favourite';
                var eventName = ['confluence', scope, type, actionName, 'click'].join('.');
                AJS.trigger('analytics', {
                    name: eventName,
                    data: {
                        id: entityId
                    }
                });
            }

            waiting[entityId] = true;
            toggleFavourite(entityId, type, button);
            return false;
        });
        buttons.attr('data-favourites-bound', true);
    };

    var Favourites = {};

    /**
     * The favourite entities binder looks for the following markup:
     * <div class="entity-favourites" data-entityId="{entityId}" data-entityType="{type}">
     *     <a class="icon-remove-fav">Remove Favourite</a>
     *     <a class="icon-add-fav">Add Favourite</a>
     *     <span class="icon icon-wait hidden">$i18NBean.getText('loading.name')</span>
     * </div>
     */
    Favourites.binder = function() {
        $('.entity-favourites').each(function() {
            if (!$(this).attr('data-favourites-bound')) {
                bindFavourites($(this), {});
            }
        });
    };

    /**
     * Allows the user to toggle favourites. This plugin is made available for dynamic content.
     * If you have static content, then use the binder.
     * Options are:
     * <li> getEntityId - a function that retrieves the relevant entity identifier from the button pressed.
     * @param options {Object}
     */
    Favourites.plugin = function(options) {
        $(this).each(function() {
            var buttons = $(this);
            bindFavourites(buttons, options);
        });
    };

    return Favourites;
});

require('confluence/module-exporter').safeRequire('confluence/favourites', function(Favourites) {
    'use strict';

    var AJS = require('ajs');
    var $ = require('jquery');

    AJS.Confluence.Binder.favourites = Favourites.binder;
    $.fn.favourites = Favourites.plugin;
});
