/**
 * @module confluence/breadcrumbs-jquery
 */
define('confluence/breadcrumbs-jquery', [
    'jquery',
    'confluence/templates'
], function(
    $,
    Templates
) {
    'use strict';

    /**
     * Renders a set of breadcrumbs in the specified element. Typical usage:
     *
     *   $("some-element").renderBreadcrumbs([ { title: "Dashboard", url: "/dashboard.action" }, ... ]);
     *
     * @param items an array of objects with 'title' and 'url' properties, representing the breadcrumbs.
     */
    return function(items) {
        var el = this;
        var html = [];
        var i = 0;
        var last = items.length - 1;
        var space = items[i];
        var parent;
        var breadCrumbContainerWidth = el.closest('.breadcrumbs-container').width();
        var lessThanContainer = function() {
            return el.width() < breadCrumbContainerWidth;
        };
        var breadcrumbItems;

        html.push(Templates.Dialog.breadcrumbItem({
            text: space.title,
            title: space.title,
            className: (i === last ? 'last' : '')
        }));

        while (i++ < last) {
            parent = items[i];
            html.push(Templates.Dialog.breadcrumbItem({
                text: parent.title,
                title: parent.title,
                className: (i === last ? 'last' : '')
            }));
        }

        // shorten the middle items first then the space (first item) and then the last item
        this.html(html.join(''));
        breadcrumbItems = $('li a span', this);
        breadcrumbItems.each(function(index) {
            if (index !== 0 && index !== last) {
                $(this).shortenUntil(lessThanContainer);
            }
        });
        $(breadcrumbItems.get(0)).shortenUntil(lessThanContainer);
        $(breadcrumbItems.get(last)).shortenUntil(lessThanContainer);
        return this;
    };
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/breadcrumbs-jquery', 'jQuery.fn.renderBreadcrumbs');
