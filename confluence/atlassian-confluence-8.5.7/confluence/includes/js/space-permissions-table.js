/**
 * @module confluence/space-permissions-table
 */
define('confluence/space-permissions-table', [
    'backbone',
    'confluence/select-all-row'
], function(
    Backbone,
    SelectAllRow
) {
    'use strict';

    return Backbone.View.extend({
        isSpacePermissionChange: function($el) {
            var self = this;

            var permissionChanged = false;
            $el.each(function(index, checkbox) {
                var $original = self.$el.find('input[name=\'' + checkbox.name.replace('checkbox', 'initial') + '\']');

                if ((checkbox.checked && $original.length === 0) || (!checkbox.checked && $original.val() === 'on')) {
                    permissionChanged = true;
                    return false;
                }
            });

            return permissionChanged;
        },
        permissionChanged: function() {
            return this.isSpacePermissionChange(this.$el.find('input[type="checkbox"][name^="confluence_checkbox"]'));
        },
        initialize: function() {
            this.$el.find('tr.space-permission-row').toArray().forEach(function(row) {
                new SelectAllRow({ el: row, selectAllSelector: '.row-selector' });
            });
        }
    });
});
