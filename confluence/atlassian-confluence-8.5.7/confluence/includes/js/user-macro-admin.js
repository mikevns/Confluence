/**
 * @module confluence/user-macro-admin
 */
define('confluence/user-macro-admin', [
    'jquery',
    'window',
    'ajs',
    'document'
], function(
    $,
    window,
    AJS,
    document
) {
    'use strict';

    var UserMacroAdmin = {};

    UserMacroAdmin.initialize = function() {
        var macroList = $('#user-macros-admin');
        if (macroList.length) {
            macroList.on('click', '.remove', function() {
                var macroKey = $(this).closest('tr').attr('data-macro-key');
                var confirmMessage = AJS.I18n.getText('remove.macro.confirmation.message', macroKey);
                return window.confirm(confirmMessage);
            });
        }

        var errors = $('div.error[id^="userMacro."]:first');
        // Go to first error or first field
        var focusId = errors.length ? errors.attr('id').replace('-error', '') : 'userMacro.name';

        // Have to get via document method because jQuery doesn't handle dots in ids.
        var focusEl = document.getElementById(focusId);
        focusEl && focusEl.focus();
    };
    return UserMacroAdmin;
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/user-macro-admin', function(UserMacroAdmin) {
    'use strict';

    require('ajs').toInit(UserMacroAdmin.initialize);
});
