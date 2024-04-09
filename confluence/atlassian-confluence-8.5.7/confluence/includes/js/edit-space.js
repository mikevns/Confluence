/**
 * @module confluence/edit-space
 */
define('confluence/edit-space', [
    'jquery',
    'confluence/legacy'
], function(
    $,
    Confluence
) {
    'use strict';

    return function() {
        Confluence.Binder.autocompletePage($('.edit-space-details'));
    };
});

require('confluence/module-exporter').safeRequire('confluence/edit-space', function(EditSpace) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(EditSpace);
});
