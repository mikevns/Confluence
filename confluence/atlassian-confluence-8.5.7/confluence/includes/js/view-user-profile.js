/**
 * JS for viewmyprofile.action
 * @module confluence/view-user-profile
 */
define('confluence/view-user-profile', [
    'jquery',
    'confluence/analytics-support',
    'window',
    'confluence/meta'
], function(
    $,
    Analytics,
    window,
    Meta
) {
    'use strict';

    function isMyProfile() {
        return window.location.pathname.match('viewmyprofile.action$')
                        || window.location.search.indexOf('username=' + Meta.get('remote-user')) > -1;
    }

    return function() {
        var baseEvent = 'confluence.user-profile.other';
        if (isMyProfile()) {
            baseEvent = 'confluence.user-profile.my';
        }

        Analytics.publish(baseEvent + '.view');

        $('.recently-updated .update-item-details > div > a').click(function() {
            Analytics.publish(baseEvent + '.recent-activity.click');
        });

        $('.user-profile > nav li > a').click(function() {
            Analytics.publish(baseEvent + '.tab.click', { url: $(this).attr('href') });
        });
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/view-user-profile', function(ViewUserProfile) {
    'use strict';

    require('ajs').toInit(ViewUserProfile);
});
