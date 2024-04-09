/**
 * @module confluence/page-location
 */
define('confluence/page-location', [
    'ajs',
    'confluence/meta'
], function(
    AJS,
    Meta
) {
    'use strict';

    /**
     * Makes the current location of the viewed/edited page available to other scripts.
     */
    var location = null;

    return {
        get: function() {
            if (location) {
                return location; // location has been changed since page load by the Move Page Dialog
            }

            return {
                spaceName: Meta.get('space-name'),
                spaceKey: Meta.get('space-key'),
                parentPageTitle: Meta.get('parent-page-title')
            };
        },

        set: function(loc) {
            location = loc;
        }
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/page-location', 'Confluence.PageLocation');
