/**
 * Dynamically updates the description of the current selection.
 *
 * @module confluence/force-upgrade
 */
define('confluence/force-upgrade', [
    'jquery',
    'ajs',
    'confluence/meta',
    'confluence/api/ajax',
    'confluence/api/logger'
], function(
    $,
    AJS,
    Meta,
    SafeAjax,
    logger
) {
    'use strict';

    return function() {
        var upgradeSelected = function() {
            var selectBox = $(this);
            var description = selectBox.parent().find('.description');
            description.html(AJS.I18n.getText('upgrade.description.loading')).addClass('loading');
            logger.debug('User selected value: ' + selectBox.val());
            SafeAjax.ajax({
                url: Meta.get('context-path') + '/admin/get-upgrade-description.action',
                data: {
                    upgradeTaskToRun: selectBox.val()
                },
                method: 'GET',
                dataType: 'json',
                error: function() {
                    // ignore - not important functionality
                    description.removeClass('loading').text('');
                },
                success: function(data) {
                    if (data.description) {
                        description.text(data.description).removeClass('loading');
                    }
                }
            });
        };
        $('#upgradeTaskToRun').change(upgradeSelected);
    };
});

require('confluence/module-exporter').safeRequire('confluence/force-upgrade', function(ForceUpgrade) {
    'use strict';

    var AJS = require('ajs');
    AJS.toInit(ForceUpgrade);
});
