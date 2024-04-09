/**
 * @module confluence/api/type-helpers
 */
define('confluence/api/type-helpers', [

], function(

) {
    'use strict';

    /**
     * Utility methods for type conversion and checking.
     *
     * @exports confluence/api/type-helpers
     */
    var TypeHelpers = {};

    /**
     * Returns a boolean if the passed string is "true" or "false", ignoring case, else returns the original string.
     * @param value
     */
    TypeHelpers.asBooleanOrString = function(value) {
        var lc = value ? value.toLowerCase() : '';

        if (lc === 'true') {
            return true;
        }
        if (lc === 'false') {
            return false;
        }

        return value;
    };

    return TypeHelpers;
});

require('confluence/module-exporter').safeRequire('confluence/api/type-helpers', function(TypeHelpers) {
    'use strict';

    require('confluence/module-exporter').namespace('AJS.asBooleanOrString', TypeHelpers.asBooleanOrString);
});
