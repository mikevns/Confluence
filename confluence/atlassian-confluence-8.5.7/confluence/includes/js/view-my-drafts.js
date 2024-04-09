/**
 * @module confluence/view-my-drafts
 */
define('confluence/view-my-drafts', [
    'jquery',
    'ajs',
    'backbone',
    'confluence/templates'
], function(
    $,
    AJS,
    Backbone,
    Templates
) {
    'use strict';

    return Backbone.View.extend({
        events: {
            'click .view-legacy-draft': 'open'
        },

        initialize: function() {
            this.$el.append(Templates.LegacyDrafts.render());

            var dialog = AJS.dialog2('#legacy-draft-dialog');

            this.model.set({ dialog: dialog });

            var that = this;
            dialog.$el.find('.close').on('click', function() {
                dialog.hide();
            });

            dialog.on('hide', function() {
                that.close(that);
            });
        },

        render: function() {
            var dialog = this.model.get('dialog');
            dialog.$el.find('.aui-dialog2-header-main').text(this.model.get('title'));
            dialog.$el.find('.aui-dialog2-content').html(this.model.get('content'));
        },

        open: function(event) {
            event.preventDefault();
            AJS.trigger('analytics', { name: 'confluence.viewsource.resume.legacy.draft' });

            var that = this;
            var draftId = $(event.target).data('draftid');
            var draftTitle = $(event.target).data('drafttitle');

            var dfd = this.model.getPage(draftId);

            dfd.done(function(data) {
                var content = data.content;
                if (!content) {
                    content = AJS.I18n.getText('draft.no.content');
                    $('.legacy-draft-container').addClass('empty-draft');
                    $('.legacy-draft-hint').addClass('legacy-hint-no-display');
                }
                that.model.get('dialog').show();
                that.model.set({ title: draftTitle, content: content });
                that.render();
                $('body').addClass('no-select');
            });

            dfd.fail(function() {
                that.model.get('dialog').show();
                that.model.set({ title: AJS.I18n.getText('view.draft.error'), content: '' });
                $('.legacy-draft-hint').addClass('legacy-hint-no-display');
                that.render();
            });
        },

        close: function(view) {
            view.model.set({ title: '', content: '' });
            $('body').removeClass('no-select');
            $('.legacy-draft-container').removeClass('empty-draft');
            $('.legacy-draft-hint').removeClass('legacy-hint-no-display');
        }

    });
});

require('confluence/module-exporter').safeRequire('confluence/view-my-drafts', function(ViewMyDrafts) {
    'use strict';

    var AJS = require('ajs');
    var Backbone = require('backbone');
    var $ = require('jquery');
    var model = new Backbone.Model();
    model.getPage = function(draftId) {
        return AJS.safe.ajax({
            type: 'GET',
            url: AJS.contextPath() + '/rest/viewsrc/1.0/getPageSrc',
            data: { pageId: draftId }
        });
    };

    AJS.toInit(function() {
        new ViewMyDrafts({ el: $('body'), model: model });
    });
});
