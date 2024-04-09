require([
    'confluence/setup/setup',
    'jquery'
],
function(
    setup,
    $
) {
    'use strict';

    var SETUP_TYPE_KEY = 'setup-type';
    var CHOICES_CLASS = 'confluence-setup-choice-box';
    var ACTIVE_CHOICE_CLASS = 'confluence-setup-choice-box-active';

    $(function() {
        var $databaseChoices = $('.' + CHOICES_CLASS);
        var $dbChoice = $('#dbChoice');

        // Select "My own database (for product sites)" item by default.
        var $customItem = $('div').find('[data-setup-type=\'custom\']');
        $customItem.addClass(ACTIVE_CHOICE_CLASS);
        $dbChoice.val('custom');

        $databaseChoices.click(function(e) {
            // deselect current selected option
            $('.' + ACTIVE_CHOICE_CLASS).removeClass(ACTIVE_CHOICE_CLASS);

            var $target = $(e.target).closest('.' + CHOICES_CLASS);
            $target.addClass(ACTIVE_CHOICE_CLASS);

            var databaseChoiceValue = $target.data(SETUP_TYPE_KEY);
            $dbChoice.val(databaseChoiceValue);
        });

        $('#setupdbchoice').submit(function() {
            if ($dbChoice.val() === 'embedded') {
                disableButtons();
                setup.showSpinner(AJS.I18n.getText('embedded.setup.loading'));
            }
        });

        function disableButtons() {
            $('#setup-next-button').attr('disabled', 'disabled');
        }
    });
});
