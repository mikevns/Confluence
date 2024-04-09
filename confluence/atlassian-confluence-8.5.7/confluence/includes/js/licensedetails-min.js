define("confluence/licensedetails","jquery ajs aui/form-validation confluence/templates aui/dialog2 confluence/api/constants confluence/api/ajax confluence/analytics-support".split(" "),function(e,a,h,f,i,j,k,l){function m(){var d=null,a=e("#updateLicenseForm").on("aui-valid-submit",function(c){if(d!==null){c.preventDefault();d()}});this.clear=function(){d=null};this.validate=function(c){c.crossgradeableApps.length>0&&(d=function(){var b=function(b){l.publish("confluence.license-compatibility-dialog-"+
b,{appCrossgradeCount:c.crossgradeableApps.length})},g=i(f.LicenseDetails.crossgradeWarningDialog(c));g.$el.on("click","button.show-apps",function(){var a=window.open();a.document.write(f.LicenseDetails.showApps(c));a.opener=null;b("see-data-center-apps-clicked")}).on("click","button.cancel",function(){b("cancel");e("#licenseString").val("");g.remove()}).on("click","button.confirm",function(){d=null;b("finish");a.submit()}).on("click","a.learn-more",function(){b("learn-more-clicked")});g.show();b("shown")})}}
return function(){var d=a.I18n.getText("licence.update.flag.body",a.I18n.getText("license.update.flag.learn.more.link"),a.I18n.getText("license.update.flag.clustering.link")),f=new m,c=j.CONTEXT_PATH;h.register(["validlicense"],function(b){f.clear();k.post(c+"/rest/license/1.0/license/validate",{licenseKey:b.$el.val()},function(a){f.validate(a);b.validate()}).fail(function(a){b.invalidate(a.responseText)})});if(window.location.hash==="#updateSuccessful"){e.get(c+"/rest/license/1.0/license/details",
function(b){b.dataCenter&&a.flag({type:"success",title:a.I18n.getText("licence.update.flag.title"),body:d,close:"manual"})});window.location.hash=""}}});require("confluence/module-exporter").safeRequire("confluence/licensedetails",function(e){require("ajs").toInit(e)});