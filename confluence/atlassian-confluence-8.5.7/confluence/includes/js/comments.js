/**
 * @module confluence/comments
 */
define('confluence/comments', [
    'ajs',
    'jquery',
    'confluence/storage-manager',
    'confluence/message-controller'
], function(
    AJS,
    $,
    ConfluenceStorageManager,
    MessageController
) {
    'use strict';

    /**
     * Ask the user to confirm and then execute the request if they really want to delete the comment
     * @param commentId the comment ID
     */
    function confirmRemovalHandler(commentId) {
        if (confirm(AJS.I18n.getText('remove.comment.confirmation.message'))) {
            $.ajax({
                type: 'DELETE',
                url: AJS.contextPath() + '/rest/api/content/' + commentId,
                contentType: 'application/json',
                dataType: 'json'
            }).done(function() {
                redirectAndShowComments();
            }).fail(function(jqXhr) {
                MessageController.showError(MessageController.parseError(jqXhr), MessageController.Location.FLAG);
            });
        }
    }

    /**
     * Redirect the user to the same page and scroll to the comments section
     */
    function redirectAndShowComments() {
        var searchString = document.location.search;
        if (searchString.indexOf('showComments') === -1) {
            searchString += searchString.indexOf('?') !== -1 ? '&showComments=true' : '?showComments=true';
            // reload page by assigning new value
            document.location.search = searchString;
        } else {
            document.location.reload();
        }
    }

    /** ,
     * Bind a function to the remove option for the identified comment.
     *
     * TODO remove is actually a pluggable web-item. We actually need a more flexible/pluggable
     * mechanism for doing this. For instance, Likes would need dynamic binding list this as
     * well.
     *
     * @param commentId
     */
    var binder = {
        bindRemoveConfirmation: function(commentId) {
            $('#comment-' + commentId + ' .comment-action-remove a').click(function(e) {
                e.preventDefault();
                confirmRemovalHandler(commentId);
                return false;
            });
        }
    };

    function initialiser() {
        var commentsStorage = ConfluenceStorageManager('confluence', 'comments');

        if (!$('#comments-section').length) {
            return;
        }

        /*
         * Alternate colours of comments. Doing this with threaded comments in the backend
         * is painful.
         */
        $('#comments-section').find('.comment:odd').addClass('odd');

        /*
         * Remove comment pop-up confirmation.
         */
        $('.comment-action-remove a').click(function() {
            var commentId = $(this).attr('id').replace(/remove-comment-/g, '');
            confirmRemovalHandler(commentId);
            return false;
        });

        // Text editor bindings
        var textEditor = $('#addcomment.comment-text');
        var textarea = $('#comments-text-editor').find('textarea');
        textarea.focus(function() {
            textEditor.addClass('active');
        }).blur(function() { // html5 supported browsers
            if (!$.trim(textarea.val()).length) {
                textEditor.removeClass('active');
            }
        }).bind('reset.default-text', function() { // non html5 supported browsers
            textEditor.removeClass('active');
        });

        // prevent empty comments
        $('form[name=\'textcommentform\']').submit(function() {
            var content = textarea.val();
            if (!$.trim(content)) {
                alert(AJS.I18n.getText('content.empty'));
                return false;
            }
            return true;
        });
        $('#add-comment-rte').click(function() {
            if (!textarea.hasClass('placeholded')) {
                commentsStorage.setItem('text-comment', $.trim(textarea.val()));
            }
        });
        if ($('#addcomment #rte').length) {
            AJS.bind('init.rte', function(e, data) {
                var content = commentsStorage.getItem('text-comment');
                if (content) {
                    data.editor.setContent(content);
                    commentsStorage.setItem('text-comment', '');
                }
            });
        }
    }

    return {
        binder: binder,
        initialiser: initialiser
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/comments', function(Comments) {
    'use strict';

    // TODO this should be merged with Confluence.CommentsManager from the quick-comments plugin.
    // It will be done once Quick Comments is finished. Having CommentsManager in a plugin helps dev speed.
    require('confluence/legacy').Comments = Comments.binder;
    require('ajs').toInit(Comments.initialiser);
});
