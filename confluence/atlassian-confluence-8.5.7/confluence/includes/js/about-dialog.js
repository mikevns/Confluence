/**
 * About Dialog
 * @module confluence/about-dialog
 */
define('confluence/about-dialog', [
    'jquery',
    'ajs',
    'aui/templates',
    'confluence/api/constants'
],
function(
    $,
    AJS,
    aui,
    CONSTANTS
) {
    'use strict';

    /**
     * @constructor
     * @alias module:confluence/about-dialog
     */
    function AboutDialog() {}

    /**
     * @returns {*|jQuery|HTMLElement}
     */
    AboutDialog.prototype.createChrome = function() {
        var closeButtonHTML = aui.buttons.button({
            type: 'link',
            id: 'close-about-dialog',
            text: AJS.I18n.getText('close.name')
        });
        var $chrome = $(aui.dialog.dialog2({
            id: 'about-confluence-dialog',
            modal: false,
            titleText: AJS.I18n.getText('aboutpage.section.title'),
            footerActionContent: closeButtonHTML,
            size: 'large'
        }));
        $chrome.on('click', '#close-about-dialog', function() {
            AJS.dialog2($chrome).hide();
        });
        return $chrome;
    };

    /**
     * @returns {*}
     */
    AboutDialog.prototype.getContents = function() {
        var contentUrl = CONSTANTS.CONTEXT_PATH + '/aboutconfluence.action';
        return $.get(contentUrl);
    };

    /**
     * @returns {*}
     */
    AboutDialog.prototype.create = function() {
        var $dialog = this.createChrome();
        this.getContents().then(function(data) {
            $dialog.find('.aui-dialog2-content').html(data).attr('id', 'about-page-content');
        });
        return AJS.dialog2($dialog);
    };

    return AboutDialog;
});

require('confluence/module-exporter').safeRequire('confluence/about-dialog', function(AboutDialog) {
    'use strict';

    var aboutDialog = null;

    require('ajs').bind('deferred.about-confluence.help-menu', function(e) {
        e.preventDefault();
        if (aboutDialog === null) {
            aboutDialog = (new AboutDialog()).create();
        }
        aboutDialog.show();
    });
});
