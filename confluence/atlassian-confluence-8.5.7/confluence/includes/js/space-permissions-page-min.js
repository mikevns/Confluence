define("confluence/space-permissions-page",["jquery","confluence/space-permissions-form"],function(d,f){var a={updateField:function(b,c){if(""!==c){var a=d("#"+b),e=a.val();a.val(""===e?c:e+", "+c)}},updateGroupsField:function(b){a.updateField("groups-to-add-autocomplete",b)},updateUsersField:function(b){a.updateField("users-to-add-autocomplete",b)},initialize:function(){d('form[name="editspacepermissions"],form[name="editdefaultspacepermissions"]').each(function(a,c){new f({el:c})})}};return a});
require("confluence/module-exporter").exportModuleAsGlobal("confluence/space-permissions-page","Confluence.SpacePermissions",function(d){require("ajs").toInit(d.initialize)});