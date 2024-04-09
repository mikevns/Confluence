/**
 * @module confluence/position
 */
define('confluence/position', [
    'jquery'
], function(
    $
) {
    'use strict';

    /**
     * Position help to position elements relative to other elements within a container.
     */
    return {
        /**
         * Visible space above an element within a viewport.
         *
         * @param containerElement element, such as an iframe, or div (not-jquery'd).
         * @param element the element to determine space above and below (jquery'd).
         *
         * @return object with <strong>above</strong> space between top of visible area and the bottom of the element
         *         (may be negative is element is above the top of the screen); and
         *         <strong>below</strong> space between bottom of visible area and the bottom of the element (may be
         *         negative if is element is below the bottom of the screen.
         */
        spaceAboveBelow: function(containerElement, element) {
            var elementPos = element.position().top;
            var iframe;
            var body;
            var anchorHeight = element.outerHeight(true);
            var viewPortHeight;
            var above;
            var below;

            if (containerElement.nodeName === 'IFRAME') {
                iframe = containerElement.contentWindow || containerElement.contentDocument;
                viewPortHeight = $(containerElement).height();
                body = $(iframe.document || iframe);
                above = elementPos - body.scrollTop();
            } else {
                body = $(containerElement);
                viewPortHeight = body.height();
                above = elementPos - body.position().top;
            }

            below = viewPortHeight - above - anchorHeight;

            // IE10 sometimes returns a decimal number for these values, so we round to nearest integer.
            return {
                above: Math.round(above),
                below: Math.round(below)
            };
        }
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/position', 'AJS.Position');
