/**
 * @module confluence/confluence-storage-manager
 */
define('confluence/confluence-storage-manager', [
    'ajs'
], function(
    AJS
) {
    'use strict';

    /**
     * Manager to store stuff in localStorage, only if supported by the browser.
     * It ensures that the keys are namespaced with 'confluence' to avoid clashing with anything else.
     *
     * @param id of the storageManager to be returned. This is used to create a unique namespace prefex for keys.
     */
    return function(id) {
        return AJS.storageManager('confluence', id);
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/confluence-storage-manager', 'Confluence.storageManager');
