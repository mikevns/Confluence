/**
 * @module confluence/api/browser
 * @example
 * require(['confluence/api/browser'], function(Browser){
 *     var browser = new Browser(window.navigator.userAgent);
 *     if(browser.isFirefox()) {
 *         //
 *     }
 * });
 */
define('confluence/api/browser', [
], function(
) {
    'use strict';

    /**
     * @param userAgent
     * @constructor
     * @alias module:confluence/api/browser
     */
    var Browser = function(userAgent) {
        /**
         * @method
         * @returns {boolean}
         */
        function isFirefox() {
            return userAgent.indexOf('Firefox/') !== -1;
        }

        /**
         * @method
         * @returns {boolean}
         */
        function notFirefox() {
            return !isFirefox();
        }

        /**
         * @method
         * @returns {boolean}
         */
        function isMSEdge() {
            return userAgent.indexOf('Edge/') !== -1;
        }

        /**
         * @method
         * @returns {boolean}
         */
        function notMSEdge() {
            return !isMSEdge();
        }

        /**
         * @method
         * @returns {boolean}
         */
        function isIE() {
            return userAgent.indexOf('MSIE') !== -1 || userAgent.indexOf('Trident/') !== -1 || isMSEdge();
        }

        /**
         * @method
         * @returns {boolean}
         */
        function notIE() {
            return !isIE();
        }

        /**
         * @method
         * @returns {boolean}
         */
        function isChrome() {
            return userAgent.indexOf('Chrome/') !== -1;
        }

        /**
         * @method
         * @returns {boolean}
         */
        function notChrome() {
            return !isChrome();
        }

        /**
         * @method
         * @returns {boolean}
         */
        function isSafari() {
            return userAgent.indexOf('Safari/') !== -1 && userAgent.indexOf('Chrome/') === -1;
        }

        /**
         * @method
         * @returns {boolean}
         */
        function notSafari() {
            return !isSafari();
        }

        /**
         * @method
         * @returns {boolean}
         */
        function isPhantom() {
            return userAgent.indexOf('PhantomJS') !== -1;
        }

        /**
         * @method
         * @returns {boolean}
         */
        function notPhantom() {
            return !isPhantom();
        }

        /**
         * @method
         * @returns {number}
         */
        function version() {
            if (isIE()) {
                var versionMatch = userAgent.match(/MSIE\s([\d.]+)/) || userAgent.match(/rv:([\d.]+)/) || userAgent.match(/Edge\/([\d.]+)/);
                return parseInt(versionMatch[1]);
            }
            if (isChrome()) {
                return parseInt(userAgent.match(/Chrome\/([\d.]+)/)[1]);
            }
            if (isSafari()) {
                return parseInt(userAgent.match(/Version\/([\d.]+)/)[1]);
            }
            if (isFirefox()) {
                return parseInt(userAgent.match(/Firefox\/([\d.]+)/)[1]);
            }
        }

        function friendlyName() {
            if (isMSEdge()) {
                return 'MSEdge';
            }
            if (isIE()) {
                return 'IE';
            }
            if (isChrome()) {
                return 'Chrome';
            }
            if (isSafari()) {
                return 'Safari';
            }
            if (isFirefox()) {
                return 'Firefox';
            }
        }

        return {
            isFirefox: isFirefox,
            notFirefox: notFirefox,
            isMSEdge: isMSEdge,
            notMSEdge: notMSEdge,
            isIE: isIE,
            notIE: notIE,
            isChrome: isChrome,
            notChrome: notChrome,
            isSafari: isSafari,
            notSafari: notSafari,
            isPhantom: isPhantom,
            notPhantom: notPhantom,
            version: version,
            friendlyName: friendlyName
        };
    };

    return Browser;
});
