define("confluence/dialog",["ajs","document","jquery"],function(a,k,h){return{component:function(b){var e,b=b||{},b=h.extend({},{keypressListener:function(c){if(27===c.keyCode){if(a.debug("dialog.js: escape keydown caught"),!h(".aui-dropdown",e.popup.element).is(":visible"))if("function"===typeof b.onCancel)b.onCancel();else e.hide()}else 13===c.keyCode&&(a.debug("dialog.js: enter keydown caught"),h(".aui-dropdown",e.popup.element).is(":visible")||"textarea"!==(c.target.nodeName&&c.target.nodeName.toLowerCase())&&
"function"===typeof b.onSubmit&&setTimeout(b.onSubmit))},width:865,height:530},b);e=new a.Dialog(b);h(k).bind("hideLayer",function(c,a,d){if("popup"===a&&d===e&&"function"===typeof b.onCancel)b.onCancel()});return e},initialiser:function(b){a.bind("show.dialog",function(e,c){var f=a.Meta.get("page-id"),d=a.Meta.get("space-key"),i=a.Meta.get("editor-mode"),h=a.Meta.get("new-page");a.EventQueue=a.EventQueue||[];a.EventQueue.push({name:c.dialog.id,properties:function(){var b={};f&&(b.pageid=f);d&&(b.spacekey=
d);i&&(b.editormode=i);h&&(b.newpage=h);return b}()});c.dialog.popup.element.find(".dialog-title").attr("id","dialog-title");c.dialog.popup.element.attr("aria-labeledby","dialog-title");c.dialog.popup.element.attr("role","dialog");c.dialog.popup.element.attr("aria-modal",!0);c.dialog.popup.element.attr("aria-hidden",!1);c.dialog.popup.element.find(".dialog-components").attr("tabindex","0");var g=c.dialog.popup.element;g.find("input[type=hidden]").attr("tabindex","-1");g.find(".hidden").attr("tabindex",
"-1");var j=b().add(g.find('button, input:not([type="hidden"]):visible, select:visible, textarea')).add(g.find('[href]:not([tabindex="-1"])')).add(g.find('[role="button"]')).add(g.find('[tabindex]:not([tabindex="-1"])'));g.focus().keydown(function(c){if("Tab"===c.key){var a=b(c.target);if(c.shiftKey){if(a.is(g)||a.is(j.first()))c.preventDefault(),j.last().focus()}else a.is(j.last())&&(c.preventDefault(),j.first().focus())}})});b(k).bind("showLayer",function(a,c,f){Confluence.runBinderComponents();
if("popup"==c&&f){var a=b(f.element),d;if(!a.attr("data-lasttab-override")){a.attr("data-tab-default")&&(d=a.attr("data-tab-default"));var i=Confluence.storageManager(a.attr("id")),c=i.getItem("last-tab");(d=null!=c?c:d)&&b(".page-menu-item:visible:eq("+d+") button",a).click();a.attr("data-lasttab-bound")||(b(".page-menu-item",a).each(function(a,c){b(c).click(function(){i.setItem("last-tab",a)})}),a.attr("data-lasttab-bound","true"))}}});a.Dialog.prototype.overrideLastTab=function(){b(this.popup.element).attr("data-lasttab-override",
"true")};a.Dialog.prototype.addHelpText=function(e,c){if(e){var f=e;c&&(f=a.template(e).fill(c).toString());var d=this.page[this.curpage];d.buttonpanel||d.addButtonPanel();f=b("<div class='dialog-tip'></div>").html(f);d.buttonpanel.append(f);b("a",f).click(function(){var a=window.open(this.href,"_blank");a.focus();a.opener=null;return!1})}};a.Dialog.prototype.getTitle=function(){return b("#"+this.id+" .dialog-components:visible h2").text()};a.Dialog.prototype.isVisible=function(){return b("#"+this.id).is(":visible")}}}});
require("confluence/module-exporter").safeRequire("confluence/dialog",function(a){AJS.ConfluenceDialog=a.component;AJS.toInit(a.initialiser)});