define("confluence/menu","ajs jquery document window confluence/api/ajax confluence/flag".split(" "),function(d,a,e,j,q,r){var i={},l=function(c){a(c).closest(".ajs-menu-bar").find(".ajs-drop-down").each(function(){this.hide()})},m=function(c){return a(c).closest(".ajs-menu-bar").hasClass("menu-bar-open")},n=function(c){a(c).closest(".ajs-menu-bar").addClass("menu-bar-open")},o=function(c){a(c).closest(".ajs-menu-bar").removeClass("menu-bar-open")};i.ajsMenu=function(c){c=c||{};a(".ajs-button",this).each(function(){a(this).mouseover(function(){var c=
this,d=m(c);l(c);if(d){var b=a(e),f=function(){o(c);return false};b.unbind("click.menu");setTimeout(function(){b.one("click.menu",f)},1);n(c)}})});a(".ajs-menu-item",this).each(function(){a(this).ajsMenuItem(c)})};i.ajsMenuItem=function(c){var c=c||{},d=this,h=a(this),b=a(".ajs-drop-down",d);if(b.length){b=b[0];b.hidden=true;b.focused=-1;b.hide=function(){if(!this.hidden){h.toggleClass("opened");a(d.parentNode).find(".opened").length===0&&o(d);var g=a("a",this);a(this).toggleClass("assistive");this.hidden=
true;a(e).unbind("click",this.fhide).unbind("keydown",this.fmovefocus).unbind("keypress",this.blocker);this.focused+1&&a(g[this.focused]).removeClass("active");this.focused=-1}};b.show=function(){if(typeof this.hidden==="undefined"||this.hidden){var g=this,b=a(this);b.toggleClass("assistive");h.toggleClass("opened");n(d);this.hidden=false;this.timer=setTimeout(function(){a(e).click(g.fhide)},1);a(e).keydown(g.fmovefocus).keypress(g.blocker);var f=a("a",g);f.each(function(b){var g=this.parentNode.parentNode;
a(this).hover(function(){g.focused+1&&a(f[g.focused].parentNode).removeClass("active");a(this.parentNode).addClass("active");g.focused=b},function(){g.focused+1&&a(f[g.focused].parentNode).removeClass("active");g.focused=-1})});var p=j.pageYOffset||e.documentElement.scrollTop,k=p+a(j).height();b.removeClass("above");if(!c.isFixedPosition&&b.offset().top+b.height()>k){b.addClass("above");b.offset().top<p&&b.removeClass("above")}}};b.isMenuBarOpened=function(){return m(b)};b.closeOthers=function(){l(b)};
b.fmovefocus=function(a){b.movefocus(a)};b.fhide=function(g){b.hide(g);return a(g.target).closest(".ajs-drop-down").length>0};b.blocker=function(a){a=a.which;if(a===40||a===38)return false};b.movefocus=function(b){var d=b.which,c=this.getElementsByTagName("a"),f=this.focused,k=d===9,h;do{switch(d){case 40:case 9:b.shiftKey?this.focused--:this.focused++;break;case 38:this.focused--;break;case 27:this.hide();return false;default:return true}h=this.focused<0||this.focused>c.length-1}while(!h&&a(c[this.focused].parentNode).hasClass("assistive"));
if(k&&h){f!==-1&&a(c[f].parentNode).removeClass("active");this.focused=-1;this.hide();return false}if(!k)if(this.focused<0)this.focused=c.length-1;else if(this.focused>c.length-1)this.focused=0;f>=0&&a(c[f].parentNode).removeClass("active");c[this.focused].focus();a(c[this.focused].parentNode).addClass("active");b.stopPropagation();b.preventDefault();return false};var f=a(".trigger",d);if(f.length){h.mouseover(function(){if(b.isMenuBarOpened()){if(b.hidden){l(b);b.show()}}else h.addClass("hover")});
h.mouseout(function(){b.isMenuBarOpened()||h.removeClass("hover")});f.click(function(){if(b.hidden){f.parent("li").removeClass("hover");var c=a(".ajs-menu-bar.menu-bar-open").length>0;b.show();f.attr("aria-expanded",true);return c}b.hide();f.parent("li").addClass("hover");f.attr("aria-expanded",false);return false})}}};i.initialiser=function(){a("#view-user-history-link").click(function(a){j.open(this.href,(this.id+"-popupwindow").replace(/-/g,"_"),"width=600, height=400, scrollbars, resizable").opener=
null;a.preventDefault();return false});var c={close:"manual",type:"error",extraClasses:"confluence-menu-flag",fifo:true,stack:"menu"},e,h=function(b){e&&e.close();e=new r(a.extend({},c,{body:b}))};a("#page-favourite").click(function(b){var c=a(this),e=c.find(".aui-icon");if(c.hasClass("waiting")){b.stopPropagation();return false}c.addClass("waiting");var i=d.contextPath()+"/rest/experimental/relation/user/current/favourite/toContent/"+d.params.pageId,j=c.hasClass("selected")?"DELETE":"PUT";q.ajax({url:i,
type:j,contentType:"application/json",data:{},success:function(){var a=c.hasClass("selected");c.toggleClass("selected ie-page-favourite-selected",!a);var b=!a?d.I18n.getText("pagemenu.unfavourite.tooltip"):d.I18n.getText("pagemenu.favourite.tooltip"),b=b+(" ("+d.I18n.getText("pagemenu.favourite.accesskey")+")"),f=!a?d.I18n.getText("pagemenu.unfavourite","<u>","</u>"):d.I18n.getText("pagemenu.favourite","<u>","</u>");c.children("span").empty().append(e).append(" ").append(f);c.attr("title",b);e.toggleClass("aui-iconfont-unstar",
a);e.toggleClass("aui-iconfont-star",!a);c.removeClass("waiting");c.blur();d.trigger("analytics",{name:"confluence.page.page-menu."+(a?"favourite":"unfavourite")})},error:function(a){switch(a.status){case 403:h(d.I18n.getText("operation.forbidden.message"));break;case 405:JSON.parse(a.responseText).reason==="READ_ONLY"?h(d.I18n.getText("read.only.mode.default.error.short.message")):h(d.I18n.getText("server.error.message"));break;default:h(d.I18n.getText("server.error.message"))}c.removeClass("waiting");
c.blur()}});b.stopPropagation();return false});var b=a("#action-menu-link");b.length&&b.next().addClass("most-right-menu-item");a("#action-menu").on({"aui-dropdown2-show":function(){a(this).css({right:function(){return a(j).width()-b.offset().left-b.outerWidth(true)-1},left:"auto"})}});a(".ajs-menu-bar").ajsMenu({isFixedPosition:true})};i.ieHack=function(){a("#header-menu-bar .ajs-menu-item").each(function(){var c=a(this),e=a(".ajs-drop-down",this),c=c.width();if(c>e.width()){e.width(c.valueOf()+
50);d.log("Dropdown width override occurred")}});a("#user-menu-link-content .user-item").on("click",function(){d.trigger("analyticsEvent",{name:"user-menu-item.clicked",data:{id:a(this).attr("id")}})});a("#user-menu-link-content").on({"aui-dropdown2-show":function(){d.trigger("analyticsEvent",{name:"confluence.user-menu.show"})},"aui-dropdown2-hide":function(){d.trigger("analyticsEvent",{name:"confluence.user-menu.hide"})}})};return i});
require("confluence/module-exporter").safeRequire("confluence/menu",function(d){var a=require("jquery"),e=require("ajs");a.fn.ajsMenu=d.ajsMenu;a.fn.ajsMenuItem=d.ajsMenuItem;e.toInit(d.initialiser);e.toInit(d.ieHack)});