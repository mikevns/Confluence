/**
 * @module confluence/page-links
 */
define('confluence/page-links', [
    'jquery'
], function(
    $
) {
    'use strict';

    /**
     * Returns Link metadata for a page, commonly found from <link> tags in the <head>.
     */
    return {

        /**
         * Returns a canonical URI for a Page or BlogPost, if present.
         */
        canonical: function() {
            // e.g. <link href="http://localhost:8080/confluence/display/TST/Home" rel="canonical">
            return $('head link[rel="canonical"]').attr('href');
        },

        /**
         * Returns a shortlink URI for a Page or BlogPost, if present.
         */
        shortlink: function() {
            // e.g. <link href="http://localhost:8080/confluence/x/BAAE" rel="shortlink">
            return $('head link[rel="shortlink"]').attr('href');
        }

    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/page-links', 'AJS.Meta.Links');
