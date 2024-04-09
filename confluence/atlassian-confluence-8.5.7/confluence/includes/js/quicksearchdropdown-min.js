define("confluence/quicksearchdropdown",["jquery","ajs","window","document","confluence/input-driven-dropdown"],function(f,l,m,n,q){return function(c,o,a){o&&(a.onShow=o);a.makeParams=a.makeParams||function(b){return{query:b}};var p=function(b){if(b.statusMessage)b=[[{html:b.statusMessage,className:"error"}]];else if(a.makeRestMatrixFromData){b=a.makeRestMatrixFromData(b);b=l.REST.convertFromRest(b);a.addDropdownData&&(b=a.addDropdownData(b))}else b=b.contentNameMatches;return b},i,j;"function"===
typeof c?(j=c(),i=function(b){var a=c();if(a!=j){j=a;b.clearCache()}return a}):i=function(){return c};a.getDataAndRunCallback=a.getDataAndRunCallback||function(b,k){var g=this,h=i(g,b);if(a.includeUrlPrefix==void 0||a.includeUrlPrefix)h=(l.Meta.get("context-path")||"")+h;var c=f.data(g,"lastRequest");c&&c.abort();c=f.ajax({type:"GET",dataType:"json",url:h,xhrFields:{withCredentials:true},data:a.makeParams(b),success:function(a,c){f(m).trigger("quicksearch.ajax-success",{url:h,json:a,resultStatus:c});
if(n.activeElement==d[0]){var e=p(a);a.results&&a.results.length>0?k.call(g,e,b,a.queryTokens):k.call(g,e)}},global:false,timeout:5E3,error:function(a,c,e){f(m).trigger("quicksearch.ajax-error",{url:h,xmlHttpRequest:a,resultStatus:c,errorThrown:e});if(n.activeElement==d[0]&&c=="timeout"){a=p({statusMessage:"Timeout",query:b});k.call(g,a,null)}},complete:function(){f.removeData(g,"lastRequest");d.trigger("quick-search-loading-stop")}});f.data(g,"lastRequest",c);d.trigger("quick-search-loading-start")};
var e=new q("inputdriven-dropdown",a),d=f(this);d.keyup(function(a){a.which===13||a.which===9||!d.hasClass("placeholded")&&e.change(this.value,false,function(a){d.attr("data-last-search",a)})});d.quickSearchControl=e;d.bind("clearCache.autocomplete",function(){e.clearCache()});d.bind("hide.autocomplete",function(){e.hide()});return d}});require("confluence/module-exporter").exportModuleAsGlobal("confluence/quicksearchdropdown","AJS.$.fn.quicksearch");