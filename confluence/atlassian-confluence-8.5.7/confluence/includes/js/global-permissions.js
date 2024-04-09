/**
 * @module confluence/global-permissions
 */
define('confluence/global-permissions', [
    'jquery',
    'ajs'
], function(
    $,
    AJS
) {
    'use strict';

    return function() {
        var inlineHelpDisplay = '';
        var objects = { fadeTime: 200, width: 175, offsetX: -147 };
        var content = function(contents, trigger, showPopup) {
            contents.html('<div class=\'description\' id=\'permission-description\'>' + inlineHelpDisplay + '</div>');
            showPopup();
        };

        $('.inlineDialog-updateStatus').click(function() { inlineHelpDisplay = AJS.I18n.getText('update.user.status.permission.description'); });
        $('.inlineDialog-personalSpace').click(function() { inlineHelpDisplay = AJS.I18n.getText('personal.space.permission.description'); });
        $('.inlineDialog-createSpace').click(function() { inlineHelpDisplay = AJS.I18n.getText('create.space.permission.description'); });
        $('.inlineDialog-adminConfluence').click(function() { inlineHelpDisplay = AJS.I18n.getText('confluence.administrator.permission.description'); });
        $('.inlineDialog-adminSystem').click(function() { inlineHelpDisplay = AJS.I18n.getText('system.administrator.permission.description'); });
        $('.inlineDialog-unlicensedUseConfluence').click(function() { inlineHelpDisplay = AJS.I18n.getText('use.confluence.permission.unlicensed.description'); });
        $('.inlineDialog-anonymousUseConfluence').click(function() { inlineHelpDisplay = AJS.I18n.getText('use.confluence.permission.anonymous.description'); });
        $('.inlineDialog-unlicensedViewProfiles').click(function() { inlineHelpDisplay = AJS.I18n.getText('view.user.profiles.permission.unlicensed.description'); });
        $('.inlineDialog-anonymousViewProfiles').click(function() { inlineHelpDisplay = AJS.I18n.getText('view.user.profiles.permission.anonymous.description'); });
        $('.inlineDialog-confAdmins').click(function() { inlineHelpDisplay = AJS.I18n.getText('confluence.administrators.global.permission.description'); });

        AJS.InlineDialog($('.inlineDialog-updateStatus'), 2, content, objects);
        AJS.InlineDialog($('.inlineDialog-personalSpace'), 3, content, objects);
        AJS.InlineDialog($('.inlineDialog-createSpace'), 4, content, objects);
        AJS.InlineDialog($('.inlineDialog-adminConfluence'), 5, content, objects);
        AJS.InlineDialog($('.inlineDialog-adminSystem'), 6, content, objects);
        AJS.InlineDialog($('.inlineDialog-unlicensedUseConfluence'), 7, content, objects);
        AJS.InlineDialog($('.inlineDialog-anonymousUseConfluence'), 8, content, objects);
        AJS.InlineDialog($('.inlineDialog-unlicensedViewProfiles'), 9, content, objects);
        AJS.InlineDialog($('.inlineDialog-anonymousViewProfiles'), 10, content, objects);
        AJS.InlineDialog($('.inlineDialog-confAdmins'), 11, content, objects);
    };
});

require('confluence/module-exporter').safeRequire('confluence/global-permissions', function(GlobalPermissions) {
    'use strict';

    require('ajs').toInit(GlobalPermissions);
});
