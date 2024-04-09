/**
 * @module confluence/sh-init
 */
define('confluence/sh-init', [
], function(
) {
    'use strict';

    return function() {
        dp.SyntaxHighlighter.HighlightAll('ajs-syntax-highlight');
    };
});

require('confluence/module-exporter').safeRequire('confluence/sh-init', function(shInit) {
    'use strict';

    require('ajs').toInit(shInit);
});
