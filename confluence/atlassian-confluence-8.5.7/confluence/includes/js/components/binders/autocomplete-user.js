define('confluence/autocomplete-user', [
    'jquery',
    'ajs',
    'document'
], function(
    $,
    AJS,
    document
) {
    'use strict';

    /**
     * User Autocomplete Binder Component.
     * <br>
     * Expected markup:
     * &lt;input class="autocomplete-user" data-max="10" data-none-message="No results" data-target="#foo" data-template="{username}"&gt;
     * <li>class - (required) either 'autocomplete-user', 'autocomplete-group' or 'autocomplete-user-or-group'</li>
     * <li>data-none-message - a message to display when no results returned</li>
     * <li>data-max - maximum number of search results, defaults to 10 if not defined</li>
     * <li>data-alignment - alignment of the autocomplete dropdown relative to the input field. Defaults to "left" alignment</li>
     * <li>data-dropdown-target - a target element selector to place the autocomplete dropdown in.
     * If none specified it will be placed in a div immediately after the input field.</li>
     * <li>data-target - a target element selector to update its value with the value provided by data-template.
     * This is typically useful when you want to display the user's full name in the input field but submit the username
     * to the server, so another input element needs to be updated.</li>
     * <li>data-resize-to-input - sets the width of the dropdown to be the same as the input field
     * <br>
     * Events Thrown:
     * open.autocomplete-user-or-group, selected.autocomplete-user-or-group
     *
     * @since 3.3
     * @exports confluence/autocomplete-user
     */
    return function(scope) {
        scope = scope || document.body;

        var makeRestMatrixFromData = function(restObj) {
            if (!restObj || !restObj.result) {
                throw new Error('Invalid JSON format');
            }

            $.each(restObj.result, function(index, entry) {
                entry.key = entry.username || entry.name;
                if (entry.type === 'group') {
                    entry.title = entry.name;
                    entry.link = [];
                    entry.thumbnailLink = {
                        href: AJS.contextPath() + '/images/icons/avatar_group_48.png'
                    };
                }
            });

            var matrix = [];
            matrix.push(restObj.result);
            return matrix;
        };

        $.each(['user', 'group', 'user-or-group'], function(index, type) {
            $('input.autocomplete-' + type + '[data-autocomplete-user-or-group-bound!="true"]', scope).each(function() {
                var $this = $(this)
                    .attr('data-autocomplete-user-or-group-bound', 'true')
                    .attr('autocomplete', 'off');
                var maxResults = $this.attr('data-max') || 10;
                var alignment = $this.attr('data-alignment') || 'left';
                var dropDownTarget = $this.attr('data-dropdown-target');
                var dropDownPosition = null;
                var targetSelector = $this.attr('data-target');
                var showUnlicensed = $this.attr('data-show-unlicensed');
                var $target = targetSelector && $(targetSelector);
                var followUserBox = $('.follow-user-box');

                if (dropDownTarget) {
                    dropDownPosition = $(dropDownTarget);
                } else {
                    dropDownPosition = $('<div></div>');
                    $this.after(dropDownPosition);
                }

                if ($this.attr('data-resize-to-input')) {
                    dropDownPosition.width($this.outerWidth());
                    dropDownPosition.addClass('resize-to-input');
                }
                dropDownPosition.addClass('aui-dd-parent autocomplete');


                $this.quicksearch(AJS.REST.getBaseUrl() + 'search/' + type + '.json',
                    function() {
                        $this.trigger('open.autocomplete-user-or-group');
                        if (type === 'user') { // backwards compatibility
                            $this.trigger('open.autocomplete-user');
                        }
                    }, {
                        makeParams: function(val) {
                            return {
                                'max-results': maxResults,
                                query: val,
                                'show-unlicensed': showUnlicensed
                            };
                        },
                        dropdownPlacement: function(dd) {
                            dropDownPosition.append(dd);
                            var followUserBoxOl = followUserBox.parent().find('.autocomplete .aui-dropdown ol');
                            followUserBoxOl.attr('role', 'listbox');
                            followUserBoxOl.find('li').attr('role', 'none');
                            followUserBoxOl.find('li a').attr('role', 'option');
                        },
                        makeRestMatrixFromData: makeRestMatrixFromData,
                        addDropdownData: function(matrix) {
                            if (!matrix.length) {
                                var noResults = $this.attr('data-none-message');
                                if (noResults) {
                                    matrix.push([{
                                        name: noResults,
                                        className: 'no-results',
                                        href: '#'
                                    }]);
                                }
                            }

                            return matrix;
                        },
                        ajsDropDownOptions: {
                            alignment: alignment,
                            displayHandler: function(obj) {
                                if (obj.restObj && obj.restObj.username) {
                                    return obj.name + ' (' + AJS.escapeHtml(obj.restObj.username) + ')';
                                }
                                return obj.name;
                            },
                            selectionHandler: function(e, selection) {
                                if (selection.find('.search-for').length) {
                                    $this.trigger('selected.autocomplete-user-or-group', { searchFor: $this.val() });
                                    if (type === 'user') { // backwards compatibility
                                        $this.trigger('selected.autocomplete-user', { searchFor: $this.val() });
                                    }
                                    return;
                                }
                                if (selection.find('.no-results').length) {
                                    this.hide();
                                    e.preventDefault();
                                    return;
                                }

                                var contentProps = $('span:eq(0)', selection).data('properties');
                                if ($target) {
                                    var displayName = contentProps.restObj.title;
                                    if (contentProps.restObj.username) {
                                        displayName += ' (' + contentProps.restObj.username + ')';
                                    }
                                    $this.val(displayName);
                                    $target.val(contentProps.restObj.key);
                                } else {
                                    $this.val(contentProps.restObj.key);
                                }

                                $this.trigger('selected.autocomplete-user-or-group', { content: contentProps.restObj });
                                if (type === 'user') { // backwards compatibility
                                    $this.trigger('selected.autocomplete-user', { content: contentProps.restObj });
                                }
                                this.hide();
                                e.preventDefault();
                            }
                        }
                    });
            });
        });
    };
});

require('confluence/module-exporter').safeRequire('confluence/autocomplete-user', function(AutocompleteUser) {
    'use strict';

    var Confluence = require('confluence/legacy');

    Confluence.Binder.autocompleteUserOrGroup = AutocompleteUser;
    Confluence.Binder.autocompleteUser = function() {
        // backwards compatibility
    };
});
