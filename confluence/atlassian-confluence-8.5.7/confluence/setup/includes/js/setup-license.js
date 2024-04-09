require([
    'jquery',
    'underscore',
    'confluence/setup/setup-tracker'
],
function(
    $,
    _,
    setupTracker
) {
    'use strict';

    function trackEnterLicense() {
        var pluginKeys = $('#selectedPluginKeys').val();
        if (pluginKeys) {
            _.each(pluginKeys.split(','), function(pluginKey) {
                var licenseVal = $('textarea[name=\'' + pluginKey + '\']').val();
                if (licenseVal) {
                    setupTracker.insert('confluence.installer.addon.license.' + pluginKey);
                }
            });
        }
    }

    $(function() {
        $('#licenseform').on('submit', function() {
            trackEnterLicense();
        });
    });
});
