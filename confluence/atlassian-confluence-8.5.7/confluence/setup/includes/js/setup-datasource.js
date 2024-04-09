require([
    'jquery',
    'confluence/setup/setupdb'
],
function($, testConnection) {
    'use strict';

    $(function() {
        $('#testConnection').click(testConnection.testConnection);
        $('#setup-next-button').click(testConnection.testAndSubmit);
        $('input.text').keypress(testConnection.hideSuccessMessage);
    });
});
