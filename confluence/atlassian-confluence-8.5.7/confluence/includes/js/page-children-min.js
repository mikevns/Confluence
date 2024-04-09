define("confluence/page-children",["jquery","ajs","raphael","confluence/api/constants"],function(b,c,k,d){return function(){var f,g,l=function(a){if(a.homePage){var b=c.I18n.getText("home.page");return'<span class="child-display"><span class="icon icon-home-page" title="'+b+'">'+b+':</span> <a href="'+d.CONTEXT_PATH+a.href+'">'+a.text+"</a></span>"}return'<span class="child-display"><span class="'+(a.recentlyUpdated?"icon icon-recently-updated-page":"icon icon-page")+'" title="Page">Page:</span> <a href="'+
d.CONTEXT_PATH+a.href+'">'+c.escapeHtml(a.text)+"</a></span>"},m=function(a){var c=b("#page-children:not(.children-loaded)");j();if(a&&c.length)if(a.errorMessage)c.html("<span class='error'>"+a.errorMessage+"</span>");else{var e=[];b.each(a,function(b,a){e.push(l(a))});c.html(e.join(""));c.addClass("children-loaded")}},j=function(){g&&(g(),g=null);f.addClass("hidden")},i=function(a){c.safe.ajax({url:d.CONTEXT_PATH+"/json/pagechildrenstoresettings.action",type:"POST",data:{pageId:c.params.pageId,showChildren:a},
success:function(){},error:function(a,b){c.log("Failed to store the user 'showChildren' user setting: "+b)}})};b("#children-section a.children-show-hide").each(function(){b(this).click(function(a){var h=b("#children-section");if(h.hasClass("children-showing"))b("#page-children").hide(),i(!1),h.removeClass("children-showing").addClass("children-hidden");else{b("#page-children").show();if(b("#children-section:not(.children-showing)").length){var e=b("#page-children:not(.children-loaded)");e.length?
(f=b("<div class='throbber'></div>"),e.append(f),g=k.spinner(f[0],10,"#666"),c.safe.ajax({url:d.CONTEXT_PATH+"/json/pagechildren.action",type:"POST",data:{pageId:c.params.pageId,showChildren:!0},success:m,error:function(b,a){var d=c.I18n.getText("page.children.error.load");j();e.html("<span class='error'>"+d+"</span>");c.log("Error retrieving child pages: "+a)}})):i(!0)}else i(!0);h.removeClass("children-hidden").addClass("children-showing")}a.stopPropagation();return!1})})}});
require("confluence/module-exporter").safeRequire("confluence/page-children",function(b){require("ajs").toInit(b)});