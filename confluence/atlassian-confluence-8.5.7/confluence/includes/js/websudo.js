/**
 * @module confluence/websudo
 */
define('confluence/websudo', [
    'jquery',
    'ajs'
], function($,
    AJS) {
    'use strict';

    /**
     * @exports confluence/websudo
     */
    function WebSudo() {
        $('a#websudo-drop.drop-non-websudo').click(function() {
            $.getJSON($(this).attr('href'), function() {
                $('li#confluence-message-websudo-message').slideUp(function() {
                    // Once done, other elements like the sidebar
                    AJS.trigger('confluence.header-resized');
                });
            });
            return false;
        });
    }

    return WebSudo;
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/websudo', function(WebSudo) {
    'use strict';

    require('ajs').toInit(WebSudo);
});
