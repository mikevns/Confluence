/**
 * Uses a hidden iFrame to launch a custom protocol link without redirecting the page
 * @module confluence/create-space
 */
define('confluence/custom-protocol-launcher', [
    'document',
    'confluence/api/logger'
], function(
    document,
    logger
) {
    'use strict';

    var hiddenIframeId = 'confluence_hiddenIframe';

    /**
     * Create an empty iframe on DOM tree
     *
     * @param {Element} target Element to attach hidden iFrame to
     * @return {Element}
     * @private
     */
    function getOrCreateHiddenIFrame(target) {
        var iframe;
        iframe = document.querySelector('#' + hiddenIframeId);
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.src = 'about:blank';
            iframe.id = hiddenIframeId;
            iframe.style.display = 'none';
            target.appendChild(iframe);
        }
        return iframe;
    }

    /**
     * Based on iframe lost focus and timeout event
     *
     * @param {string} uri Protocol URI to launch on desktop
     */
    function openUri(uri) {
        var iframe = getOrCreateHiddenIFrame(document.body);
        try {
            iframe.contentWindow.location.href = uri;
        } catch (e) {
            logger.log('Error while try to open URI' + e);
        }
    }

    return {
        openUri: openUri
    };
});
