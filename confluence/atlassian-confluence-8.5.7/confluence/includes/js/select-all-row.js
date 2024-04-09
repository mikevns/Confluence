/**
 * @module confluence/select-all-row
 */
define('confluence/select-all-row', [
    'backbone',
    'ajs'
], function(
    Backbone,
    AJS
) {
    'use strict';

    /**
     * Binds to a table row and checkbox to enable selection or deselection of all checkboxes in a given row.
     * @constructor
     * @param {Object} options
     * @param {HTMLTableRowElement} options.el - The row to add select/deselect all functionality to.
     * @param {string} [selectAllSelector=.row-selector] - The selector of the checkbox in this row that will select or
     * deselect all other checkboxes.
     */
    return Backbone.View.extend({
        allChecked: false,
        uncheckedCheckboxes: function() {
            return this.$el.find('input[type="checkbox"]:not(:checked)');
        },
        checkedCheckboxes: function() {
            return this.$el.find('input[type="checkbox"]:checked');
        },
        checkboxes: function() {
            return this.$el.find('input[type="checkbox"]');
        },
        toggle: function(event) {
            if (!this.allChecked) {
                this.uncheckedCheckboxes().prop('checked', true);
                this.allChecked = true;
            } else {
                this.checkedCheckboxes().prop('checked', false);
                this.allChecked = false;
            }
            this.render();
        },
        initialize: function(options) {
            var self = this;

            this.$selectAllElement = this.$el.find(options.selectAllSelector || '.row-selector');
            this.$selectAllElement.on('click', function(event) { self.toggle.call(self, event); });
            if (this.uncheckedCheckboxes().length === 0) {
                this.allChecked = true;
            }
            this.render();
        },
        render: function() {
            if (this.allChecked) {
                this.$selectAllElement.text(AJS.I18n.getText('deselect-all'));
            } else {
                this.$selectAllElement.text(AJS.I18n.getText('select-all'));
            }
        },
        checkboxChanged: function() {
            if (this.checkedCheckboxes().length === this.checkboxes().length) {
                this.uncheckedCheckboxes().prop('checked', true);
                this.allChecked = true;
            } else {
                this.$selectAllElement.prop('checked', false);
                this.allChecked = false;
            }
            this.render();
        },
        events: {
            'change input[type="checkbox"]': 'checkboxChanged'
        }
    });
});
