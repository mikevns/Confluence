/**
 * @module confluence/page-permissions-manager
 */
define('confluence/page-permissions-manager', [
    'ajs',
    'confluence/meta',
    'confluence/api/event',
    'confluence/legacy',
    'confluence/aui-overrides',
    'confluence/form-state-control'
], function(
    AJS,
    Meta,
    event,
    Confluence,
    AJSOverrides,
    FormStateControl
) {
    'use strict';

    return function($) {
        var USER = 'user';
        var GROUP = 'group';

        var contextPath = AJS.contextPath();

        var isEditMode = function() {
            // This dialog can also be accessed from the view page, this function asserts whether or not the editor UI is present.
            return $('#rte-button-restrictions').parent().is(':visible');
        };

        var popup = null;
        var controls = null;
        var table = null;

        /**
         * Handles the AJAX calls to check for added users and groups, calling PermissionsTable.addEntry if found.
         */
        var permissionManager = {

            // Queries the server for whether an entityName represents a user or group
            // perform subsequent group check inside the callback of the user check so it occurs after the user check completes
            addNames: function(entityNames, entityType) {
                var pm = this;
                var entityNamesArray = entityNames.replace(/\s*,\s*/g, ',').split(',');
                var throbber = $('#waitImage');
                throbber.show();
                var params = {
                    name: entityNamesArray,
                    type: entityType || '',
                    pageId: Meta.get('parent-page-id'),
                    spaceKey: Meta.get('space-key')
                };
                $.getJSON(contextPath + '/pages/getentities.action', params, function(results) {
                    throbber.hide();
                    for (var i = 0, len = results.length; i < len; i++) {
                        var entity = results[i].entity;
                        // 1. Add permission row for entity
                        pm.addEntity(results[i]);

                        // 2. Remove from submitted names list
                        var index = $.inArray(entity.name, entityNamesArray);
                        entityNamesArray.splice(index, 1);
                    }
                    // 3. Didn't find anything for names - should only occur for names via the form
                    controls.validator.handleNonExistentEntityNames(entityNamesArray);
                });
            },

            // Note - dupe validation can't be done before looking up the entity from a name because it depends on the entity type.
            addEntity: function(entityResult) {
                if (!entityResult) {
                    return;
                }

                var entity = entityResult.entity;
                var report = entityResult.report;

                var currentPermissionType = controls.getPermissionType();
                if (controls.validator.isDuplicateEntityForType(entity, currentPermissionType)) {
                    table.highlightEntityRow(entity, currentPermissionType);
                    return;
                }

                var entry = {
                    entity: entity,
                    view: true, // always give added users/groups both permissions
                    edit: true,
                    report: report
                };
                table.addRow(entry, currentPermissionType);
                Confluence.Binder.userHover(); // user hover bindings
                table.changedByUser();
                table.highlightEntityRow(entity, currentPermissionType);
                controls.nameField.removeFromNameInput(entity.name);
            },

            makePermissionStrings: function() {
                var permissions = table.makePermissionMap(false);
                return {
                    viewPermissionsUsers: permissions.user.view.join(','),
                    editPermissionsUsers: permissions.user.edit.join(','),
                    viewPermissionsGroups: permissions.group.view.join(','),
                    editPermissionsGroups: permissions.group.edit.join(',')
                };
            }
        };

        /*--------------------------------------------------------------------------
         Public methods called by pop ups and page-editor.js
         --------------------------------------------------------------------------*/
        $.extend(AJS.PagePermissions, {
            // Callback from Choose Users popup
            addUserPermissions: function(commaDelimitedUserNames) {
                permissionManager.addNames(commaDelimitedUserNames, USER);
            },

            // Callback from Choose Groups popup
            addGroupPermissions: function(commaDelimitedGroupNames) {
                permissionManager.addNames(commaDelimitedGroupNames, GROUP);
            },

            makePermissionStrings: permissionManager.makePermissionStrings,

            updateRestrictionsDialog: updateRestrictionsDialog
        });

        /**
         * Adds rows to the permission table based on JSON data received from the back end. The data should have three
         * parts :
         *      1. permissions - An array of permission arrays, containing :
         *          a. permissionType
         *          b. entityType
         *          c. entity name (username or groupname)
         *          d. owning content id
         *          e. owning content name
         *      2. users - A map of usernames to User objects
         *      3. groups - A map of groupnames to Group objects
         */
        function loadTableFromJson(data) {
            if (data.error) {
                table.showErrorMessage(data.error);
                return;
            }

            var contentId = Meta.get('content-id');

            table.allowEditing(data.userCanEditRestrictions);
            table.resetInherited();
            table.resetDirect();

            if (!data) { return; }

            // 1. First, build up map of permissions for entity. // UI-973
            // TODO - If this design stays, build the map at the back-end. dT
            for (var i = 0, len = data.permissions.length; i < len; i++) {
                var permission = data.permissions[i];
                var permissionType = permission[0].toLowerCase(); // will come in as "View", "Edit"
                var entityType = permission[1];
                var entityName = permission[2];
                var wrappedEntity = (entityType == USER) ? data.users[entityName] : data.groups[entityName];
                var owningContentId = permission[3];
                var owningContentTitle = permission[4];

                var inherited = +owningContentId && owningContentId != contentId;

                var entryForEntityForPage = {
                    owningId: owningContentId,
                    entity: wrappedEntity.entity,
                    report: wrappedEntity.report
                };
                entryForEntityForPage[permissionType] = true;
                entryForEntityForPage.owningTitle = owningContentTitle;
                entryForEntityForPage.inherited = inherited;

                table.addRow(entryForEntityForPage, permissionType);
            }
            if (data.permissions.length > 0) {
                Confluence.Binder.userHover(); // user hover bindings
            }

            table.saveBackup();
            table.refresh();
        }

        /**
         * Checks the permissions in the restrictions dialog and triggers an event to indicate the current restrictions state of the page
         */
        function triggerEditPageRestrictionsUpdatedEvent(restrictionsHash) {
            var nameMap = table.makePermissionMap(false);
            var explicitRestrictions = [].concat(nameMap.group.view).concat(nameMap.user.view).concat(nameMap.group.edit).concat(nameMap.user.edit);
            var inheritedRestrictions = $('#page-inherited-permissions-table-desc:visible');

            AJS.trigger('edit-page-restrictions-updated', {
                hasExplicitRestrictions: explicitRestrictions.length > 0,
                hasInheritedRestrictions: inheritedRestrictions.length > 0,
                restrictionsHash: restrictionsHash
            });
        }

        /**
         * Closes the dialog after saving or cancelling, scrolling the web page to where it was prior to opening.
         */
        function closeDialog() {
            controls.validator.resetValidationErrors();
            table.clearHighlight();
            $('.button-spinner').spinStop();
            popup.hide();
            window.scrollTo(permissionManager.bookmark.scrollX, permissionManager.bookmark.scrollY);
        }

        /**
         * Called when the user saves the permissions. If creating/editing a page, just updates the hidden permission inputs.
         * If on any other screen, saves the permissions to the backend.
         */
        function saveClicked() {
            controls.validator.resetValidationErrors();
            // TODO - the disabling of the submit button should be in AJS.Dialog.
            // See: CONF-17867: prevent 'submit' to be clicked multiple times
            var submitButton = $('.permissions-update-button');

            FormStateControl.disableElement(submitButton);
            $('.button-spinner').spin();

            var data = permissionManager.makePermissionStrings();
            data.pageId = AJS.params.pageId;
            data.contentId = Meta.get('content-id');
            $('#waitImage').show();

            AJS.safe.ajax({
                url: contextPath + '/pages/setcontentpermissions.action',
                data: data,
                dataType: 'json',
                success: function(data) {
                    $('#waitImage').hide();

                    if (data.errorMessage) {
                        controls.validator.showErrorMessage(data.errorMessage);
                        $('.button-spinner').spinStop();
                        FormStateControl.enableElement(submitButton);
                    } else {
                        if (isEditMode()) {
                            triggerEditPageRestrictionsUpdatedEvent(data.restrictionsHash);
                        } else {
                            event.trigger('system-content-metadata.toggled-restrictions',
                                {
                                    // We need to lie here and pass hasPermissions twice for legacy support. The new
                                    // dialog will correctly differentiate these values and set the icon accordingly.
                                    hasExplicitRestrictions: data.hasPermissions,
                                    hasInheritedRestrictions: data.hasPermissions
                                }
                            );
                        }
                        FormStateControl.enableElement(submitButton);
                        closeDialog();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    controls.validator.showErrorMessage(AJS.I18n.getText('page.restrictions.loading.error'));
                    $('.button-spinner').spinStop();
                    FormStateControl.enableElement(submitButton);
                }
            });
        }

        /**
         * Called when the user cancels the dialog via Cancel button or escape.
         */
        function cancel() {
            closeDialog();
            if (isEditMode()) {
                table.restoreBackup();
            }
            return false;
        }

        /**
         * Creates the permissions dialog with the main panel coming from a template, then initializes the Controls and Table
         * handlers.
         */
        function initPopup() {
            popup = AJS.ConfluenceDialog({
                width: 840,
                height: 530,
                id: 'update-page-restrictions-dialog',
                onCancel: cancel
            });
            if (Meta.get('content-type') == 'blogpost') {
                popup.addHeader(AJS.I18n.getText('page.perms.dialog.heading.blog'));
            } else {
                popup.addHeader(AJS.I18n.getText('page.perms.dialog.heading'));
            }
            popup.addPanel('Page Permissions Editor', Confluence.Templates.PagePermissions.dialogPanel({ currentUser: AJS.params.remoteUser, currentUserAvatar: AJS.params.currentUserAvatarUrl }));
            popup.addButton(AJS.I18n.getText('update.name'), saveClicked, 'permissions-update-button');
            popup.addCancel(AJS.I18n.getText('close.name'), cancel);

            // CONFDEV-12853: Add help link via prepend() instead of append() to prevent FF display issue
            popup.popup.element.find('.dialog-title').prepend(Confluence.Templates.PagePermissions.helpLink());
            popup.popup.element.find('.dialog-button-panel').prepend('<div class=\'button-spinner\'>&nbsp;</div>');

            // todo one day we will get rid of these hideous popups
            popup.popup.element.find('#userpicker-popup-link').click(function() {
                var picker = window.open(AJS.contextPath()
                        + '/spaces/openuserpicker.action?key=' + AJS.params.spaceKey
                        + '&startIndex=0&onPopupSubmit=AJS.PagePermissions.addUserPermissions', 'EntitiesPicker', 'status=yes,resizable=yes,top=100,left=200,width=700,height=680,scrollbars=yes');
                picker.focus();
                return false;
            });
            popup.popup.element.find('#grouppicker-popup-link').click(function() {
                var picker = window.open(AJS.contextPath()
                        + '/spaces/opengrouppicker.action?key=' + AJS.params.spaceKey
                        + '&startIndex=0&actionName=dosearchgroups.action&onPopupSubmit=AJS.PagePermissions.addGroupPermissions', 'EntitiesPicker', 'status=yes,resizable=yes,top=100,left=200,width=580,height=550,scrollbars=yes');
                picker.focus();
                return false;
            });
            controls = AJS.PagePermissions.Controls(permissionManager);
            var $table = $('#page-permissions-table').bind('changed', updateButtonsUnsavedChanges);
            table = AJS.PagePermissions.Table($table);
            permissionManager.table = table;
        }

        /**
         * Makes final changes to the popup and then displays it.
         */
        function showPopup(data) {
            permissionManager.bookmark = {
                scrollX: document.documentElement.scrollLeft,
                scrollY: document.documentElement.scrollTop
            };

            updateButtonsNoUnsavedChanges();

            controls.setVisible(data.userCanEditRestrictions);

            AJSOverrides.setVisible('.permissions-update-button', data.userCanEditRestrictions);

            popup.show();
        }

        /**
         * Gets page restrictions (direct and inherited), plus group/user details from the server.
         * Also gets a flag if the user has permission to change restrictions or not from the server.
         */
        function loadPermissions(callback, editingPage) {
            // If editingPage, Space and Parent Page may have changed due to the Location editor on the edit screen.
            var spaceKey = (editingPage && $('#newSpaceKey').val()) || Meta.get('space-key');
            var parentPageTitle = (editingPage && $('#parentPageString').val()) || '';
            var params = {
                contentId: Meta.get('content-id'),
                parentPageId: Meta.get('parent-page-id'),
                parentPageTitle: parentPageTitle,
                spaceKey: spaceKey
            };
            var url = contextPath + '/pages/getcontentpermissions.action';

            $('#waitImage').show();

            $.getJSON(url, params, function(data) {
                $('#waitImage').hide();
                loadTableFromJson(data);
                callback(data);
                if (!data.error && isEditMode()) {
                    triggerEditPageRestrictionsUpdatedEvent(data.restrictionsHash);
                }
            });
        }

        function updateRestrictionsDialog() {
            if (popup) {
                loadPermissions(showPopup, isEditMode());
            }
        }

        /**
         * Called when the user opens the popup from the view or edit screens.
         *
         * @param isEditingAPage true if the popup is being called from a create/edit page screen, false otherwise
         */
        function openPopup(isEditingAPage) {
            popup || initPopup();
            loadPermissions(showPopup, isEditingAPage);
        }

        function updateButtonsUnsavedChanges() {
            FormStateControl.enableElement($('.permissions-update-button'));
            $('.button-panel-cancel-link').text(AJS.I18n.getText('cancel.name'));
        }

        function updateButtonsNoUnsavedChanges() {
            FormStateControl.disableElement($('.permissions-update-button'));
            $('.button-panel-cancel-link').text(AJS.I18n.getText('close.name'));
        }

        AJS.bind('deferred.page.permissions', function() {
            openPopup(isEditMode());
            return false;
        });
    };
});

require('confluence/module-exporter').safeRequire('confluence/page-permissions-manager', function(PagePermissionsManager) {
    'use strict';

    require('ajs').toInit(PagePermissionsManager);
});
