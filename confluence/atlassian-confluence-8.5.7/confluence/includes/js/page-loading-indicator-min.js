define("confluence/page-loading-indicator",["jquery","underscore","ajs","confluence/templates"],function(c,k,a,h){return function(b){function d(){return c(".confluence-page-loading-blanket",b)}function e(){return c(".confluence-loading-indicator",b)}return{show:function(){0===d().length&&c(b).append(h.pageLoadingIndicator());d().show();e().spin({lines:12,length:8,width:4,radius:10,trail:60,speed:1.5,color:"#F0F0F0"})},hide:function(){e().stop();d().hide()},showUntilResolved:function(c,b){var f=this.hide.bind(this);
this.show();c.then(function(){f()},function(){b&&a.messages.error(".confluence-page-loading-errors",{body:b});f()})},showUntilDialogVisible:function(b,d){var f=d||a.I18n.getText("dialog.deferred.error.loading"),g=this.hide.bind(this),e=c(".aui-dialog:visible"),h=c(".aui-dialog2:visible");!e.length&&!h.length&&this.show();b.then(function(){g()},function(){a.messages.error(".confluence-page-loading-errors",{body:f});g()});a.bind("show.dialog",function i(){a.unbind("show.dialog",i);g()});if(null!=a.dialog2&&
void 0!=a.dialog2)a.dialog2.on("show",function j(){a.dialog2.off("show",j);g()})},destroy:function(){b.remove(".confluence-page-loading-blanket")}}}});require("confluence/module-exporter").exportModuleAsGlobal("confluence/page-loading-indicator","Confluence.PageLoadingIndicator");