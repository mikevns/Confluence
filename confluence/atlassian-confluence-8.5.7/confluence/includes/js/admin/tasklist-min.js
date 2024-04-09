define("confluence/tasklist",["jquery","ajs","confluence/meta","confluence/api/constants"],function(a,b,f,g){return function(){a(".tasklist a.view-completed-tasks").click(function(b){a(".tasks.completed").toggle();b.preventDefault()});a(".tasklist ul.tasks.completed").hide();a(".tasklist").on("click",".task-checkbox",function(c){c.preventDefault();var c=a(this).data("task-key"),d=a(this).hasClass("dismissed"),h=g.CONTEXT_PATH+(d?"/admin/unignoretask.action":"/admin/ignoretask.action"),e=!d;c&&(a(this).toggleClass("dismissed"),
a.ajax({url:h,data:{key:c,atl_token:f.get("atl-token")}}).done(function(c){c.ignored^e&&(a(this).toggleClass("dismissed"),b.messages.error({title:b.I18n.getText("admintask.error.title"),body:e?b.I18n.getText("admintask.error.not.dismissed"):b.I18n.getText("admintask.error.not.reinstated")}))}).fail(function(){a(this).toggleClass("dismissed");b.messages.error({title:b.I18n.getText("admintask.error.title"),body:b.I18n.getText("admintask.error.unknown")})}))})}});
require("confluence/module-exporter").safeRequire("confluence/tasklist",function(a){require("ajs").toInit(a)});