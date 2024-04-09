/**
 * @module confluence/setup/setup-tracker
 */
define('confluence/setup/setup-tracker', [
    'jquery',
    'ajs',
    'confluence/setup/utils'
],
function(
    $,
    AJS,
    utils
) {
    'use strict';

    var isDevMode = AJS.isDevMode ? AJS.isDevMode() : utils.getMeta('dev-mode');
    var iframeHost = isDevMode ? 'https://qa-wac.internal.atlassian.com' : 'https://www.atlassian.com';
    var iframeContextPath = '/pingback';

    function dataToUrl(data) {
        var queryStringParameters = [];
        for (var key in data) {
            queryStringParameters.push(key + '=' + encodeURIComponent(data[key]));
        }
        if (queryStringParameters.length) {
            return '?' + queryStringParameters.join('&');
        }
        return '';
    }

    function insertIframe(paramsString) {
        var deferred = $.Deferred();

        var $iframe = $('<iframe></iframe>')
            .css('display', 'none')
            .attr('src', iframeHost + iframeContextPath + paramsString)
            .attr('id', 'setup-properties');

        $iframe.load(function() {
            deferred.resolve();
        });
        $iframe.appendTo('body');

        setTimeout(function() {
            deferred.reject();
        }, 3000);

        return deferred.promise();
    }

    /**
     * The id from metadata takes always precedence over local storage,
     * which is used only as a fallback for action which does not inherit
     * from AbstractSetupAction (VerifySMTPServerConnection)
     *
     * @returns id of current setup session
     */
    function getSetupSessionId() {
        var id = utils.getMeta('setup-session-id');
        var key = 'confluence.setup.session.id';

        if (id) {
            localStorage.setItem(key, id);
        } else {
            id = localStorage.getItem(key);
        }

        return id;
    }

    function getDefaultParams(licenseType) {
        var defaultParams = {
            pg: window.location.pathname.replace(/\//g, '_'),
            product: 'confluence',
            'server-id': utils.getMeta('server-id'),
            SEN: utils.getMeta('SEN'),
            setupSessionId: getSetupSessionId(),
            v: utils.getMeta('version-number')
        };
        if (licenseType !== undefined) {
            defaultParams.pg += '-' + licenseType;
        }
        return defaultParams;
    }

    function insert(licenseType) {
        return insertIframe(dataToUrl(getDefaultParams(licenseType)));
    }

    return {
        insert: insert
    };
});
