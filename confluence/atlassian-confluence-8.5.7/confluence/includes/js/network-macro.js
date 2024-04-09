/**
 * @module confluence/network-macro
 */
define('confluence/network-macro', [
    'ajs',
    'jquery',
    'confluence/api/constants',
    'confluence/api/event',
    'confluence/api/ajax'
], function(
    AJS,
    $,
    Constants,
    Event,
    Ajax
) {
    'use strict';

    if (typeof AJS.followCallbacks === 'undefined') { AJS.followCallbacks = []; }

    function submitFollowUserRequest(e) {
        var $container = $(e.target);
        var username = $container.find('.follow-user-box').val();
        Ajax.post(Constants.CONTEXT_PATH + '/ajax/followuser.action', { username: username },
            function(data) {
                var $followUserResult = $container.find('.follow-user-result');
                var $followUserBox = $container.find('.follow-user-box');

                $followUserResult.html(data);
                $followUserResult.show();

                $followUserBox.val('');
                $followUserBox.focus();

                Event.trigger('analytics', { name: 'confluence.user-profile.my.network.add' });
            }
        );
        e.stopPropagation();
        return false;
    }

    function BindFollowUser($container) {
        if ($container.attr('data-followuser-bound')) {
            return;
        }

        // this function is executed more than once - therefore we need to make sure
        // we don't bind it several times
        $container.off('submit', submitFollowUserRequest);
        $container.on('submit', submitFollowUserRequest);

        $container.find('.follow-user-box').each(function() {
            this.setAttribute('placeholder', AJS.params.followUserBoxPlaceholder);
        });
    }

    return BindFollowUser;
});

require('confluence/module-exporter').safeRequire('confluence/network-macro', function(BindFollowUser) {
    'use strict';

    var $ = require('jquery');
    var Confluence = require('confluence/legacy');

    Confluence.Binder.followUser = function() {
        $('.follow-user').each(function() {
            BindFollowUser($(this));
        });
    };

    $.fn.followUser = function() {
        $(this).each(function() {
            BindFollowUser($(this));
        });
        return this;
    };
});
