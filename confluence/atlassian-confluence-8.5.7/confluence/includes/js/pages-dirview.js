/**
 * @module confluence/pages-dirview
 */
define('confluence/pages-dirview', [
    'ajs',
    'jquery',
    'confluence/meta',
    'confluence/api/constants'
], function(
    AJS,
    $,
    Meta,
    CONSTANTS
) {
    'use strict';

    var ajaxCallback = function(data) {
        var error = '';
        if (data.actionErrors && data.actionErrors.length) {
            error = data.actionErrors.join('<br>');
            AJS.log('ajax parameters invalid : ' + error);
        }
        $('#resultsDiv').html(error);
    };

    var recordMove = function(sourceId, targetId, position) {
        var moveParams = {
            pageId: sourceId,
            position: position,
            targetId: targetId,
            mode: 'LEGACY'
        };
        AJS.trigger('analytics', { name: 'confluence.page.hierarchy.reorder', data: {} });
        AJS.safe.post(
            CONSTANTS.CONTEXT_PATH + '/pages/movepage.action',
            moveParams,
            ajaxCallback,
            'json'
        );
    };

    return function() {
        var tree = $('#tree-div').tree({
            url: CONSTANTS.CONTEXT_PATH + '/pages/children.action',
            initUrl: CONSTANTS.CONTEXT_PATH + '/pages/children.action?spaceKey=' + encodeURIComponent(Meta.get('space-key')) + '&node=root',
            parameters: ['pageId'],
            nodeId: 'pageId',
            drop: function() {
                $(this.source).addClass('flash');
                recordMove(this.source.pageId, this.target.pageId, this.position);
            },
            order: function() {
                // "order" means doing the alphanum order, i.e. reverting the manual order
                var pageId = this.source.pageId;
                $.getJSON(
                    CONSTANTS.CONTEXT_PATH + '/pages/revertpageorder.action',
                    { pageId: pageId },
                    ajaxCallback
                );
            },
            orderUndo: function() {
                // "orderUndo" means undoing the alphanum order, i.e. setting manual order again
                var pageId = this.source.pageId;
                var orderedChildIds = $.map(this.orderedChildren, function(li) {
                    return li.pageId;
                }).join();
                $.getJSON(
                    CONSTANTS.CONTEXT_PATH + '/pages/setpageorder.action',
                    { pageId: pageId, orderedChildIds: orderedChildIds },
                    ajaxCallback
                );
            },
            onready: function() {
                var doHighlight;
                if (!AJS.params.expandedNodes) {
                    AJS.params.expandedNodes = [];
                }
                if (AJS.params.openId) {
                    doHighlight = function() {
                        tree.findNodeBy('pageId', AJS.params.openId).highlight();
                    };
                }
                var nodes = [];
                for (var i = 0, ii = AJS.params.expandedNodes.length; i < ii; i++) {
                    nodes[i] = { pageId: AJS.params.expandedNodes[i] };
                }
                tree.expandPath(nodes.reverse(), doHighlight);
            }
        });
    };
});

require('confluence/module-exporter').safeRequire('confluence/pages-dirview', function(PageDirView) {
    'use strict';

    require('ajs').toInit(PageDirView);
});
