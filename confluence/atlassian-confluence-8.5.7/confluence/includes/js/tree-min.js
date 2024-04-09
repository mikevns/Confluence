define("confluence/tree",["jquery","ajs","window","document"],function(c,t,A,o){var y=function(c){c.preventDefault()},w={tree:function(F,p){function k(){b.visibleNodes=[];for(var a=c("li:visible",q),f=0,e=a.length;f<e;f++)c(a[f]).hasClass("tree-helper")||(a[f].num=b.visibleNodes.length,b.visibleNodes.push(new m(a[f])));G()}function B(a,f){for(var a=(a+"").toLowerCase(),f=(f+"").toLowerCase(),b=/(\d+|\D+)/g,d=a.match(b),b=f.match(b),g=Math.max(d.length,b.length),c=0;c<g;c++){if(c===d.length)return-1;
if(c===b.length)return 1;var j=parseInt(d[c],10),h=parseInt(b[c],10);if(j==d[c]&&h==b[c]&&j!=h)return(j-h)/Math.abs(j-h);if((j!=d[c]||h!=b[c])&&d[c]!=b[c])return d[c]<b[c]?-1:1}return 0}function r(a,b,e){var d=c(".click-zone:first",a);a.removeClass("opened closed").addClass(b);e(d)}function C(a){a.removeClass("aui-icon aui-icon-small aui-iconfont-chevron-right aui-iconfont-chevron-down")}function H(a){C(a);a.addClass("aui-icon aui-icon-small aui-iconfont-chevron-down");a.attr("aria-expanded",!0)}
function z(a){C(a);a.addClass("aui-icon aui-icon-small aui-iconfont-chevron-right");a.attr("aria-expanded",!1)}function D(a){this[0]=a[0];this.$=a;this.text=a.find("span").text();this.href=a.find("a").attr("href");this.linkClass=a.find("a").attr("class");this.nodeClass=a.attr("class");this.open=function(a){if(b.visibleNodes.length)return b.visibleNodes[this[0].num].open&&b.visibleNodes[this[0].num].open(a);t.log("tried to open empty node")};this.insertChild=function(a){a.$&&(a=a[0]);b.visibleNodes[this[0].num].append(a)};
this.reorder=function(){b.visibleNodes[this[0].num].order(B)};this.close=function(){b.visibleNodes[this[0].num].close()};this.getAttribute=function(a){return this[0][a]};this.setAttribute=function(a,b){this[0][a]=b};this.highlight=function(){this.$.addClass("highlighted")};this.unhighlight=function(){this.$.removeClass("highlighted")};this.makeDraggable=function(){this.setAttribute("undraggable",!1);this.$.removeClass("undraggable")};this.makeUndraggable=function(){this.setAttribute("undraggable",
!0);this.$.addClass("undraggable")};this.makeClickable=function(a){this.setAttribute("unclickable",!1);this.$.removeClass("unclickable");var f=this[0].getElementsByTagName("a"),a=a?c(f[0]):c(f);a.unbind("click",y);a.click(b.events.click)};this.makeUnclickable=function(a){this.setAttribute("unclickable",!0);this.$.addClass("unclickable");var f=this[0].getElementsByTagName("a"),a=a?c(f[0]):c(f);a.click(y);a.unbind("click",b.events.click)};this.setText=function(a){this.text=a;this[0].text=a;this.$.find("span").text(a)};
this.getParent=function(){if(this.$.parent(":not(.ui-tree)").length){var a=this.$.parent().parent();if(a.length)return new D(c(a[0]))}return null};this.append=function(a){var b=this.$.find("ul");if(!b.length){if(this[0].toBeLoaded){var f=this;this.open(function(){f.append(a)});return!1}this.$.append("<ul></ul>");b=this.$.find("ul")}var c=u(a);b.append(c);s.call(c);"undefined"===typeof this[0].closed&&(this.$.addClass("closed"),this[0].closed=!0,b.hide());k()};this.below=function(a){a=u(a);this.$.after(a);
s.call(a);k()};this.above=function(a){a=u(a);this.$.before(a);s.call(a);k()};this.remove=function(){this.$.remove();k()};this.reload=function(){this[0].getElementsByTagName("ul").length&&(this[0].removeChild(this[0].getElementsByTagName("ul")[0]),r(this.$,"closed",z),this[0].closed=!0,b.visibleNodes[this[0].num].open())};this.order=function(a){var b=c("ul",this.$),f=this[0];f.ordered=!0;if(b.length){var e=[];f.oldorder=[];c("li",this.$).each(function(){e.push(this);f.oldorder.push(this)});e.sort(function(b,
f){return a(c(b).find("span").html(),c(f).find("span").html())});f.order=e;for(var h=0,l=e.length;h<l;h++)b.append(e[h])}k()};this.orderUndo=function(){this[0].ordered=!1;var a=c("ul",this.$);if(this[0].oldorder&&a.length)for(var b=0,f=this[0].oldorder.length;b<f;b++)a.append(this[0].oldorder[b]);this[0].oldorder=null;k()};this.setOrdered=function(a){this[0].ordered=a;c("button.abc:first",this).css("display",a?"none":"block");c("button.rollback:first",this).css("display","none")};if(h.options.parameters&&
h.options.parameters.length)for(var f=0,e=h.options.parameters.length;f<e;f++)a[0][h.options.parameters[f]]&&(this[h.options.parameters[f]]=a[0][h.options.parameters[f]])}function E(a){return!("li"===a.tagName.toLowerCase()&&1>c("li:not(.tree-helper)",a).length)}function m(a){this.$li=c(a);this.height=this.$li.height()}function v(a){a=b.points[a];return"undefined"!==typeof a?{visibleNode:b.visibleNodes[a.num],where:a.where,top:a.top}:{visibleNode:new m(q),where:"append",top:b.dim.top}}function G(){var a=
0,f=0;b.points=[];for(var c=0,d=b.visibleNodes.length;c<d;c++){var g=b.visibleNodes[c].$li.offset(),i=Math.round(g.top);b.visibleNodes[c].top=i;b.visibleNodes[c].left=Math.round(g.left);var j,h;if(a){g=(i-a)/4;for(j=a;j<i;j++)h=j-a<g?"above":j-a<3*g?"append":"below",b.points[j]={num:f,where:h,top:a}}if(c==d-1){g=b.visibleNodes[c].height/4;for(j=i;j<i+b.visibleNodes[c].height;j++)h=j-i<g?"above":j-i<3*g?"append":"below",b.points[j]={num:c,where:h,top:i}}a=i;f=c}}function s(){var a=c(this);h.options.undraggable?
a.mousedown(y):(a.draggable(J()),a[0].undraggable=a.hasClass("undraggable"));var f=c(this.getElementsByTagName("a")[0]);h.options.unclickable?(a.addClass("unclickable"),f.click(y)):f.click(b.events.click);h.options.oninsert&&h.options.oninsert.call(new D(a),f)}function u(a){var b=o.createElement("li"),e=c(b);b.className=a.nodeClass;if(h.options.parameters&&h.options.parameters.length)for(var d=0,g=h.options.parameters.length;d<g;d++)a[h.options.parameters[d]]&&(b[h.options.parameters[d]]=a[h.options.parameters[d]]);
h.options.nodeId&&(b.id="node-"+a[h.options.nodeId]);var d=o.createElement("a"),g=o.createElement("span"),i=o.createElement("i");i.className="decorator";d.href=a.href;g.appendChild(o.createTextNode(a.text));d.appendChild(g);d.appendChild(i);d.className=a.linkClass;a=x("button","click-zone","",!0,K,a.text);e.mouseover(L).mouseout(M);b.appendChild(a);b.appendChild(d);d=o.createElement("div");d.className="button-panel";b.appendChild(d);g=x("button","abc confluence-sidebar-open-alphabetical","Sort Alphabetically",
!1,N);d.appendChild(g);g=x("button","rollback aui-icon aui-icon-small aui-iconfont-undo","Undo Sorting",!1,O);d.appendChild(g);h.options.isAdministrator&&(g=x("a","preview-node","Preview",!0,P),d.appendChild(g),g=x("a","remove-node","Delete",!0,Q),d.appendChild(g));e.hasClass("opened")?(r(e,"closed",z),b.closed=!0):e.hasClass("closed")?(r(e,"closed",z),b.toBeLoaded=!0):c(a).css("display","none");return b}var l=F,h=this,I=!1,R=arguments;if(!/^[ou]l$/i.test(l[0].tagName)){I=!0;if(!p.url)return!1;l.html("<ul></ul>");
l=c("ul",l)}var q=l[0];l.addClass("ui-tree");var b={list:l,visibleNodes:[],dim:l.offset(),points:[],win:c(A),timer:null,prev:0,events:{grab:function(){},click:function(){},drag:function(){},drop:function(){},append:function(){},insertabove:function(){},insertbelow:function(){},load:function(){},nodeover:function(){},nodeout:function(){},onready:function(){},order:function(){},orderUndo:function(){},remove:function(){},preview:function(){}}};this.options=p;this.updateVisibleNodes=k;this.expandPath=
function(a,b){b=b||function(){};if(a.length){var c=1,d,g,i=function(){if(c<a.length){for(var g in a[c])if(d=h.findNodeBy(g,a[c][g]))break;c++;d.open(i)}else b()};for(g in a[0]){d=this.findNodeBy(g,a[0][g]);break}d&&d.open(i)}else b()};this.reload=function(a){I&&l.remove();for(var b in a)this.options[b]=a[b];return new R.callee(F,this.options)};this.append=function(a){a=u(a);l.append(a);s.call(a);k()};this.unhighlight=function(){l.find("li.highlighted").each(function(){c(this).removeClass("highlighted")})};
this.findNodeBy=function(a,b){for(var e=[],d=q.getElementsByTagName("li"),g=0,i=d.length;g<i;g++)d[g][a]==b&&e.push(new D(c(d[g])));return 0===e.length?null:1===e.length?e[0]:e};for(var n in b.events)"function"===typeof p[n]&&(b.events[n]=p[n]);m.prototype.append=function(a){if(this.$li[0]==a)return!1;if(this.$li[0].toBeLoaded){var f=this;this.load(function(){f.append(a)});return!1}if("li"===this.$li[0].tagName.toLowerCase()){var e=c("ul:first",this.$li),d=a.parentNode.parentNode;c(".rollback:first",
d).css("display","none");e.length?(e.append(a),this.$li[0].ordered&&this.order(B)):(e=o.createElement("ul"),e.appendChild(a),this.$li[0].appendChild(e),r(this.$li,"opened",H),c(".click-zone:first",this.$li).css("display","inline"),c(".rollback:first",this.$li).css("display","none"));E(d)||b.visibleNodes[d.num].notaFolderAnymore();setTimeout(k,0);b.events.append.call({source:a,target:this.$li[0]})}};m.prototype.below=function(a){var f=a.parentNode.parentNode;this.$li.after(a);c(".rollback:first",f).css("display",
"none");E(f)?!c(a.parentNode).hasClass("ui-tree")&&!a.parentNode.parentNode.undraggable&&(a.parentNode.parentNode.ordered=!1,c(".abc:first",a.parentNode.parentNode).css("display","block"),c(".rollback:first",a.parentNode.parentNode).css("display","none")):b.visibleNodes[f.num].notaFolderAnymore();setTimeout(k,0);b.events.insertbelow.call({source:a,target:this.$li[0]})};m.prototype.above=function(a){var f=a.parentNode.parentNode;this.$li.before(a);c(".rollback:first",f).css("display","none");E(f)?
!c(a.parentNode).hasClass("ui-tree")&&!a.parentNode.parentNode.undraggable&&(a.parentNode.parentNode.ordered=!1,c(".abc:first",a.parentNode.parentNode).css("display","block"),c(".rollback:first",a.parentNode.parentNode).css("display","none")):b.visibleNodes[f.num].notaFolderAnymore();setTimeout(k,0);b.events.insertabove.call({source:a,target:this.$li[0]})};m.prototype.order=function(a){var b=this.$li[0];b.ordered=!0;var e=c("ul:first",this.$li);if(e.length){var d=[];b.oldorder=[];c("li",this.$li).each(function(){this.parentNode.parentNode==
b&&(d.push(this),b.oldorder.push(this))});d.sort(function(b,f){var d=c("span",b).text().replace(/^\s+|\s+$/g,""),e=c("span",f).text().replace(/^\s+|\s+$/g,"");return a(d,e)});b.order=d;for(var g=0,i=d.length;g<i;g++)e.append(d[g])}k()};m.prototype.orderUndo=function(){var a=this.$li[0];a.ordered=!1;var b=c("ul:first",this.$li);if(a.oldorder&&b.length&&b[0].parentNode==a)for(var e=0,d=a.oldorder.length;e<d;e++)b.append(a.oldorder[e]);a.oldorder=null;a.oldor=null;k()};m.prototype.open=function(a){a=
a||function(){};if(this.$li.hasClass("closed")){var b=c("ul:has(li)",this.$li);return b.length?(b.show(),this.closed=!1,r(this.$li,"opened",H),k(),a(!0),!0):this.load(a)}a(!1);return!1};m.prototype.close=function(a){var a=a||function(){},c=this.$li.contents().filter("ul:has(li)");c.length&&(c.hide(),this.closed=!0,r(this.$li,"closed",z),b.visibleNodes.splice(this.$li[0].num+1,c[0].getElementsByTagName("li").length),k(),a())};m.prototype.load=function(a){var f=h.options.url;if(!f)return!1;a=a||function(){};
this.$li[0].toBeLoaded=!1;this.$li[0].closed=!0;var e={};if(p.parameters&&p.parameters.length)for(var d=0,g=p.parameters.length;d<g;d++)e[p.parameters[d]]=this.$li[0][p.parameters[d]]||"";var i=this;this.$li[0].getElementsByTagName("span");var j=c(".button-panel",this.$li[0]);i.loading=!0;j.spin({left:"10px"});c.ajax({url:f,type:"GET",dataType:"json",data:e,success:function(f){var d=c("ul",i.$li);d.length||(d=o.createElement("ul"),i.$li[0].appendChild(d),d=c(d));i.ordered="number"!==typeof f[0].position;
for(var e=0,g=f.length;e<g;e++){var h=u(f[e]);d[0].appendChild(h);s.call(h)}d.hide();i.open(a);b.events.load();j.spinStop();i.$li[0].ordered=i.ordered;c(".abc:first",i.$li[0]).css("display",i.ordered||h.undraggable?"none":"block");c(".rollback:first",i.$li[0]).css("display","none")}});return!0};m.prototype.notaFolderAnymore=function(){r(this.$li,"",C);c(".click-zone:first",this.$li).hide();c(".abc:first",this.$li).css("display","none");c(".rollback:first",this.$li).css("display","none");var a=this.$li[0].getElementsByTagName("ul");
this.closed=!1;a.length&&this.$li[0].removeChild(a[0])};var J=function(){var a={distance:3,helper:"clone",opacity:0.7,cursorAt:{top:b.H/2,left:30},stop:function(c){clearInterval(b.timer);clearTimeout(b.opentimer);b.opentimer=null;var e=v(b.prev);e.visibleNode.$li.removeClass("over").removeClass("above").removeClass("append").removeClass("below");e.visibleNode.$li.next().removeClass("over").removeClass("above").removeClass("append").removeClass("below");b.win.unbind("keypress",b.escape);delete b.escape;
for(var e=v(c.pageY||c.originalEvent.pageY),c=e.visibleNode.$li[0],d=!0;c!=q;){if(c==this){d=!1;break}c=c.parentNode}if((d=d&&!("above"==e.where&&e.visibleNode.$li.prev()[0]==this)&&!("append"==e.where&&e.visibleNode.$li[0]==this.parentNode.parentNode))&&!0!==a.revert)e.visibleNode[e.where](this),b.events.drop.call({position:e.where,source:this,target:e.visibleNode.$li[0]})},start:function(f,e){var d=this;e.helper.append("<strong></strong>").addClass("tree-helper").find(".button-panel").remove();
b.events.grab.call(d);this.undraggable&&(e.helper.addClass("no"),a.revert=!0);b.escape=function(f){if(f.keyCode===27){f=v(b.prev);f.visibleNode.$li.removeClass("over").removeClass("above").removeClass("append").removeClass("below");f.visibleNode.$li.next().removeClass("over").removeClass("above").removeClass("append").removeClass("below");var i=e.helper.clone();e.helper.before(i);i.animate({left:Math.round(c(d).offset().left)+"px",top:Math.round(c(d).offset().top)+"px",opacity:0},"slow","swing",function(){i.remove()});
e.helper.css("display","none");a.revert=true}};b.win.keypress(b.escape)},drag:function(c,e){c.pageY=c.pageY||c.originalEvent.pageY;c.pageX=c.pageX||c.originalEvent.pageX;var d=v(b.prev);d.visibleNode.$li.removeClass("above").removeClass("append").removeClass("below");d.visibleNode.$li.next().removeClass("above").removeClass("append").removeClass("below");if(!a.revert||b.out){b.prev=c.pageY;var g=v(b.prev);if(g.visibleNode.$li[0]==q)a.revert=!0,b.out=!0;else{b.out&&(b.out=!1,a.revert=!1);g.visibleNode!=
d.visibleNode&&(b.events.nodeout.call(d.visibleNode.$li),b.opentimer&&(clearTimeout(b.opentimer),b.opentimer=!1));b.events.nodeover.call({element:g.visibleNode.$li,position:g.where});var d=g.where,i=g.visibleNode.$li.next();"below"==d&&i.length&&!i.hasClass("tree-helper")?i.addClass("above"):v(b.prev).visibleNode.$li.addClass(d);if("append"==g.where&&(g.visibleNode.closed||g.visibleNode.$li[0].toBeLoaded)&&!b.opentimer)d=b,i=setTimeout(function(){g.visibleNode.$li.removeClass("append");g.visibleNode.open(function(){b.opentimer=
false})},500),d.opentimer=i;var h=arguments.callee;30>b.win.height()-c.pageY+b.win.scrollTop()?(clearInterval(b.timer),b.timer=setInterval(function(){A.scrollBy(0,4);e.helper.css("top",parseInt(e.helper.css("top"))+4+"px");h({pageY:c.pageY+4},e)},b.win.height()-c.pageY+b.win.scrollTop())):0<b.win.scrollTop()&&30>c.pageY-b.win.scrollTop()?(clearInterval(b.timer),b.timer=setInterval(function(){A.scrollBy(0,-4);h({pageY:c.pageY-4},e);e.helper.css("top",parseInt(e.helper.css("top"))-4+"px")},c.pageY-
b.win.scrollTop())):b.timer&&clearInterval(b.timer);b.events.drag.call({element:this,left:c.pageX,top:c.pageY})}}}};return a};w.tree.callNumber=0;var K=function(){if(!b.visibleNodes[this.parentNode.num].loading)return c(this.parentNode).hasClass("closed")?b.visibleNodes[this.parentNode.num].open():b.visibleNodes[this.parentNode.num].close(),!1},L=function(a){c(a.target).hasClass("tree-helper")||c(".button-panel:first",this).addClass("hover");return!1},M=function(a){c(a.target).hasClass("tree-helper")||
c(".button-panel:first",this).removeClass("hover");return!1},N=function(){var a=b.visibleNodes[this.parentNode.parentNode.num];a.order(B);b.events.order.call({source:a.$li[0]});c(this).hide();c("button.rollback",this.parentNode).show();return!1},O=function(){var a=b.visibleNodes[this.parentNode.parentNode.num];a.orderUndo();b.events.orderUndo.call({source:a.$li[0],orderedChildren:c("ul:first",a.$li[0]).children()});c(this).hide();c("button.abc",this.parentNode).show();return!1},P=function(a){a.preventDefault();
b.events.preview.call({source:preview,node:b.visibleNodes[this.parentNode.parentNode.num].$li[0]})},Q=function(a){a.preventDefault();b.events.remove.call({source:b.visibleNodes[this.parentNode.parentNode.num].$li[0]})},x=function(a,b,e,d,g,h){var a=o.createElement(a),j=c(a);j.addClass(b);j.attr("title",e);h&&j.attr("aria-label",h);j.click(g);d||j.css("display","none");return a};n=l.contents().filter("li");if(0<n.length)b.H=n.height(),n.each(s),k(),b.events.onready.call(this);else{n=h.options.initUrl||
h.options.url;if(!n)return!1;c(l).spin({left:"0%"});var S=++w.tree.callNumber;c.getJSON(n,function(a){for(var f=0,e=a.length;f<e;f++){var d=u(a[f]);q.appendChild(d);0===f&&(b.H=c(d).height());s.call(d)}k();c(l).spinStop();S==w.tree.callNumber&&(b.events.onready.call(this),w.tree.callNumber=0)})}b.offset=q.offsetTop;setInterval(function(){q.offsetTop!==b.offset&&(G(),b.offset=q.offsetTop)},10);return this}};return{jqueryPlugin:{tree:function(c){if(!this.is(".ui-tree"))return new w.tree(this,c)}},ui:w}});
require("confluence/module-exporter").safeRequire("confluence/tree",function(c){var t=require("jquery");t.ui=t.ui||{};t.fn.extend(c.jqueryPlugin);t.ui.tree=c.ui.tree});