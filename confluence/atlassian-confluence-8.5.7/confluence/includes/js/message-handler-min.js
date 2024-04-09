define("confluence/message-handler",["jquery","ajs"],function(d,h){var j=function(a){var c,b;c=function(){return a.baseElement};b=function(a){var c=d("ul",a);c.length||(c=d("<ul></ul>").appendTo(a));return c};return{getMessageContainer:c,clearMessages:function(){c().addClass("hidden").empty()},displayMessages:function(a){if(a&&a.length){d.isArray(a)||(a=[a]);for(var g=c(),i=b(g),e=0,f=a.length;e<f;e++)d("<li></li>").text(a[e]).appendTo(i);g.removeClass("hidden")}},handleResponseErrors:function(a,
c){var b=[].concat(a.validationErrors||[]).concat(a.actionErrors||[]).concat(a.errorMessage||[]);return b.length?(this.displayMessages(c||b),!0):!1}}},b=function(a,c){var b=d.extend(j(a),c&&c(a));b.getMessageContainer().addClass("message-handler");b.clearMessages();return b},e=!1,f;b.closeOnNew=function(a){if("undefined"!==typeof a)e=a;else return e};b.message=function(a,b,d){d=d||"success";e&&a.empty();return h.messages[d](a,{body:b,closeable:!0,shadowed:!0})};b.error=function(a,c){return b.message(a,
c,"error")};b.actionMessage=function(a,c){f=f||d(d("#action-messages","#action-messages-notifications")[0]);return b.message(f,a,c)};b.loading=function(a){return b.actionMessage(a,"info")};b.flag=function(a){return require("aui/flag")(d.extend({},{type:"success",close:"manual"},a))};return b});require("confluence/module-exporter").exportModuleAsGlobal("confluence/message-handler","AJS.MessageHandler");