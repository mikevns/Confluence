/* eslint @atlassian/confluence-server/deprecated-identifier:0 */
/**
 * @module confluence/api/event
 */
define('confluence/api/event', [
    'ajs'
], function(
    AJS
) {
    'use strict';

    return {
        bind: function() { AJS.bind.apply(this, arguments); },
        unbind: function() { AJS.unbind.apply(this, arguments); },
        trigger: function() { AJS.trigger.apply(this, arguments); },
        stopEvent: function() { AJS.stopEvent.apply(this, arguments); }
    };
});
