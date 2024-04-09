define('confluence-editor/legacy',
[
    'confluence/legacy'
],
function(
    Confluence
) {
    "use strict";

    // Deprecated, avoid using where possible, Temporary shim to ensure the global Confluence.Editor is available

    if (typeof Confluence === 'undefined') {
        Confluence = {};
    }

    if (typeof Confluence.Editor === 'undefined') {
        Confluence.Editor = {}
    };

    return Confluence.Editor;
});
