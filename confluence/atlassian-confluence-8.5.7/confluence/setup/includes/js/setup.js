define('confluence/setup/setup', [
    'jquery',
    'confluence/setup/setup-tracker'
],
function(
    $,
    setupTracker
) {
    'use strict';

    if (!$) { return; }

    $.fn.ready(function() {
        setupTracker.insert();

        $(document).bind('long-running-task-complete', function() {
            $('#wait-spinner').hide();
        });

        $(document).bind('long-running-task-failed', function() {
            $('#wait-spinner').hide();
            $('#task-elapsed-time-label').hide();
            $('#taskElapsedTime').hide();
        });

        // Disable the submit button(s) on the form after form is submitted
        $(document).on('submit', function() {
            var $form = $(this);
            setTimeout(function() {
                $form.find('input:submit').prop('disabled', 'true');
            }, 0);
        });
    });

    function showSpinner(message) {
        var template = $('#loading-spinner-template').html();
        var html = _.template(template)({ message: message });

        var $form = $('form');
        if ($('.setup-back-button').length) {
            $form.find('.setup-back-button').after(html);
        } else {
            $form.find(':submit').after(html);
        }
    }

    return {
        showSpinner: showSpinner
    };
});
