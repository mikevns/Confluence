// ==================
// = Drop-down menu =
// ==================

/**
 * @module confluence/menu
 * @analytics:
 *  confluence.page.page-menu.favourite,
 *  confluence.page.page-menu.unfavourite
 */
define('confluence/menu', [
    'ajs',
    'jquery',
    'document',
    'window',
    'confluence/api/ajax',
    'confluence/flag'
], function(
    AJS,
    $,
    document,
    window,
    safeAjax,
    Flag
) {
    'use strict';

    var Menu = {};

    /**
     * Check the entire document for any open drop downs.
     */
    var isAnyMenuBarOpen = function() {
        return $('.ajs-menu-bar.menu-bar-open').length > 0;
    };

    /**
     * Close any drop downs for the menu bar that the supplied item is in
     * @param an item in the menu that all drop downs have to be closed for
     */
    var closeMenuDropDowns = function(item) {
        $(item).closest('.ajs-menu-bar').find('.ajs-drop-down').each(function(index) {
            this.hide();
        });
    };

    /**
     * @param an item in the menu we want to check
     * @return true if the menu bar is opened
     */
    var isMenuBarOpen = function(item) {
        return $(item).closest('.ajs-menu-bar').hasClass('menu-bar-open');
    };

    /**
     * Add a class to the indicated menu bar that indicates it is open
     * @param an item in the menu to be marked
     */
    var markMenuBarOpen = function(item) {
        $(item).closest('.ajs-menu-bar').addClass('menu-bar-open');
    };

    var markMenuBarClosed = function(item) {
        $(item).closest('.ajs-menu-bar').removeClass('menu-bar-open');
    };

    Menu.ajsMenu = function(options) {
        options = options || {};

        $('.ajs-button', this).each(function() {
            $(this).mouseover(function() {
                var item = this;
                var menuBarOpened = isMenuBarOpen(item);
                closeMenuDropDowns(item);

                // if the menu bar was opened then any closed drop downs should open again
                // when the mouse returns over them.
                if (menuBarOpened) {
                    // set up a document handler to remove the open status (that we are about to add) when we click
                    // out side of the menu bar
                    var $document = $(document);

                    var myMenuClickOut = function() {
                        markMenuBarClosed(item);
                        return false;
                    };

                    $document.unbind('click.menu');
                    setTimeout(function() { $document.one('click.menu', myMenuClickOut); }, 1);
                    markMenuBarOpen(item);
                }
            });
        });

        $('.ajs-menu-item', this).each(function() {
            $(this).ajsMenuItem(options);
        });
    };

    Menu.ajsMenuItem = function(options) {
        options = options || {};
        var it = this;
        var $it = $(this);
        var dd = $('.ajs-drop-down', it);
        if (!dd.length) { return; }

        dd = dd[0];
        dd.hidden = true;
        dd.focused = -1;
        dd.hide = function() {
            if (!this.hidden) {
                $it.toggleClass('opened');
                // remove the menu-bar-open class if there are no open items on this menu now
                var $parentNode = $(it.parentNode);
                if ($parentNode.find('.opened').length === 0) {
                    markMenuBarClosed(it);
                }
                var as = $('a', this);
                $(this).toggleClass('assistive');
                this.hidden = true;
                $(document).unbind('click', this.fhide).unbind('keydown', this.fmovefocus).unbind('keypress', this.blocker);
                if (this.focused + 1) {
                    $(as[this.focused]).removeClass('active');
                }
                this.focused = -1;
            }
        };
        dd.show = function() {
            if (typeof this.hidden === 'undefined' || this.hidden) {
                var dd = this;
                var $dd = $(this);
                $dd.toggleClass('assistive');
                $it.toggleClass('opened');
                markMenuBarOpen(it);
                this.hidden = false;
                this.timer = setTimeout(function() { $(document).click(dd.fhide); }, 1);
                $(document).keydown(dd.fmovefocus).keypress(dd.blocker);
                var as = $('a', dd);
                as.each(function(i) {
                    var grandpa = this.parentNode.parentNode;
                    $(this).hover(function() {
                        if (grandpa.focused + 1) {
                            $(as[grandpa.focused].parentNode).removeClass('active');
                        }
                        $(this.parentNode).addClass('active');
                        grandpa.focused = i;
                    }, function() {
                        if (grandpa.focused + 1) {
                            $(as[grandpa.focused].parentNode).removeClass('active');
                        }
                        grandpa.focused = -1;
                    });
                });
                var topOfViewablePage = (window.pageYOffset || document.documentElement.scrollTop);
                var bottomOfViewablePage = topOfViewablePage + $(window).height();
                $dd.removeClass('above');
                if (!options.isFixedPosition) {
                    if ($dd.offset().top + $dd.height() > bottomOfViewablePage) {
                        $dd.addClass('above');
                        if ($dd.offset().top < topOfViewablePage) {
                            $dd.removeClass('above');
                        }
                    }
                }
            }
        };

        /**
         * @return true if the menu "bar" this drop down belongs to is opened already.
         */
        dd.isMenuBarOpened = function() {
            return isMenuBarOpen(dd);
        };

        /**
         * Close any other drop downs in the same menu as this dd
         */
        dd.closeOthers = function() {
            closeMenuDropDowns(dd);
        };

        dd.fmovefocus = function(e) { dd.movefocus(e); };
        dd.fhide = function(e) {
            dd.hide(e);

            // If this was called as the result of selecting an item in the menu then propagate the event.
            // otherwise it was called because a menu was clicked out of.
            return $(e.target).closest('.ajs-drop-down').length > 0;
        };

        dd.blocker = function(e) {
            var c = e.which;
            if (c === 40 || c === 38) {
                return false;
            }
        };
        dd.movefocus = function(e) {
            var c = e.which;
            var a = this.getElementsByTagName('a');
            var previousFocused = this.focused;
            var isTab = (c === 9);
            var outOfList;

            do {
                switch (c) {
                case 40:
                case 9: {
                    if (e.shiftKey) {
                        this.focused--;
                    } else {
                        this.focused++;
                    }
                    break;
                }
                case 38: {
                    this.focused--;
                    break;
                }
                case 27: {
                    this.hide();
                    return false;
                }
                default: {
                    return true;
                }
                }
                outOfList = (this.focused < 0 || this.focused > a.length - 1);
            } while (!outOfList && $(a[this.focused].parentNode).hasClass('assistive'));
            if (isTab && outOfList) {
                // If tab, and end of list, hide the list, and let the browser handle it
                if (previousFocused !== -1) {
                    $(a[previousFocused].parentNode).removeClass('active');
                }
                this.focused = -1;
                this.hide();
                return false;
            }
            if (!isTab) {
                // If up/down arrows, cycle the list and stop the browser default
                if (this.focused < 0) {
                    this.focused = a.length - 1;
                } else if (this.focused > a.length - 1) {
                    this.focused = 0;
                }
            }
            if (previousFocused >= 0) {
                $(a[previousFocused].parentNode).removeClass('active');
            }
            a[this.focused].focus();
            $(a[this.focused].parentNode).addClass('active');
            e.stopPropagation();
            e.preventDefault();
            return false;
        };

        var a = $('.trigger', it);
        if (a.length) {
            $it.mouseover(function() {
                // if the menu bar is already opened then hovering over other items
                // in the menu will activate them.
                if (dd.isMenuBarOpened()) {
                    if (dd.hidden) {
                        // close any other menus within this bar
                        closeMenuDropDowns(dd);

                        // open this menu
                        dd.show();
                    }
                } else {
                    // this menu bar is not already opened so add hover effect to any items hovered over
                    $it.addClass('hover');
                }
            });

            $it.mouseout(function() {
                if (!dd.isMenuBarOpened()) {
                    $it.removeClass('hover');
                }
            });

            a.click(function() {
                if (dd.hidden) {
                    a.parent('li').removeClass('hover');
                    // if there are not any other open menus then we can cancel the event
                    // (otherwise allow it to propagate to close any open menu)
                    var propagateEvent = isAnyMenuBarOpen();
                    dd.show();
                    a.attr('aria-expanded', true);
                    return propagateEvent;
                }

                dd.hide();
                a.parent('li').addClass('hover');
                a.attr('aria-expanded', false);
                return false;
            });
        }
    };

    Menu.initialiser = function() {
        $('#view-user-history-link').click(function(e) {
            var windowOpened = window.open(this.href, (this.id + '-popupwindow').replace(/-/g, '_'), 'width=600, height=400, scrollbars, resizable');
            windowOpened.opener = null;
            e.preventDefault();
            return false;
        });

        var flagDefaults = {
            close: 'manual',
            type: 'error',
            extraClasses: 'confluence-menu-flag',
            fifo: true,
            stack: 'menu'
        };

        var flag;

        /* TODO: Extract this logic out into a common js file */
        var showError = function(errorMessage) {
            if (flag) {
                flag.close();
            }
            flag = new Flag($.extend({}, flagDefaults, {
                body: errorMessage
            }));
        };

        $('#page-favourite').click(function(e) {
            var menuItem = $(this);
            var menuItemIcon = menuItem.find('.aui-icon');

            if (menuItem.hasClass('waiting')) {
            // already waiting
                e.stopPropagation();
                return false;
            }
            menuItem.addClass('waiting');
            var url = AJS.contextPath() + '/rest/experimental/relation/user/current/favourite/toContent/' + AJS.params.pageId;
            var type = (menuItem.hasClass('selected')) ? 'DELETE' : 'PUT';

            safeAjax.ajax({
                url: url,
                type: type,
                contentType: 'application/json',
                data: {},
                success: function() {
                    var isSelected = menuItem.hasClass('selected');
                    menuItem.toggleClass('selected ie-page-favourite-selected', !isSelected);
                    var tooltipText = !isSelected ? AJS.I18n.getText('pagemenu.unfavourite.tooltip') : AJS.I18n.getText('pagemenu.favourite.tooltip');
                    tooltipText += ' (' + AJS.I18n.getText('pagemenu.favourite.accesskey') + ')';
                    var buttonText = !isSelected ? AJS.I18n.getText('pagemenu.unfavourite', '<u>', '</u>') : AJS.I18n.getText('pagemenu.favourite', '<u>', '</u>');
                    menuItem.children('span').empty().append(menuItemIcon).append(' ')
                        .append(buttonText);
                    menuItem.attr('title', tooltipText);
                    menuItemIcon.toggleClass('aui-iconfont-unstar', isSelected);
                    menuItemIcon.toggleClass('aui-iconfont-star', !isSelected);
                    menuItem.removeClass('waiting');
                    // CONFDEV-37004 - if we don' remove focus, the button will keep the appearance of button till you click somewhere.
                    menuItem.blur();

                    var event = isSelected ? 'favourite' : 'unfavourite';
                    AJS.trigger('analytics', {
                        name: 'confluence.page.page-menu.' + event
                    });
                },
                error: function(jqXHR) {
                    switch (jqXHR.status) {
                    case 403:
                        showError(AJS.I18n.getText('operation.forbidden.message'));
                        break;
                    case 405:
                        var data = JSON.parse(jqXHR.responseText);
                        if (data.reason === 'READ_ONLY') {
                            showError(AJS.I18n.getText('read.only.mode.default.error.short.message'));
                        } else {
                            showError(AJS.I18n.getText('server.error.message'));
                        }
                        break;
                    default:
                        showError(AJS.I18n.getText('server.error.message'));
                    }
                    menuItem.removeClass('waiting');
                    // CONFDEV-37004
                    menuItem.blur();
                }
            });
            e.stopPropagation();
            return false;
        });

        var toolsMenu = $('#action-menu-link');

        if (toolsMenu.length) {
            toolsMenu.next().addClass('most-right-menu-item');
        }

        /*
         AUI Dropdown2 always sets the menu position via the
         `left` CSS property. Because some items in the tools
         menu are wider than the standard min-width, it grows
         to the right instead of the left, making it misalign
         with its trigger button.

         By swapping the `left` with the `right` on trigger,
         it will grow to the left (desired) as opposed to the
         right (undesired).

         This is supposed to be given "for free" with the
         `data-container` attribute, but I couldn't get it to
         work. I've left the attribute in in case it does work
         one day. :)
         */
        $('#action-menu').on({
            'aui-dropdown2-show': function() {
                $(this)
                    .css({
                        right: function() {
                            return $(window).width() - toolsMenu.offset().left - toolsMenu.outerWidth(true) - 1;
                        },
                        left: 'auto'
                    });
            }
        });

        $('.ajs-menu-bar').ajsMenu({ isFixedPosition: true });
    };

    /**
     * Dropdown Hackery. In IE6 if a link is wider than its dropdown, all the subsequent dropdowns break.
     * So we always make dropdowns wider than their link - done across browsers for consistency.
     * CRITICAL: CSS must reset the width of the hidden divs for IE6. Annoyingly it doesn't work if you do it with JS.
     * Currently the hidden dropdowns are excessively larger than their actual display size (about 1100px).
     * TODO: this would be much better if we could get real widths from the hidden dropdowns.
     */
    Menu.ieHack = function() {
        $('#header-menu-bar .ajs-menu-item').each(function() {
            var link = $(this);
            var dropDown = $('.ajs-drop-down', this);
            var linkWidth = link.width();
            if (linkWidth > dropDown.width()) {
                dropDown.width(linkWidth.valueOf() + 50);
                AJS.log('Dropdown width override occurred');
            }
        });

        // analytics for user menu
        $('#user-menu-link-content .user-item').on('click', function(e) {
            AJS.trigger('analyticsEvent', { name: 'user-menu-item.clicked', data: { id: $(this).attr('id') } });
        });

        $('#user-menu-link-content').on({
            'aui-dropdown2-show': function() {
                AJS.trigger('analyticsEvent', { name: 'confluence.user-menu.show' });
            },
            'aui-dropdown2-hide': function() {
                AJS.trigger('analyticsEvent', { name: 'confluence.user-menu.hide' });
            }
        });
    };

    return Menu;
});

require('confluence/module-exporter').safeRequire('confluence/menu', function(Menu) {
    'use strict';

    var $ = require('jquery');
    var AJS = require('ajs');

    $.fn.ajsMenu = Menu.ajsMenu;
    $.fn.ajsMenuItem = Menu.ajsMenuItem;
    AJS.toInit(Menu.initialiser);
    AJS.toInit(Menu.ieHack);
});
