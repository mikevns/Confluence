/**
 * @module confluence/page-move-dialog-location
 */
define('confluence/page-move-dialog-location', [
    'jquery',
    'ajs',
    'confluence/legacy',
    'confluence/meta',
    'window'
], function(
    $,
    AJS,
    Confluence,
    Meta,
    window
) {
    'use strict';

    /**
     * Renders the 'Known Location' tab with autocomplete in the move page dialog.
     *
     * @param controls should contain:
     * - an 'error' function for passing errors back to the caller
     * - a 'clearErrors' function to indicate no problems occurred
     * - a 'select' function to handle selection of a new parent page
     * - a 'moveButton' jQuery-wrapped element, which is the default button in the dialog
     */
    return function(controls) {
        var container = $(this);
        var space = $('#new-space', container);
        var spaceKey = $('#new-space-key', container);
        var parentPage = $('#new-parent-page', container);

        var isEditorAjaxSaveEnabled = AJS.DarkFeatures.isEnabled('editor.ajax.save')
                && !AJS.DarkFeatures.isEnabled('editor.ajax.save.disable');

        var updatePageLocation = function() {
            if (space.is(':visible')) {
                if (space.val() === '') {
                    space.val(Meta.get('space-name'));
                    spaceKey.val(Meta.get('space-key'));
                }

                controls.clearErrors();
                if (!isEditorAjaxSaveEnabled) {
                    controls.select(spaceKey.val(), space.val(), parentPage.val());
                } else if (parentPage.val()) {
                    controls.select(spaceKey.val(), space.val(), parentPage.val(), $('#parentPageId').val());
                } else {
                    controls.select(spaceKey.val(), space.val(), parentPage.val(), '');
                }
            }
        };

        // There is a race condition where clicking on the dropdown selection menu will first trigger
        // a blur on the input field and subsequently run the movePageAutocomplete() callback
        // The timeout here attempts to prevent two ajax requests from being sent by no immediately
        // updating the page location information when the field is blur()'ed. It instead waits some amount
        // of time to see if the user has selected and filled a value from the autocomplete before submitting
        // the request
        var fieldChanged = function() {
            var spaceVal = space.val();
            var pageVal = parentPage.val();

            window.setTimeout(function() {
                if (spaceVal === space.val() && pageVal === parentPage.val()) {
                    updatePageLocation();
                }
            }, 100);
        };

        parentPage.blur(fieldChanged).focus(function() {
            controls.clearErrors();
            AJS.dropDown.current && AJS.dropDown.current.hide();
        });
        space.blur(fieldChanged).focus(function() {
            AJS.dropDown.current && AJS.dropDown.current.hide();
        });

        space.movePageAutocomplete(
            '/rest/quicknav/1/search?type=spacedesc&type=personalspacedesc',
            $('.new-space-dropdown', container),
            Confluence.Templates.MovePage.noMatchingSpaces(),
            function(e, selected) {
                var props = selected.find('span').data('properties');
                spaceKey.val(props.spaceKey);
                space.val($('<span></span>').html(props.name).text());
                parentPage.val('');
                updatePageLocation();
                parentPage.focus();
            }
        );
        parentPage.movePageAutocomplete(
            function() { return '/rest/quicknav/1/search?type=page&spaceKey=' + spaceKey.val(); },
            $('.new-parent-page-dropdown', container),
            Confluence.Templates.MovePage.noMatchingPages(),
            function(e, selected) {
                var title = $('<span></span>').html(selected.find('span').data('properties').name).text();
                parentPage.val(title);
                if (isEditorAjaxSaveEnabled) {
                    $('#parentPageId').val($(selected).data().properties.id);
                }
                updatePageLocation();
                window.setTimeout(function() {
                    controls.moveButton.focus(); // focus slightly afterwards, so Firefox 2 doesn't submit the form
                }, 50);
            }
        );
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/page-move-dialog-location', 'jQuery.fn.movePageLocation');
