/**
 * Controls the Form component of the Page Permissions dialog.
 * @module confluence/page-permissions-form
 */
define('confluence/page-permissions-form', [
    'jquery',
    'ajs',
    'document',
    'confluence/aui-overrides'
], function(
    $,
    AJS,
    document,
    AJSOverrides
) {
    'use strict';

    function PagePermissionsForm(permissionManager) {
        /**
         * Adds validation error messages for unknown or duplicate names.
         */
        var validator = {

            handleNonExistentEntityNames: function(entityNames) {
                if (!entityNames || !entityNames.length) {
                    return;
                }

                var commaDelimitedNames = entityNames.join(', ');
                this.showErrorMessage(AJS.I18n.getText('page.perms.error.invalid.entity.names') + ' ' + commaDelimitedNames);
            },

            showErrorMessage: function(message) {
                AJS.messages.warning('#page-permissions-editor-form', {
                    title: message,
                    id: 'page-permissions-error-div',
                    insert: 'prepend'
                });

                var $pagePermissionsEditorForm = $('#page-permissions-editor-form');
                var $pagePermissionsTables = $('#page-permissions-tables');

                // calculate expected height of bottom div, excluding its 35px padding
                var permissionTableHeight = 423 - $pagePermissionsEditorForm.outerHeight(true) - 35;
                $pagePermissionsTables.css('height', permissionTableHeight);

                var $cancelButton = $pagePermissionsEditorForm.find('.icon-close');
                $cancelButton.on('click', function() {
                    $pagePermissionsTables.height(286);
                });
            },

            isDuplicateEntityForType: function(entity, permissionType) {
                var matches = $('#page-permissions-table .' + entity.type + '-permission.' + permissionType + '-permission-row .permission-entity-name').filter(function() {
                    return $(this).text() === entity.name;
                });

                return matches.length > 0;
            },

            resetValidationErrors: function() {
                $('#page-permissions-tables').height(286);
                $('#page-permissions-error-div').remove();
            }
        };

        /**
         * Handles typing of user/names and groups with autocomplete and placeholder text.
         */
        var nameField = (function() {
            var input = $('#page-permissions-names-input');
            var autocompleted = $('#page-permissions-names-hidden');

            // The placeholder will be set as the initial value of the input.
            var placeholder = input.val();

            input.keypress(function(e) {
                if (e.keyCode === 13) {
                    namesEntered();
                    input.focus();
                    return false;
                }
                return true;
            });

            input.bind('selected.autocomplete-user-or-group', function(e, data) {
                var key = data.content.key;
                autocompleted.val(unescape(key.replace(/\+/g, ' ')));
                input.val('');
                namesEntered(data.content.type);
                e.preventDefault();
            });

            input.focus(function() {
                var ol = input.next('.aui-dd-parent');
                if (!ol.length) {
                    return;
                }
                // Reset the position of the autocomplete list each time the input gets focus. This allows for the window
                // being resized (and for the input being hidden when the position is originally calculated).
                ol.show();
                var expectedLeftOffset = input.offset().left;
                if (ol.offset().left != expectedLeftOffset) {
                    ol.css('margin-left', 0); // "reset" the offset.
                    var olMarginLeft = expectedLeftOffset - ol.offset().left;
                    ol.css('margin-left', olMarginLeft + 'px');
                }
                var expectedTopOffset = input.offset().top + input.outerHeight();
                if (ol.offset().top != expectedTopOffset) {
                    ol.css('margin-top', 0); // "reset" the offset.
                    var olMarginTop = expectedTopOffset - ol.offset().top;
                    ol.css('margin-top', olMarginTop + 'px');
                }
                ol.css({
                    width: input.outerWidth()
                });
                ol.hide();
            });
            return {
                getValue: function() {
                    var names = autocompleted.val();
                    if (names) {
                        autocompleted.val('');
                    } else {
                        names = input.val();
                        if (names == placeholder) {
                            names = '';
                        }
                    }
                    return names;
                },

                /**
                 * Removes a name from the input field (called after the name is found at the back end)
                 */
                removeFromNameInput: function(nameToRemove) {
                    if (!nameToRemove) {
                        return;
                    }

                    var value = input.val();
                    if (!value) {
                        return;
                    }

                    var entityNames = value.split(',');
                    for (var i = 0; i < entityNames.length; i++) {
                        entityNames[i] = $.trim(entityNames[i]);
                    }

                    // remove all empty strings and the entity name that's just been added
                    entityNames = $.grep(entityNames, function(name) {
                        return name != '' && name != nameToRemove;
                    });

                    if (entityNames.length) {
                        input.val(entityNames.join(', '));
                    } else if (document.activeElement == input[0]) {
                        input.val('');
                    }
                }
            };
        }());

        /**
         * Called when the user hits Enter or clicks the Add button.
         */
        var namesEntered = function(entityType) {
            validator.resetValidationErrors();
            permissionManager.table.clearHighlight();
            var names = nameField.getValue();
            if (!names) {
                return;
            }

            permissionManager.addNames(names, entityType);
        };

        // Choose Me button (User and Group button are wired with VM component
        $('#page-permissions-choose-me').click(function(e) {
            validator.resetValidationErrors();
            permissionManager.addNames($(this).find('.remote-user-name').text());
            e.stopPropagation();
            return false;
        });

        $('#permissions-error-div-close').click(function(e) {
            validator.resetValidationErrors();
            e.stopPropagation();
            return false;
        });

        // Typed user list submit
        $('#add-typed-names').click(function() {
            namesEntered();
        });

        return {
            validator: validator,

            nameField: nameField,

            setVisible: function(show) {
                AJSOverrides.setVisible('#page-permissions-editor-form', show);
                AJSOverrides.setVisible('.remove-permission-link', show);
            },

            isShowing: function() {
                return !$('#page-permissions-editor-form').hasClass('hidden');
            },

            getPermissionType: function() {
                return $('#restrictViewRadio:checked').length ? 'view' : 'edit';
            }
        };
    }

    return PagePermissionsForm;
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/page-permissions-form', 'AJS.PagePermissions.Controls');
