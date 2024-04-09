/**
 * @module confluence/tooltip
 * @deprecated Use AJS tooltip instead.
 */
define('confluence/tooltip', [
    'jquery'
], function(
    $
) {
    'use strict';

    return function(options) {
        var tooltipArrow = $('<div class="ajs-tooltip-arrow"></div>');
        var tooltip = $('<div class="ajs-tooltip">' + options.text + '</div>');
        var tooltipWrapper = $('<div class="ajs-tooltip-wrapper"></div>').appendTo($('body'));
        var halfArrowSize = 3;
        var setPosition = function() {
            var anchorPosition = options.anchor.offset();

            tooltipWrapper.css({
                left: anchorPosition.left + options.anchor.width(),
                // it displays 2px lower than we want for some reason so we subtract 2px
                top: anchorPosition.top + (options.anchor.height() / 2) - (tooltipWrapper.height() / 2) - 2
            });

            tooltipArrow.css({
                top: (tooltipWrapper.height() / 2) - halfArrowSize
            });
        };

        tooltipArrow.addClass('ajs-tooltip-arrow-left'); // TODO Take this as an option
        tooltipWrapper.append(tooltipArrow).append(tooltip);

        tooltip.css({
            width: options.width
        });

        options.anchor.bind('mouseover', function() {
            setPosition();
            tooltipWrapper.fadeIn('fast');
        });

        options.anchor.bind('mouseout', function() {
            tooltipWrapper.fadeOut('fast');
        });

        options.anchor.click(function(e) {
            e.preventDefault();
            if (!tooltipWrapper.is(':visible')) {
                setPosition();
                tooltipWrapper.fadeIn('fast');
            } else {
                tooltipWrapper.fadeOut('fast');
            }
        });
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/tooltip', 'AJS.Tooltip');
