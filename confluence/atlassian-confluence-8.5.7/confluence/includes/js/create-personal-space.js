/**
 * @module confluence/create-personal-space
 */
define('confluence/create-personal-space', [
    'jquery',
    'ajs',
    'confluence/templates'
], function(
    $,
    AJS,
    Templates
) {
    'use strict';

    return function() {
        var dialog = null;
        var createDialog = function() {
            var $createSpaceForm = $(Templates.CreateSpace.createPersonalSpaceForm({
                atlToken: $('#atlassian-token').prop('content')
            }));

            var submitCallback = function() {
                $createSpaceForm.submit();
            };

            var dialog = new AJS.ConfluenceDialog({
                width: 540,
                height: 300,
                id: 'create-personal-space-dialog',
                closeOnOutsideClick: true,
                onSubmit: submitCallback
            });

            dialog.addHeader(AJS.I18n.getText('create.personal.space.title'));
            dialog.addPanel('Panel 1', $createSpaceForm);

            dialog.addSubmit(AJS.I18n.getText('space.create.form.submit.button'), submitCallback);

            dialog.addCancel(AJS.I18n.getText('cancel.name'), function() {
                dialog.hide();
            });

            dialog.gotoPage(0);
            dialog.gotoPanel(0);
            return dialog;
        };

        var showDialog = function() {
            if (dialog == null) {
                dialog = createDialog();
            }

            dialog.show();
            $('#create-personal-space-dialog button.button-panel-submit-button').focus();
        };

        $('.create-personal-space-link').click(function() {
            showDialog();
            return false;
        });
    };
});

require('confluence/module-exporter').safeRequire('confluence/create-personal-space', function(CreatePersonalSpace) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(CreatePersonalSpace);
});
