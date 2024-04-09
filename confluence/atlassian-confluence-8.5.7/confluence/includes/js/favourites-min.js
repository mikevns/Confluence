define("confluence/favourites",["jquery","ajs","confluence/message-controller"],function(a,b,h){var l=[],k=function(c,g){c.attr("data-favourites-bound")||(c.delegate(".aui-iconfont-new-star, .aui-iconfont-star-filled","click",function(e){var f=a(e.target),e=c.attr("data-entity-type"),i=c.attr("data-entity-scope"),d;d=g&&g.getEntityId&&"function"===typeof g.getEntityId?g.getEntityId(f):c.attr("data-entity-id");if(l[d])b.log("Already busy toggling favourite for "+e+" '"+d+"'. Ignoring request.");else{if(i){var k=
f.hasClass("aui-iconfont-star-filled")?"unfavourite":"favourite",i=["confluence",i,e,k,"click"].join(".");b.trigger("analytics",{name:i,data:{id:d}})}l[d]=!0;var j=f.hasClass("aui-iconfont-star-filled"),o=f.parent().find(".icon-wait"),m,n;"page"===e?(m=b.contextPath()+"/json/"+(j?"removefavourite.action":"addfavourite.action"),n={entityId:d}):"space"===e?(m=b.contextPath()+"/json/"+(j?"removespacefromfavourites.action":"addspacetofavourites.action"),n={key:d}):console.error("Unsupported type: "+e);
f.addClass("hidden");o.removeClass("hidden");b.safe.ajax({url:m,type:"POST",data:n}).done(function(a){b.debug(a);f.parent().find(j?".aui-iconfont-new-star":".aui-iconfont-star-filled").removeClass("hidden");b.trigger(j?"remove-fav-complete":"add-fav-complete")}).fail(function(a,c){h.showError(h.parseError(a),h.Location.FLAG);b.debug("Error Toggling Favourite: "+c);f.removeClass("hidden")}).always(function(){o.addClass("hidden");delete l[d]});return!1}}),c.attr("data-favourites-bound",!0))};return{binder:function(){a(".entity-favourites").each(function(){a(this).attr("data-favourites-bound")||
k(a(this),{})})},plugin:function(b){a(this).each(function(){var g=a(this);k(g,b)})}}});require("confluence/module-exporter").safeRequire("confluence/favourites",function(a){var b=require("ajs"),h=require("jquery");b.Confluence.Binder.favourites=a.binder;h.fn.favourites=a.plugin});