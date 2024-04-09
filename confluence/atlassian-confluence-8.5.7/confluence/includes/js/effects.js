/**
 * @module confluence/effects
 * @tainted Effect
 */
define('confluence/effects', [
    'document'
], function(
    document
) {
    'use strict';

    function setCookie(name, value, year, month, day, path, domain, secure) {
        var str = name + '=' + escape(value);

        if (year) {
            var expires = new Date(year, month, day);
            str += '; expires=' + expires.toGMTString();
        }

        if (path) {
            str += '; path=' + escape(path);
        } else {
            str += '; path=/';
        }

        if (domain) {
            str += '; domain=' + escape(domain);
        }

        if (secure) {
            str += '; secure';
        }

        document.cookie = str;
    }

    function getCookie(name) {
        var results = document.cookie.match(name + '=(.*?)(;|$)');

        if (results) {
            return (unescape(results[1]));
        }

        return null;
    }

    function highlight(element) {
        new Effect.Highlight(element, { endcolor: '#f0f0f0' });
    }

    return {
        setCookie: setCookie,
        getCookie: getCookie,
        highlight: highlight
    };
});

require('confluence/module-exporter').safeRequire('confluence/effects', function(Effects) {
    'use strict';

    window.setCookie = Effects.setCookie;
    window.getCookie = Effects.getCookie;
    window.highlight = Effects.highlight;
});
