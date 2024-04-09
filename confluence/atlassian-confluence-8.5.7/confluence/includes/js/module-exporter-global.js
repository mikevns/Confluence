require(['confluence/module-exporter'], function(ModuleExporter) {
    'use strict';

    // Export namespace function in legacy AJS.namespace global
    function namespace(variableNamespace, context, module) {
        ModuleExporter.namespace(variableNamespace, module, context);
    }
    ModuleExporter.namespace('AJS.namespace', namespace);
});
