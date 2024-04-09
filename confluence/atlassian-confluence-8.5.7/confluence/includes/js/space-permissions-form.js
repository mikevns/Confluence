/**
 * @module confluence/space-permissions-form
 */
define('confluence/space-permissions-form', [
    'backbone',
    'jquery',
    'ajs',
    'confluence/space-permissions-table'
], function(
    Backbone,
    $,
    AJS,
    SpacePermissionsTable
) {
    'use strict';

    return Backbone.View.extend({
        initialize: function() {
            this.groupPermissionsTable = new SpacePermissionsTable({ el: this.$el.find('#gPermissionsTable') });
            this.userPermissionsTable = new SpacePermissionsTable({ el: this.$el.find('#uPermissionsTable') });
            this.anonymousPermissionsTable = new SpacePermissionsTable({ el: this.$el.find('#aPermissionsTable') });
        },
        events: {
            'click input[name="save"]': 'submit'
        },
        submit: function() {
            this.$el.find('input[name="save"]').prop('disabled', true);

            if (this.anonymousPermissionsTable.permissionChanged()) {
                AJS.trigger('analyticsEvent', { name: 'confluence.space.permission.change.anonymous', data: {} });
            }
            if (this.groupPermissionsTable.permissionChanged()) {
                AJS.trigger('analyticsEvent', { name: 'confluence.space.permission.change.group', data: {} });
            }
            if (this.userPermissionsTable.permissionChanged()) {
                AJS.trigger('analyticsEvent', { name: 'confluence.space.permission.change.user', data: {} });
            }
            this.$el.submit();
        }
    });
});
