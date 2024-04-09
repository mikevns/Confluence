define("confluence/aui-overrides",["window","ajs","jquery","confluence/api/type-helpers"],function(e,d,b,g){function f(){b("meta[name^=ajs-]").each(function(){var a=this.name,c=this.content,a=a.substring(4).replace(/(-\w)/g,function(a){return a.charAt(1).toUpperCase()});"undefined"===typeof d.params[a]&&(d.params[a]=g.asBooleanOrString(c))})}e.$=b;"undefined"!==typeof d&&f();return{enable:function(){return this.each(function(){var a=b(this);a.is("a")&&a.css("pointer-events","");var c=a.attr("disabled",
!1).attr("aria-disabled",!1).removeClass("disabled").attr("id");c&&b("label[for="+c+"]",a.parent()).removeClass("disabled")})},disable:function(){return this.each(function(){var a=b(this);a.is("a")&&a.css("pointer-events","none");var c=a.prop("disabled",!0).attr("aria-disabled",!0).addClass("disabled").attr("id");c&&b("label[for="+c+"]",a.parent()).addClass("disabled")})},debounce:function(a,c){var b;return function(){var d=this,e=arguments;b&&(clearTimeout(b),b=void 0);b=setTimeout(function(){a.apply(d,
e);b=void 0},c)}},metaToParams:f,setVisible:function(a,c){b(a)&&b(a).each(function(){var a=b(this).hasClass("hidden");a&&c?b(this).removeClass("hidden"):!a&&!c&&b(this).addClass("hidden")})}}});require("confluence/module-exporter").safeRequire("confluence/aui-overrides",function(e){var d=require("confluence/module-exporter");d.namespace("AJS.$.debounce",e.debounce);d.namespace("AJS.$.fn.enable",e.enable);d.namespace("AJS.$.fn.disable",e.disable)});