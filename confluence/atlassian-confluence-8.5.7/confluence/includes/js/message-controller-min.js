define("confluence/message-controller",["ajs","jquery","confluence/flag","confluence/api/event","confluence/api/logger"],function(g,e,u,i,f){function j(a){return e(k).find("#"+n+a)}function o(){var a=e(k);0===a.length&&(a=e('<ul id="messageContainer"></ul>'),e("#full-height-container").prepend(a));return a}function l(){var a=o(),b=j("warning-banner");b.slideUp("normal",function(){b.remove();i.trigger("confluence.header-resized")});return a}function r(){var a=o(),b=j("success-banner");b.slideUp("normal",
function(){b.remove();i.trigger("confluence.header-resized")});return a}function p(a){var b={};"string"===typeof a?b.body=a:(b.title=a.title,b.body=a.body);return b}function q(){var a;for(a=0;a<h.length;a++)h[a].close();h=[]}function s(a){a=e.extend({},v,p(a));q();h.push(new u(a))}function t(a,b){var c=e.extend({id:b,closeable:!1},p(a));e('<li id="'+b+'"></li>').appendTo(k);g.messages.warning("#"+b,c);i.trigger("confluence.header-resized")}var h=[],m=function(a){this.name=a},d={FLAG:new m("flag"),
BANNER:new m("banner"),ALL:new m("all"),ANY:new m("any")},v={type:"error",close:"manual",fifo:!1},n="confluence-message-",k="#messageContainer";return{parseError:function(a,b){var c;try{c=JSON.parse(a.responseText).reason}catch(d){f.debug("No error-specific reason was provided. Using fallback messages...")}switch(a.status){case 403:c=g.I18n.getText("operation.forbidden.message");break;case 405:c="undefined"!==typeof c&&"READ_ONLY"===c?g.I18n.getText("read.only.mode.default.error.short.message"):void 0!==
b?b:g.I18n.getText("server.error.message");break;default:c=void 0!==b?b:g.I18n.getText("server.error.message")}return c},showError:function(a,b){var c=n+"warning-banner";switch(b){case d.FLAG:s(a);break;case d.BANNER:l();t(a,c);break;case d.ALL:s(a);l();t(a,c);break;default:f.debug("Invalid location to display an error provided.")}},clearErrors:function(a){switch(a){case d.FLAG:q();break;case d.BANNER:l();break;case d.ALL:q();l();break;default:f.error("Invalid location to clear errors.")}},hasErrors:function(a){var b=
j("warning-banner");switch(a){case d.FLAG:return 0<h.length;case d.BANNER:return 0<b.length;case d.ANY:return 0<h.length||0<b.length;default:f.error("Invalid location to check if there are any errors in")}return!1},showSuccess:function(a,b,c){a=e.extend({closeable:c?c.closeable:!1},p(a));c=n+"success-banner";switch(b){case d.BANNER:o();r();e('<li id="'+c+'"></li>').appendTo(k);g.messages.success("#"+c,a);i.trigger("confluence.header-resized");break;default:f.error("Invalid location to show success")}},
clearSuccess:function(a){switch(a){case d.BANNER:case d.ALL:r();break;default:f.error("Invalid location to clear success")}},hasSuccess:function(a){var b=j("success-banner");switch(a){case d.BANNER:case d.ANY:return 0<b.length;default:f.error("Invalid location to check the success flag/banner.")}return!1},Location:d}});