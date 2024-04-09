define("confluence/entity-picker",["window","document","jquery"],function(d,g,h){var b={name:"Entity Picker",rows:{length:0,last:null,add:function(a){this[this.length++]=a},changeTo:function(a,c){for(var b="undefined"===typeof c?0:null==this.lastrow?0:this.lastrow,e="undefined"===typeof c?this.length:c+1,f=Math.min(b,e),b=Math.max(b,e);f<b;f++)this[f].parentNode.parentNode.checked=this[f].checked=a},update:function(){for(var a=!0,c=0,d=this.length;c<d;c++)a=a&&this[c].checked;b.topcheckbox.checked=
a},toString:function(){for(var a=[],b=0,d=this.length;b<d;b++)this[b].checked&&a.push(this[b].value.replace(/([\\,])/g,"\\$1"));return a.join(", ")}}};return function(){var a=g.getElementById("entitySearchResults");if(a)try{b.topcheckbox=a.getElementsByTagName("thead")[0].getElementsByTagName("input")[0];if(!b.topcheckbox)throw"Top checkbox does not exist";b.topcheckbox.onclick=function(){b.rows.changeTo(this.checked)};b.button=g.getElementById("select-entities");if(!b.button)throw"Select button does not exist";
b.button.onclick=function(){var a=d.opener,c=h(this).attr("data-callback");"undefined"===typeof c&&(c=this.className);for(c=c.split(".");c.length;)a=a[c.shift()];a(b.rows.toString());d.close()};for(var c=a.getElementsByTagName("tbody")[0].getElementsByTagName("tr"),a=0,i=c.length;a<i;a++){var e=c[a].getElementsByTagName("input")[0];"checkbox"===e.type&&(c[a].checked=e.checked,b.rows.add(e));c[a].number=a;c[a].onclick=function(a){(a||d.event).shiftKey?b.rows.changeTo(!this.checked,this.number):b.rows[this.number].checked=
this.checked=!this.checked;if(this.checked)b.rows.last=this.number;b.rows.update()}}}catch(f){"undefined"!==typeof console&&console.log(f)}}});require("confluence/module-exporter").safeRequire("confluence/entity-picker",function(d){window.addEventListener("load",d,!1)});