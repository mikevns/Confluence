define("confluence/aui-draft","jquery ajs confluence/meta window document confluence/api/regexes confluence/aui-overrides".split(" "),function(c,b,g,j,n,k,h){var d={},l;c.ajaxSetup({traditional:true});d.defaultIfUndefined=function(a,b){var e=null,c=j;if(typeof b!=="undefined"){if(typeof b.defaultValue==="object")e=b.defaultValue;if(typeof b.rootObject!=="undefined")if(typeof b.rootObject==="object"&&b.rootObject)c=b.rootObject;else return e}if(typeof a!=="string")return e;for(var d=a.split("."),f=
0;f<d.length;f++){if(!Object.prototype.hasOwnProperty.call(c,d[f]))return e;c=c[d[f]]}return c};var f,m=false;f=function(a){var b=!!j.localStorage;if(typeof a!=="boolean")return b?localStorage.getItem("debug-switch-enabled")=="true":m;b?localStorage.setItem("debug-switch-enabled",a):m=a};d.debug=function(){if(f()){var a=Array.prototype.slice.call(arguments);a.splice(0,0,"DEBUG: "+(new Date).toLocaleTimeString());b.log.apply(b,a)}};d.debugEnabled=function(a){if(typeof a!=="boolean")return f();f(a);
b.log("STICKY FLAG DEBUG ENABLED: "+a)};d.logError=function(a,d){var e=[],f;if(c.browser.webkit)e.push(d);else for(f in d)e.push(f+": "+d[f]);b.log(a+e.join(", "))};if(g.getBoolean("log-rendered")){var o=b.log,i=c('<div id="ajs-log" class="log"><h3>AJS Log</h3>\n</div>'),p=c("head");i.toggleClass("hidden",!g.getBoolean("log-visible"));l=function(a){var d=typeof a==="undefined"?"undefined":a,e=n.createElement("script");e.type="text/x-log";e.text=d;p.append(e);i.append(c("<p></p>").text("\n"+d));o.apply(b,
arguments)};b.log=l;b.toInit(function(){c("body").append(i)})}d.getJSONWrap=function(a){var d=b.contextPath(),e=a.url;e.indexOf(d)!==0&&e.indexOf("http")!==0&&(e=d+e);a.loadingElement&&h.setVisible(a.loadingElement,true);var f=a.messageHandler;f.clearMessages();c.ajax({type:"GET",url:e,dataType:"json",data:a.data,error:function(){a.loadingElement&&h.setVisible(a.loadingElement,false);f.displayMessages(a.errorMessage||b.I18n.getText("unknown.server.error"));a.errorCallback&&a.errorCallback()},success:function(b){a.loadingElement&&
h.setVisible(a.loadingElement,false);f.handleResponseErrors(b)?a.errorCallback&&a.errorCallback():a.successCallback&&a.successCallback(b)}})};d.Validate=c.extend({email:function(a){return k.EMAIL.test(a)},url:function(a){return k.URL.test(a)}},b.Validate);d.Meta=b.Data||g;return d});
require("confluence/module-exporter").safeRequire("confluence/aui-draft",function(c){var b=require("ajs");"function"!==typeof b.defaultIfUndefined&&(b.defaultIfUndefined=c.defaultIfUndefined);b.debug=c.debug;b.debugEnabled=c.debugEnabled;b.logError=c.logError;b.getJSONWrap=c.getJSONWrap;b.Validate=c.Validate;b.Data=c.Meta});