/**
 * @module confluence/recover-space-permissions
 */
define('confluence/recover-space-permissions', [
    'jquery',
    'confluence/meta',
    'ajs',
    'confluence/api/logger'
], function(
    $,
    Meta,
    AJS,
    logger
) {
    'use strict';

    return function() {
        var recoverPermissionsLinks = $('#space-permissions-table .recover-permissions-link');
        var user = Meta.get('remote-user');

        recoverPermissionsLinks.on('click', function(event) {
            var $link = $(this);
            var spaceKey = $link.data('space-key');
            var dialog = new AJS.Dialog({
                width: 400,
                height: 210,
                id: 'recover-permissions-dialog',
                closeOnOutsideClick: true
            });

            setUpDialog(dialog, user, spaceKey);
            dialog.show();

            event.preventDefault();
        });

        var setUpDialog = function(dialog, user, spaceKey) {
            // dialog code
            dialog.addHeader(AJS.I18n.getText('admin.defaultspacepermissions.spaces.recoverpermissions.dialog.title'));

            dialog.addPanel('message', '<p>' + AJS.I18n.getText('admin.defaultspacepermissions.spaces.recoverpermissions.dialog.content') + '</p>', 'recover-permissions-panel-body');

            dialog.addButton(AJS.I18n.getText('ok'), function(dialog) {
                AJS.safe.ajax({
                    type: 'POST',
                    url: AJS.contextPath() + '/admin/permissions/grantspacepermissions.action',
                    data: { spaceKey: spaceKey }
                }).done(function() {
                    // refresh the page to pick up new permission changes
                    location.reload();
                }).fail(function() {
                    logger.log('Space Permissions: Failed to recover space permissions for ' + user + ' to the ' + spaceKey + ' space.');
                }).always(function() {
                    dialog.remove();
                });
            });

            dialog.addLink(AJS.I18n.getText('cancel.name'), function(dialog) {
                dialog.remove();
            }, '#');
        };
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/recover-space-permissions', function(RecoverSpacePermissions) {
    'use strict';

    require('ajs').toInit(RecoverSpacePermissions);
});
