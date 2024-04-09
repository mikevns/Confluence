/**
 * @module confluence/page-move-dialog-autocomplete
 */
define('confluence/page-move-dialog-autocomplete', [
    'jquery'
], function(
    $
) {
    'use strict';

    return function(url, appendTo, notFoundTemplate, selectionHandler) {
        var handler = selectionHandler;
        return $(this).quicksearch(url, null, {
            dropdownPostprocess: function(list) {
                $('> ol.last', list).remove();
                if (!$('> ol', list).length) { // empty list
                    $(list).append(notFoundTemplate);
                }
                $('> ol:last-child', list).addClass('last');
                $('a', list).attr('tabindex', '-1'); // prevent tabbing to links
            },
            dropdownPlacement: function(dropDown) {
                $(appendTo).append(dropDown);
            },
            ajsDropDownOptions: {
                selectionHandler: function(e, selected) {
                    if (selected) {
                        this.hide('selected');
                        handler(e, selected);
                        e.preventDefault();
                    }
                }
            }
        });
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/page-move-dialog-autocomplete', 'jQuery.fn.movePageAutocomplete');
