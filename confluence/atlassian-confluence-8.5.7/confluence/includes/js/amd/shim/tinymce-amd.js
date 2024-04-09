/// TODO: at the moment this code has a race condition with:
/// https://stash.atlassian.com/projects/CONFSERVER/repos/confluence-view-file-macro/browse/plugin/src/main/resources/js/amd/tinymce-amd.js
/// We need to resolve this race condition - but it seems not to cause any issues at the moment

/**
 * AMD Wrapper for the tinymce window global.
 * @tainted tinymce
 * @module tinymce
 */
define('tinymce', ['confluence-editor/init'], function() {
    'use strict';
    // The goal is not to introduce dependency from core on a module from a bundled plugin.
    // tinymce module must also no depend on the editor directly as we need to have editor loaded conditionally based on DF.

    return tinymce;
});
