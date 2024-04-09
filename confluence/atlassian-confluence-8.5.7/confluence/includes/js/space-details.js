/**
 * @module confluence/space-details
 */
define('confluence/space-details', [
    'document',
    'ajs',
    'jquery',
    'confluence/templates',
    'confluence/message-controller'
], function(
    document,
    AJS,
    $,
    Templates,
    MessageController
) {
    'use strict';

    return {
        interface: {
            setUsersToAddTextField: function(entityNames) {
                var element = document.forms.convertspace.usersToAdd;
                if (entityNames !== '') {
                    if (element.value === '') {
                        element.value = entityNames;
                    } else {
                        element.value = element.value + ', ' + entityNames;
                    }
                }
            }
        },
        initialiser: function($) {
            $('.spacetools-nav-secondary').on('click', '.menu-item a', function() {
                var $menuItem = $(this).parent();
                var webItemKey = $menuItem.attr('data-web-item-key');
                var webSectionKey = $menuItem.attr('data-web-section-key');
                var cookiePath = AJS.contextPath() || '/';
                $.cookie('confluence.last-web-item-clicked', webSectionKey + '/' + webItemKey, { path: cookiePath });
            });

            $('.spacetools-nav').on('click', 'li a', function() {
                var $menuItem = $(this).parent();
                var webSectionKey = $menuItem.attr('data-web-section-key');
                var webItemKey = $menuItem.attr('data-first-web-item-key');
                var cookiePath = AJS.contextPath() || '/';
                $.cookie('confluence.last-web-item-clicked', webSectionKey + '/' + webItemKey, { path: cookiePath });
            });

            function updateWatch($button, type, action, value, newText, prefix, dataType) {
                var path;
                if (!prefix || prefix === '') {
                    path = '/spaces/';
                } else {
                    path = prefix;
                }
                $.ajax({
                    url: AJS.contextPath() + path + action + '?' + $.param({
                        contentType: type,
                        key: AJS.Meta.get('space-key'),
                        atl_token: AJS.Meta.get('atl-token')
                    }),
                    dataType: dataType,
                    success: function() {
                        if (value === true) {
                            $button.removeClass('stop-watching').addClass('watch');
                        } else {
                            $button.removeClass('watch').addClass('stop-watching');
                        }
                        $button.html(Templates.SpaceDetails.watchButton({ watch: value, text: newText }));
                    },
                    error: function(xhr) {
                        MessageController.showError(MessageController.parseError(xhr), MessageController.Location.FLAG);
                    }
                });
            }
            $('.content-navigation.pages-collector').on('click', 'a.watch', function(e) {
                e.preventDefault();
                updateWatch($(this), '', 'addspacenotification.action', false, AJS.I18n.getText('remove.space.notification'));
                AJS.trigger('analytics', { name: 'watch-space' });
            });
            $('.content-navigation.pages-collector').on('click', 'a.stop-watching', function(e) {
                e.preventDefault();
                updateWatch($(this), '', 'removespacenotification.action', true, AJS.I18n.getText('add.space.notification'));
                AJS.trigger('analytics', { name: 'unwatch-space' });
            });
            $('.content-navigation.view-blogposts').on('click', 'a.watch', function(e) {
                e.preventDefault();
                updateWatch($(this), 'blogpost', 'addspacenotificationajax.action', false, AJS.I18n.getText('space.watches.blogs.stop'), '/users/', 'json');
                AJS.trigger('analytics', { name: 'watch-blogs' });
            });
            $('.content-navigation.view-blogposts').on('click', 'a.stop-watching', function(e) {
                e.preventDefault();
                updateWatch($(this), 'blogpost', 'removespacenotificationajax.action', true, AJS.I18n.getText('space.watches.blogs.start'), '/users/', 'json');
                AJS.trigger('analytics', { name: 'unwatch-blogs' });
            });
        }
    };
});

require('confluence/module-exporter').safeRequire('confluence/space-details', function(SpaceDetails) {
    'use strict';

    var AJS = require('ajs');
    AJS.Confluence.SpaceDetails = SpaceDetails.interface;
    AJS.toInit(SpaceDetails.initialiser);
});
