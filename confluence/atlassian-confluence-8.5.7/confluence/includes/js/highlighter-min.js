define("confluence/highlighter",["ajs","underscore"],function(g,j){return function(b,k){var d,e;if(b&&b.length&&b[0]){for(var h=[],f=0,l=b.length;f<l;f++){var i=b[f];i&&h.push(i.replace(/[.*+?|()[\]{}\\]/g,"\\$"))}d=RegExp("("+h.join("|")+")","gi");e=g.template(k||"<strong>{highlight}</strong>").fill({highlight:"$1"}).toString()}return{highlight:function(a,c){if(!a)return a;c||(a=g.escapeHtml(a));return!d?a:a.replace(d,e)},safeHighlight:function(a){if(!a)return a;if(d&&e)var c=e.split("$1"),b=c[0],
c=c[1],a=a.replace(d,"@@@hl@@@$1@@@endhl@@@");return j.escape(a).replace(/@@@hl@@@/gi,b).replace(/@@@endhl@@@/gi,c)}}}});require("confluence/module-exporter").exportModuleAsGlobal("confluence/highlighter","Confluence.Highlighter");