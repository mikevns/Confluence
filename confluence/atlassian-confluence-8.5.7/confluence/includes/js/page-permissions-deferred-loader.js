/**
 * @module confluence/page-permissions-deferred-loader
 * @tainted WRM
 */
define('confluence/page-permissions-deferred-loader', [
    'confluence/dark-features',
    'confluence/legacy',
    'ajs',
    'confluence/page-loading-indicator',
    'jquery',
    'wrm'
], function(
    DarkFeatures,
    Confluence,
    AJS,
    PageLoadingIndicator,
    $,
    WRM
) {
    'use strict';

    var resourceKey = 'com.atlassian.confluence.plugins.confluence-page-restrictions-dialog:dialog-resources';
    var loadingIndicator = PageLoadingIndicator($('body'));

    return function(e) {
        var promise = WRM.require('wr!' + resourceKey);
        promise.then(function() {
            AJS.trigger('deferred.page.permissions');
        });
        loadingIndicator.showUntilDialogVisible(promise, AJS.I18n.getText('page.restrictions.loading.error'));

        e.preventDefault();
    };
});

require('confluence/module-exporter').safeRequire('confluence/page-permissions-deferred-loader', function(PagePermissionsDeferredLoader) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(function($) {
        // has to be 'on' cause of quick edit
        $('body').on('click', '#rte-button-restrictions,#action-page-permissions-link', PagePermissionsDeferredLoader);
        // another way to open the page permissions
        AJS.bind('system-content-metadata.open-restrictions-dialog', PagePermissionsDeferredLoader);
    });
});
