/**
 * @module confluence/page-message
 */
define('confluence/page-message', [
    'ajs',
    'jquery',
    'confluence/meta',
    'window',
    'confluence/api/browser',
    'confluence-editor/editor/page-editor-message'
], function(AJS,
    $,
    Meta,
    window,
    Browser,
    EditorMessage) {
    'use strict';

    /**
     * Handles a message or flags which need to be displayed on initial page load
     */

    var PageMessage = {};
    var browser = new Browser(window.navigator.userAgent);

    PageMessage._getQueryString = function() {
        return window.location.search;
    };

    PageMessage.displayPageMessage = function() {
        var queryString = PageMessage._getQueryString();
        var userName = Meta.get('editing-user');
        if (queryString.indexOf('editingLocked') !== -1 && userName) {
            AJS.MessageHandler.flag({
                type: 'info',
                title: AJS.I18n.getText('editor.unavailable.title'),
                body: AJS.I18n.getText('limited.mode.existing.editor.body', AJS.escapeHtml(userName)),
                close: 'manual'
            });
        } else if (queryString.indexOf('editingFailed') !== -1) {
            AJS.MessageHandler.flag({
                type: 'info',
                title: AJS.I18n.getText('editor.unavailable.title'),
                body: AJS.I18n.getText('editor.unavailable.generic.body'),
                close: 'manual'
            });
        } else if (queryString.indexOf('userLimitReached') !== -1) {
            EditorMessage.handleMessage('collab.edit.user.limit.reached', {
                type: 'warning',
                title: AJS.I18n.getText('collab.edit.user.limit.msg.title'),
                message: AJS.I18n.getText('collab.edit.user.limit.msg.body'),
                close: 'manual'
            });
            AJS.Confluence.Analytics.publish(
                'collab.edit.user.limit.reached',
                {
                    browserName: browser.friendlyName(),
                    browserVersion: browser.version(),
                    pageId: Meta.get('page-id'),
                    editMode: 'slow',
                    numEditors: Meta.get('max-number-editors')
                }
            );
        } else if (queryString.indexOf('spaceEditingRestriction') !== -1) {
            var spaceKey = Meta.get('space-key');
            var title = Meta.get('content-type') === 'blogpost'
                ? AJS.I18n.getText('blog.space.restriction.title')
                : AJS.I18n.getText('page.space.restriction.title');
            var spaceSummaryUrl = Meta.get('context-path') + '/spaces/viewspacesummary.action?key=' + encodeURIComponent(spaceKey);
            var body = Meta.get('content-type') === 'blogpost'
                ? AJS.I18n.getText('blog.space.restriction.body', '<a href="' + spaceSummaryUrl + '">', '</a>')
                : AJS.I18n.getText('page.space.restriction.body', '<a href="' + spaceSummaryUrl + '">', '</a>');
            var flag = AJS.MessageHandler.flag({
                type: 'info',
                title: title,
                body: body,
                close: 'manual'
            });

            $(flag).addClass('spaceEditingRestriction');
        }
    };

    return PageMessage;
});

require('confluence/module-exporter').safeRequire('confluence/page-message', function(PageMessage) {
    'use strict';

    require('ajs').toInit(PageMessage.displayPageMessage);
});
