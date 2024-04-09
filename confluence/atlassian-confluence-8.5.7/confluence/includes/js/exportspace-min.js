define("confluence/exportspace",["jquery","ajs","window","raphael","confluence/api/constants"],function(a,h,k,l,m){return function(){function e(b){return function(e,d){var f=a(d).val(),g=a('input[name="contentToBeExcluded"]',a(d).parent());b?(h.debug("Unsetting contentToBeExcluded"),g.val("")):(h.debug("Setting contentToBeExcluded to "+f),g.val(f))}}a("a.checkAllLink").click(function(){a("input.exportContentTreeCheckbox").prop("checked",!0).each(e(!0));return!1});a("a.clearAllLink").click(function(){a("input.exportContentTreeCheckbox").prop("checked",
!1).each(e(!1));return!1});a("#includeComments").click(function(){a("#includeCommentsCopy").prop("checked",this.checked)});a("#includeCommentsCopy").click(function(){a("#includeComments").prop("checked",this.checked)});a("#backupAttachments").click(function(){a("#backupAttachmentsCopy").prop("checked",this.checked)});a("#backupAttachmentsCopy").click(function(){a("#backupAttachments").prop("checked",this.checked)});a("#contentOptionAll, #contentOptionVisible").click(function(){if(a("#contentOptionAll:checked").length)a("#exportContentTree").hide(),
a("#export-comments-attachments-options-container").hide(),a("#export-content-tree-container").hide();else{var b=a("#exportContentTree");if("true"!==b.attr("data-content-tree-loaded")){var i=function(){a(".exportContentTreeCheckbox").click(function(){var b=a(this),c=b.prop("checked");b.parent().find("input.exportContentTreeCheckbox").prop("checked",c).each(e(c))});a(".togglemeonlytreenode").click(function(b){var c=a(a(this).siblings(".exportContentTreeCheckbox").get(0));c.prop("checked")?c.prop("checked",
!1):c.prop("checked",!0);b.preventDefault()})},d=a("#exportContentTree"),f=l.spinner("exportContentTree",15,"#111"),g=m.CONTEXT_PATH+d.attr("data-content-tree-src"),j={key:d.attr("data-space-key")};a.ajax({type:"GET",url:g,data:j,success:function(a){f();d.attr("data-content-tree-loaded","true").html(a);i&&i()},error:function(b,c,e){f();b=h.template.load("content-tree-error-template").fill({errorText:e+" "+c+": url="+g+" params="+a.param(j)});d.attr("data-content-tree-loaded","true").html(b);a('div.buttons-container input.submit[name="confirm"]').attr("disabled",
"disabled")},dataType:"html"})}a("#export-comments-attachments-options-container").show();a("#export-content-tree-container").show();b.show()}});a(".export-space-choose-format form").submit(function(b){b.preventDefault();b=a(this);if(b=a("input[name=format]:checked",b).attr("data-href"))k.location.href=b})}});require("confluence/module-exporter").safeRequire("confluence/exportspace",function(a){require("ajs").toInit(a)});