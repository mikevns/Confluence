/**
 * @module confluence/backupadmin
 */
define('confluence/backupadmin', [
    'jquery'
], function(
    $
) {
    'use strict';

    return function() {
        var pathTextBox = $('#backupPath');

        $('#backupOption\\.default').click(function() {
            pathTextBox.val($('#defaultPath').val());
            pathTextBox.prop('disabled', true);
        });

        $('#backupOption\\.custom').click(function() {
            pathTextBox.prop('disabled', false);
        });
    };
});

require('confluence/module-exporter').safeRequire('confluence/backupadmin', function(BackupAdmin) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(BackupAdmin);
});
