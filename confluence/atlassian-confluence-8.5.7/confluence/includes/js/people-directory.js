/**
 * @module confluence/people-directory
 */
define('confluence/people-directory', [
    'confluence/analytics-support',
    'jquery'
], function(
    Analytics,
    $
) {
    'use strict';

    /**
     * CONFDEV-33536 - Confluence simplify journeys
     *
     * Adding the following events:
     * - confluence.people-directory.view
     * - confluence.people-directory.user.click
     * - confluence.people-directory.user.mailto.click
     * - confluence.people-directory.all-people.click
     * - confluence.people-directory.personal-space-people.click
     * - confluence.people-directory.search.submit
     * */
    function track(eventName, data) {
        Analytics.publish('confluence.people-directory.' + eventName, data || {});
    }

    return function() {
        var $peopleSection = $('#peoplelist');

        // user click
        $peopleSection.on('click', '.confluence-userlink', function() {
            track('user.click');
        });

        // user email click
        $peopleSection.on('click', '.email', function() {
            track('user.mailto.click');
        });

        var $sidebarSection = $('.dashboard-section .aui-page-panel-nav');

        // all-people click
        $sidebarSection.on('click', '.show-all-people', function() {
            track('all-people.click');
        });

        // only people with spaces click
        $sidebarSection.on('click', '.show-people-spaces', function() {
            track('personal-space-people.click');
        });

        var $searchSection = $('#people-search');
        // network add
        $searchSection.on('click', '[type=submit]', function() {
            track('search.submit');
        });
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/people-directory', function(PeopleDirectory) {
    'use strict';

    require('ajs').toInit(PeopleDirectory);
});
