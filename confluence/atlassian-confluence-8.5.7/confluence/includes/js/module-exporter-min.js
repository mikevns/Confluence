define("confluence/module-exporter",[],function(){var g={namespace:function(b,c,a){var f=b.split("."),a=a||window,g=f.length-1,d,e;for(d=0;d<g;d++)e=a[f[d]],null!=e?a=e:(a[f[d]]={},a=a[f[d]]);e=a[f[d]];if("undefined"===typeof e)b=c;else if("undefined"===typeof c)b=e;else if("object"!==typeof e||"object"!==typeof c)window.console&&window.console.warn&&window.console.warn('Value of "'+b+'" ('+typeof e+" was overridden to be "+typeof c),b=c;else{window.console&&window.console.warn&&window.console.warn('Properties of "'+
b+'" were overwritten');var b=e,h;if(null==b)throw new TypeError("Cannot convert undefined or null to object");h=Object(b);null!=c&&Object.keys(c).forEach(function(a){h[a]=c[a]});b=h}a[f[d]]=b||{};return a[f[d]]},safeRequire:function(b,c){var a;define&&void 0===define.amd&&(a=require(b),c&&c(a))},exportModuleAsGlobal:function(b,c,a){g.safeRequire(b,function(b){g.namespace(c,b);a&&a(b)})}};return g});