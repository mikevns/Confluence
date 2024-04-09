define("confluence/page-move-dialog-location",["jquery","ajs","confluence/legacy","confluence/meta","window"],function(a,b,i,j,k){return function(f){var e=a(this),c=a("#new-space",e),g=a("#new-space-key",e),d=a("#new-parent-page",e),l=b.DarkFeatures.isEnabled("editor.ajax.save")&&!b.DarkFeatures.isEnabled("editor.ajax.save.disable"),h=function(){c.is(":visible")&&(""===c.val()&&(c.val(j.get("space-name")),g.val(j.get("space-key"))),f.clearErrors(),l?d.val()?f.select(g.val(),c.val(),d.val(),a("#parentPageId").val()):
f.select(g.val(),c.val(),d.val(),""):f.select(g.val(),c.val(),d.val()))},m=function(){var a=c.val(),b=d.val();k.setTimeout(function(){a===c.val()&&b===d.val()&&h()},100)};d.blur(m).focus(function(){f.clearErrors();b.dropDown.current&&b.dropDown.current.hide()});c.blur(m).focus(function(){b.dropDown.current&&b.dropDown.current.hide()});c.movePageAutocomplete("/rest/quicknav/1/search?type=spacedesc&type=personalspacedesc",a(".new-space-dropdown",e),i.Templates.MovePage.noMatchingSpaces(),function(b,
f){var e=f.find("span").data("properties");g.val(e.spaceKey);c.val(a("<span></span>").html(e.name).text());d.val("");h();d.focus()});d.movePageAutocomplete(function(){return"/rest/quicknav/1/search?type=page&spaceKey="+g.val()},a(".new-parent-page-dropdown",e),i.Templates.MovePage.noMatchingPages(),function(c,b){var e=a("<span></span>").html(b.find("span").data("properties").name).text();d.val(e);l&&a("#parentPageId").val(a(b).data().properties.id);h();k.setTimeout(function(){f.moveButton.focus()},
50)})}});require("confluence/module-exporter").exportModuleAsGlobal("confluence/page-move-dialog-location","jQuery.fn.movePageLocation");