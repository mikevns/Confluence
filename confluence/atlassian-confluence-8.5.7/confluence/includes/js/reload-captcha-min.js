define("confluence/reload-captcha",["jquery","wrm/context-path"],function(a,c){return function(){a("#captcha-container .reload").click(function(d){var b=+Math.random(),e=a(".captcha-image");a('input[name="captchaId"]').val(b);e.attr("src",c()+"/jcaptcha?id="+b);a("#captcha-response").focus();d.stopPropagation();return!1})}});require("confluence/module-exporter").safeRequire("confluence/reload-captcha",function(a){require("ajs").toInit(a)});