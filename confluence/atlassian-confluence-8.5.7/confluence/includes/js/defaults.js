/**
 * Generic Confluence default values.
 *
 * @static
 * @since 4.0
 * @module confluence/defaults
 */
define('confluence/defaults', [
], function(
) {
    'use strict';

    return /** @alias module:confluence/defaults */ {
        // The maximum number of search results
        maxResults: 50
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/defaults', 'Confluence.Defaults');
