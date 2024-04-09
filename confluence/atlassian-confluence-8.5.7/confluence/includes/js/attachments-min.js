define("confluence/attachments",["ajs","confluence/templates","confluence/api/ajax","confluence/api/constants","confluence/message-controller"],function(d,c,l,j,m){function k(b){clearTimeout(h);a&&(d.log("Preventing submit due to recent form submission."),b.preventDefault());a=!0;h=setTimeout(function(){a=false},2E3)}var i={showOlderVersions:function(b){b(".attachment-history a").click(function(d){var e=b(this).parents("table.attachments"),c=b(this).parents("tr:first")[0].id.substr(11),e=b(".history-"+
c,e);b(this).toggleClass("icon-section-opened");b(this).toggleClass("icon-section-closed");e.toggleClass("hidden");b(this).attr("aria-expanded",b(this).hasClass("icon-section-opened"));d.stopPropagation();return!1})}},a=!1,h;return{component:i,initialiser:function(b){function a(d,c){return b(d).parents("["+c+"]").attr(c)}function e(c,a,e){var f=d.ConfluenceDialog({width:600,height:200,id:"attachment-removal-confirm-dialog"});f.addHeader(a);f.addPanel("",e);f.addSubmit(d.I18n.getText("ok"),function(){var a;
a={};l.ajax({type:"POST",url:c,data:a,success:function(){location.reload(!0)},error:function(a){var c=[];c.push(m.parseError(a));a.responseText&&(a=b.parseJSON(a.responseText),a.actionErrors&&(c=a.actionErrors));a=d.ConfluenceDialog({width:600,height:200,id:"attachment-removal-error-dialog"});a.addHeader(g.removalErrorTitle());a.addPanel("",g.removalErrorBody({messages:c}));a.addButton(d.I18n.getText("close.name"),function(){location.reload(true)});a.show();a.updateHeight();f.remove()}})});f.addCancel(d.I18n.getText("cancel.name"),
function(){f.remove()});f.show()}b("#upload-attachments").on("submit",k);var h=b("#more-attachments-link");h.click(function(a){b(".more-attachments").removeClass("hidden");h.addClass("hidden");a.stopPropagation();return!1});i.showOlderVersions(b);var g=c.Attachments;b(".removeAttachmentLink").click(function(){i.showRemoveAttachmentConfirmDialog(this);return!1});b(".removeAttachmentLinkVersion").click(function(){e(j.CONTEXT_PATH+"/json/removeattachmentversion.action"+this.search,g.versionRemovalConfirmationTitle(),
g.versionRemovalConfirmationBody({filename:a(this,"data-attachment-filename"),version:a(this,"data-attachment-version")}));return!1});i.showRemoveAttachmentConfirmDialog=function(b){var c=j.CONTEXT_PATH+"/json/removeattachment.action"+b.search,d=g.removalConfirmationTitle(),b=g.removalConfirmationBody({filename:a(b,"data-attachment-filename")});e(c,d,b)}},submitHandler:k}});
require("confluence/module-exporter").safeRequire("confluence/attachments",function(d){var c=require("ajs");c.Attachments=d.component;c.toInit(d.initialiser)});