/* eslint-disable no-implicit-globals */
/* eslint @atlassian/confluence-server/must-use-amd:0, no-undef:0 */
function ConsoleInstrumenter(configObject) {
    'use strict';

    this.config = configObject;
    this.originalInfo = console.info;
    this.originalLog = console.log;
    this.originalWarn = console.warn;
    this.originalError = console.error;
}

ConsoleInstrumenter.prototype.instrument = function(context) {
    'use strict';

    var self = this;

    // Not supporting ES6 string template
    var converter = function(args) {
        var formatRegExp = /%[scdifo]/g;
        var i = 1;
        var l = args.length;
        return (typeof args[0] === 'string' && l > 1) ? args[0].replace(formatRegExp, function(x) {
            switch (x) {
            case '%s':
                return args[i++];
            case '%d':
            case '%i':
                return (typeof args[i++] !== 'number') ? 'NaN' : Math.floor(args[i - 1]);
            case '%f':
                return args[i++].toString();
            case '%c':
                return args[i++].replace(/.*/, '');
            case '%o':
                return JSON.stringify(args[i++]);
            }
        }).concat((i < l ? ' ' : '') + Array.prototype.slice.call(args, i).join(' ')) : Array.prototype.slice.call(args).join(' ');
    };

    var classifier = function(message) {
        var subtype = 'others';

        if (/deprecated/i.test(message)) {
            subtype = 'deprecated';
        } else if (/overridden/i.test(message)) {
            subtype = 'overridden';
        } else if (/editor/i.test(message)) {
            subtype = 'editor';
        } else if (/initplugin/i.test(message)) {
            subtype = 'initplugin';
        }

        return subtype;
    };

    console.info = function() {
        var message = converter(arguments);
        var subtype = classifier(message);
        context.log({ type: 'info', subtype: subtype, message: message }, 'consoleRecord');
        self.originalInfo.apply(console, arguments);
    };

    console.log = function() {
        var message = converter(arguments);
        var subtype = classifier(message);
        context.log({ type: 'log', subtype: subtype, message: message }, 'consoleRecord');
        self.originalLog.apply(console, arguments);
    };

    console.warn = function() {
        var message = converter(arguments).replace(/\(http.*\)/i, '');
        var subtype = classifier(message);
        context.log({ type: 'warn', subtype: subtype, message: message }, 'consoleRecord');
        self.originalWarn.apply(console, arguments);
    };

    console.error = function() {
        var message = converter(arguments);
        var subtype = classifier(message);
        context.log({ type: 'error', subtype: subtype, message: message }, 'consoleRecord');
        self.originalError.apply(console, arguments);
    };

    window.onerror = function(errorMsg, url, line, column) {
        var filename = url.replace(/^.*[\\/]/, '');
        var errorLog = errorMsg + '. File: ' + filename + '. Line: ' + line + '. Column: ' + column;
        context.log({ type: 'error', subtype: 'throwable', message: errorLog }, 'consoleRecord');
    };
};

ConsoleInstrumenter.prototype.restore = function() {
    'use strict';

    console.info = this.originalInfo;
    console.log = this.originalLog;
    console.warn = this.originalWarn;
    console.error = this.originalError;
};
