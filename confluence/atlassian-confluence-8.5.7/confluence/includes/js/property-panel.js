define('confluence/property-panel', [
    'jquery',
    'ajs',
    'confluence/position',
    'window',
    'document',
    'confluence/form-state-control'
], function(
    $,
    AJS,
    Position,
    window,
    document,
    FormStateControl
) {
    'use strict';

    /**
     * Add the property panel arrow/notch
     * @param parent - the property panel root element
     * @param shouldFlip - true if the arrow should appear below the property panel
     */
    var addArrow = function(parent, shouldFlip) {
        var $arrow = $('<div class="property-panel-arrow"></div>');
        if (shouldFlip) {
            $arrow.addClass('property-panel-bottom-arrow').css({ top: parent.outerHeight() });
        }
        parent.prepend($arrow);

        return $arrow;
    };

    /**
     * figures out if there is room above relative to the container to draw the propery panel
     * @param container - the container element you wish to test against
     * @param anchor - the element the property panel is attached to
     */
    var shouldDisplayAbove = function(container, anchor, panel, padding) {
        var panelHeight = panel.outerHeight();
        var heightNeeded = panelHeight + ~~padding;
        var spaceAvailable = Position.spaceAboveBelow(container[0], anchor);

        // Prefer below the anchor if possible.
        if (spaceAvailable.below >= heightNeeded) {
            return false;
        }

        // If space above, flip, otherwise don't (snapToElement will display at bottom of container.)
        return (spaceAvailable.above >= heightNeeded);
    };

    /**
     * Calculates the top and left pixels to locate the property-panel correctly with respect to its anchor element.
     * @param propertyPanel the AJS.Confluence.PropertyPanel to relocate w.r.t. its anchor and panel
     * @param options map of options for the repositioning, including:
     *          - delay : wait {delay} milliseconds before calculating and repositioning
     *          - animate : if true, animate the panel from its current position to the calculated one
     */
    var snapToElement = function(propertyPanel, options) {
        options = options || {};
        window.setTimeout(function() {
            var offset = AJS.Rte.Content.offset(propertyPanel.anchor);
            var ppWidth = propertyPanel.panel.width();
            var overlap = ppWidth + offset.left - $(window).width() + 10;
            var gapForArrowY = 7;
            var gapForArrowX = 0;
            var elemHeight = $(propertyPanel.anchor).outerHeight();
            var top;
            var left = offset.left - (overlap > 0 ? overlap : 0) - gapForArrowX;

            if (propertyPanel.shouldFlip) {
                top = offset.top - gapForArrowY - propertyPanel.panel.outerHeight() - 4; // acount for shadow
            } else {
                top = offset.top + gapForArrowY + elemHeight;
            }

            if (propertyPanel.options.anchorIframe) {
                // The anchor is in an iframe, so the Property Panel should display no lower than the bottom of the iframe.
                var $iframe = $(propertyPanel.options.anchorIframe);
                var iframeBottom = $iframe.offset().top + $iframe.height() - propertyPanel.panel.outerHeight() - 10;
                top = Math.min(top, iframeBottom);
            }
            // position the arrow 10 pixels from the left of the anchor
            propertyPanel.panel.find('.property-panel-arrow').css({
                left: Math.min(Math.abs(offset.left - left) + 16, ppWidth - 12)
            });

            // CONFDEV-1553. Ensure that the property panel is at always on screen, and not outside the display area
            // due to the positioning of the parent.
            left = Math.max(0, left);

            var css = {
                top: top,
                left: left,
                // Below aui-blanket which is 2980
                'z-index': 2975
            };
            var toAnimate = propertyPanel.panel.add();
            // might move this out to an if statement if this code sticks around
            options.animate ? toAnimate.animate(css, options.animateDuration) : (function() { toAnimate.css(css); }());
        }, options.delay || 0);
    };

    /**
     * Displays a property panel.
     *
     * @exports confluence/property-panel
     */
    var PropertyPanel = {

        shouldCreate: true,

        /**
         * Will hold a reference to the current displayed PropertyPanel, if any.
         */
        current: null,

        /**
         * Private (mockable) method to get a reference to the anchor element.
         */
        getAnchor: function() {
            return $(this.current.anchor);
        },

        /**
         * Creates a new PropertyPanel instance with the supplied buttons and attaches it to the supplied element.
         *
         * @param el {Element} the element in the RTE to attach the PropertyPanel to
         * @param buttons {Array} array of objects of the form { html: "", click: function(){} }
         * @param options {Object} map of options for the panel, e.g.
         *      anchorIframe - specifies the iframe that the anchor is inside of
         */
        createFromButtonModel: function(type, el, buttons, options) {
            var panel = $('<div></div>').attr({ class: 'panel-buttons' });
            for (var i = 0, ii = buttons.length; i < ii; i++) {
                if (!buttons[i]) { continue; }

                var button = buttons[i];
                var html = button.html || '<span class="icon ' + (button.iconClass ? button.iconClass : '') + ' "></span>';
                var classes = [];

                if (button.text) {
                    html += '<span class="panel-button-text">' + button.text + '</span>';
                }

                button.className && classes.push(button.className);
                button.disabled && classes.push('disabled');
                button.selected && classes.push('active');

                !buttons[i + 1] && classes.push('last');
                !buttons[i - 1] && classes.push('first');

                var element;
                if (!button.html) {
                    element = $('<a></a>').attr({
                        href: buttons[i].href || '#'
                    }).addClass('aui-button').html(html);
                    if (button.disabled) {
                        element.attr('title', button.disabledText);
                        FormStateControl.disableElement(element);
                        element.click(function(e) {
                            e.stopPropagation();
                            return false;
                        });
                    } else {
                        buttons[i].click && (function(button, element, el) {
                            element.click(function(e) {
                                button.click(element, el);
                                e.stopPropagation();
                                return false;
                            });
                        }(buttons[i], element, el));
                    }
                } else {
                    // If HTML has been provided use that instead of creating a button.
                    element = $(button.html);
                }

                element.attr('tabindex', '0');
                element.attr('role', 'button');

                button.ariaLabel && element.attr('aria-label', button.ariaLabel);
                button.tooltip && element.attr('data-tooltip', button.tooltip);
                element.addClass(classes.join(' '));
                panel.append(element);
            }
            return this.create(type, el, panel, options);
        },

        /**
         * Creates a new PropertyPanel instance with the supplied content and attaches it to the supplied element.
         *
         * @param anchor {Element} the element to anchor the PropertyPanel to
         * @param content {Element} the content to display inside the PropertyPanel
         * @param options {Object} map of options for the panel, e.g.
         *                  anchorIframe - specifies the iframe that the anchor is inside of
         */
        create: function(type, anchor, content, options) {
            options = options || {};
            AJS.Rte.BookmarkManager.storeBookmark();
            var parent = $('#property-panel');
            var panel;
            // this will default the value to true if not presesent, otherwise undefined would be false
            var enableFlip = options.enableFlip == undefined || options.enableFlip;
            var shouldFlip;
            parent.length && this.destroy();


            parent = $('<div></div>').addClass('aui-property-panel-parent').addClass(type + '-panel aui-box-shadow').attr('id', 'property-panel')
                .appendTo('body');
            panel = $('<div></div>').addClass('aui-property-panel').append(content);

            // as the element needs to have a display block, to calculate the height for rapheal
            // position it top of screen and off stage left so it doesnt flicker.
            parent.append(panel).css({
                top: 0,
                left: -10000
            });
            shouldFlip = enableFlip && shouldDisplayAbove($(options.anchorIframe || $(anchor).parent()), $(anchor), parent, 10);
            var that = this;
            // remove the margin from the last element, as its applied as padding to the container
            content.find('.last:last').css({ 'margin-right': 0 });


            var arrow = addArrow(parent, shouldFlip);

            this.current = {
                anchor: anchor,
                panel: parent,
                hasAnchorChanged: function(el) {
                    return el && that.hasAnchorChanged(el);
                },
                snapToElement: function(options) {
                    snapToElement(this, options);
                },
                shouldFlip: shouldFlip,
                tip: arrow,
                options: options,
                updating: true,
                type: type
            };

            snapToElement(this.current);
            panel = this.current;
            $(document).bind('keydown.property-panel.escape', function(e) {
                if (e.keyCode === 27) { // esc key
                    PropertyPanel.destroy();
                    anchor.focus();
                }
            });
            $(document).bind('click.property-panel', function(e) {
                // If click fired inside active property panel - ignore it
                if (!$(e.target).closest('#property-panel').length) {
                    PropertyPanel.destroy();
                }
            });

            this.trapFocus();
            AJS.trigger('created.property-panel', this.current);
            this.current.updating = false;
            return this.current;
        },
        /**
         * Tears down the current PropertyPanel.
         */
        destroy: function() {
            // if current is bound, then shadow and tip is as well
            if (!this.current) {
                AJS.log('PropertyPanel.destroy: called with no current PropertyPanel, returning');
                return;
            }
            if (this.current.updating) {
                AJS.log('PropertyPanel.destroy: called while updating, returning');
                return;
            }
            AJS.trigger('destroyed.property-panel', this.current);
            $(document).unbind('.property-panel').unbind('.contextToolbar');
            this.current.panel.remove();
            this.current = null;
        },
        /**
         * Returns true if the passed element is NOT the RTE anchor element for any current PropertyPanel, or
         * if the current PropertyPanel has changed in size.
         * @param el {Element} element to check against the current PropertyPanel anchor, if any.
         * @return {boolean}
         */
        hasAnchorChanged: function(el) {
            var c = this.current;
            if (c && $(c.anchor)[0] == $(el)[0]) {
                return (c.options.originalHeight && (c.options.originalHeight != $(el).height()));
            }
            return true;
        },

        /**
         * Focus trap inside property panel
         */
        trapFocus: function() {
            var focusableElements = $('.aui-property-panel .aui-button');

            focusableElements.last().on('keydown', function(e) {
                if ((e.key === 'Tab' && !e.shiftKey)) {
                    e.preventDefault();
                    focusableElements.first().focus();
                }
            });

            focusableElements.first().on('keydown', function(e) {
                if ((e.key === 'Tab' && e.shiftKey)) {
                    e.preventDefault();
                    focusableElements.last().focus();
                }
            });
        }
    };

    return PropertyPanel;
});

require('confluence/module-exporter')
    .exportModuleAsGlobal('confluence/property-panel', 'AJS.Confluence.PropertyPanel');
