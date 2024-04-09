require([
    'jquery',
    'confluence/storage-manager'
],
function($,
    ConfluenceStorageManager) {
    'use strict';

    var SETUP_TYPE_KEY = 'setup-type';
    var SETUP_TYPE_STORAGE_KEY = 'confluence-setup-type';
    var CHOICES_CLASS = 'confluence-setup-choice-box';
    var ACTIVE_CHOICE_CLASS = 'confluence-setup-choice-box-active';
    var LocalStorage = new ConfluenceStorageManager('setup', 'setup-type');

    $(function() {
        var $setupChoices = $('.' + CHOICES_CLASS);
        var $setupType = $('#setupType');
        var $nextButton = $('#setup-next-button');

        var savedSetupTypeValue = LocalStorage.getItem(SETUP_TYPE_STORAGE_KEY);
        if (savedSetupTypeValue) {
            $setupChoices.filter(function() {
                return $(this).data(SETUP_TYPE_KEY) === savedSetupTypeValue;
            }).addClass(ACTIVE_CHOICE_CLASS);
            $setupType.val(savedSetupTypeValue);
            $nextButton.prop('disabled', false);
        } else {
            $nextButton.prop('disabled', true);
        }

        $setupChoices.click(function(e) {
            // deselect current selected option
            $('.' + ACTIVE_CHOICE_CLASS).removeClass(ACTIVE_CHOICE_CLASS);

            var $target = $(e.target).closest('.' + CHOICES_CLASS);
            $target.addClass(ACTIVE_CHOICE_CLASS);

            var setupTypeValue = $target.data(SETUP_TYPE_KEY);
            $setupType.val(setupTypeValue);
            LocalStorage.setItemQuietly(SETUP_TYPE_STORAGE_KEY, setupTypeValue);

            if ($('.' + ACTIVE_CHOICE_CLASS).length > 0 && !$nextButton.data('disabled-by-language')) {
                $nextButton.prop('disabled', false);
            } else {
                $nextButton.prop('disabled', true);
            }
        });

        $nextButton.click(function() {
            LocalStorage.removeItem(SETUP_TYPE_STORAGE_KEY);
        });
    });
});
