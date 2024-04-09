/**
 * @module confluence/reload-captcha
 */
define('confluence/reload-captcha', [
    'jquery',
    'wrm/context-path'
], function(
    $,
    contextPath
) {
    'use strict';

    return function() {
        var reloadCaptcha = function() {
            var captchaId = +Math.random();
            var img = $('.captcha-image');
            $('input[name="captchaId"]').val(captchaId);
            img.attr('src', contextPath() + '/jcaptcha?id=' + captchaId);
        };

        $('#captcha-container .reload').click(function(e) {
            reloadCaptcha();
            $('#captcha-response').focus();
            e.stopPropagation();
            return false;
        });
    };
});

/* istanbul ignore next */
require('confluence/module-exporter').safeRequire('confluence/reload-captcha', function(ReloadCaptcha) {
    'use strict';

    require('ajs').toInit(ReloadCaptcha);
});
