/**
 * @module confluence/header-user-menu
 */
/**
 * JS for initialising the user menu in the header
 */
define('confluence/header-user-menu', [
    'jquery',
    'confluence/meta',
    'underscore'
], function(
    $,
    Meta,
    _
) {
    'use strict';

    function initialiseUserAvatar() {
        var avatarUrl = Meta.get('current-user-avatar-uri-reference');
        $('#user-menu-link').find('.aui-avatar-inner img').attr('src', avatarUrl);
    }

    return function() {
        _.defer(initialiseUserAvatar);
    };
});

require('confluence/module-exporter').safeRequire('confluence/header-user-menu', function(HeaderUserMenu) {
    'use strict';

    require('ajs').toInit(HeaderUserMenu);
});
