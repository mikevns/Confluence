define("confluence/backupadmin",["jquery"],function(a){return function(){var b=a("#backupPath");a("#backupOption\\.default").click(function(){b.val(a("#defaultPath").val());b.prop("disabled",!0)});a("#backupOption\\.custom").click(function(){b.prop("disabled",!1)})}});require("confluence/module-exporter").safeRequire("confluence/backupadmin",function(a){require("ajs").toInit(a)});