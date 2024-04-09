require([
    'jquery',
    'confluence/setup/setup-tracker'
],
function(
    $,
    setupTracker
) {
    'use strict';

    $(function() {
        $('.finishAction').click(function() {
            var actionType = $(this).attr('id');
            setupTracker.insert(actionType);
        });
    });
});
