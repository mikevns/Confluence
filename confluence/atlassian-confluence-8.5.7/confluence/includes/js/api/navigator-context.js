/**
 * @module confluence/api/navigator-context
 */
define('confluence/api/navigator-context', [
    'confluence/meta',
    'document'
], function(Meta, document) {
    'use strict';

    var _hasNumberField = function(name) {
        var value = _getNumberField(name);
        return typeof value !== 'undefined' && value !== 0;
    };
    var _getNumberField = function(name) {
        var fieldValue = Meta.get(name);
        if (!isNaN(fieldValue)) {
            return Number(fieldValue);
        }
        return undefined;
    };
    var _getStringField = function(name) {
        return Meta.get(name);
    };

    var isViewContentVisible = function() { return (!!document.querySelector('.page.view') || !!document.querySelector('.blogpost.view')); };
    var isEditContentVisible = function() { return (!!document.querySelector('.page.edit') || !!document.querySelector('.blogpost.edit')); };

    var hasDraftId = function() { return _hasNumberField('draft-id'); };
    var hasPageId = function() { return _hasNumberField('page-id'); };

    var getContentType = function() { return _getStringField('content-type'); };
    var getPageId = function() { return _getNumberField('page-id'); };
    var getDraftId = function() { return _getNumberField('draft-id'); };

    /*
     CONFDEV-41174: in future these context checks should rely solely on content-id.

     At the moment, in order to avoid flakeyness, we infer the content-id using other means:
         On the create page, we infer the content-id using the draft-id.
         On the edit page, we infer the content-id using the page-id.
         On the view page, we infer the content-id using the page-id.
     */

    var isContentCreateContext = function() { return isEditContentVisible() && (getPageId() === 0) && hasDraftId(); };
    var isContentEditContext = function() { return isEditContentVisible() && !isViewContentVisible() && (getPageId() !== 0); };
    var isContentViewContext = function() { return !isEditContentVisible() && isViewContentVisible() && hasPageId(); };

    var getContentCreateContext = function() {
        return {
            target: 'contentcreate',
            context: {
                contentId: getDraftId(),
                contentType: getContentType()
            }
        };
    };

    var getContentEditContext = function() {
        return {
            target: 'contentedit',
            context: {
                contentId: getPageId(),
                contentType: getContentType()
            }
        };
    };

    var getContentViewContext = function() {
        return {
            target: 'contentview',
            context: {
                contentId: getPageId(),
                contentType: getContentType()
            }
        };
    };

    var getDefaultContext = function() {
        return { target: 'unknown', context: {} };
    };

    var getCurrent = function() {
        if (isContentCreateContext()) {
            return getContentCreateContext();
        }

        if (isContentEditContext()) {
            return getContentEditContext();
        }

        if (isContentViewContext()) {
            return getContentViewContext();
        }

        return getDefaultContext();
    };

    return {
        getCurrent: getCurrent
    };
});
