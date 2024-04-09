/**
 * Binds the language picker in Confluence Setup.
 */
require([
    'ajs',
    'jquery',
    'confluence/language-picker'
], function(AJS,
    $,
    LanguagePicker) {
    'use strict';

    AJS.toInit(function() {
        var $spinner = $('#header-actions-wait');
        var $languageTrigger = $('#language-trigger');
        var $nextButton = $('#setup-next-button');

        function _disableLanguagePicker() {
            $languageTrigger.prop('disabled', true);
            $languageTrigger.attr('aria-disabled', 'true');
        }

        LanguagePicker.init('language', {
            onBeforeSelect: function() {
                $spinner.show();
                _disableLanguagePicker();
                $nextButton.prop('disabled', true);
                $nextButton.data('disabled-by-language', true);
            }
        });

        $nextButton.click(_disableLanguagePicker);
    });
});
