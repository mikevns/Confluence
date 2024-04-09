/* eslint-disable no-implicit-globals */
/* eslint @atlassian/confluence-server/matching-tests:0, @atlassian/confluence-server/must-use-amd:0, no-undef:0 */
function JsReporting(window, url) {
    'use strict';

    this.window = window;
    this.instrumenters = {};
    this.url = url;
    this.originalConsoleError = window.console.error;
    this._bindFlushEvents();
}

JsReporting.prototype.DEFAULT_FLUSH_COUNT = 10;
JsReporting.prototype.DEFAULT_FLUSH_TIME = 60000;

JsReporting.prototype._flushAndFetch = function() {
    'use strict';

    var self = this;
    Object.keys(self.instrumenters).forEach(function(instrumenterName) {
        var bufferName = self.instrumenters[instrumenterName].bufferName;
        try {
            var logBuffers = JSON.parse(self.window.sessionStorage.getItem(bufferName));

            if (logBuffers !== null && logBuffers.records !== null) {
                self._fetchLog({ logRecords: logBuffers.records }, function(err, success) {
                    if (success) {
                        self.window.sessionStorage.removeItem(bufferName);
                    }
                });
            }
        } catch (e1) { // No session storage available
            self.originalConsoleError.apply(self.window.console, [e1]);
        }
    });
};

JsReporting.prototype._fetchLog = function(payload, callback) {
    'use strict';

    var self = this;
    try {
        var postBody = JSON.stringify(payload);

        var requestMessage = {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: postBody
        };

        self.window.fetch(self.url, requestMessage).then(function(response) {
            if (response.ok) {
                if (callback) {
                    callback(null, true);
                }
            } else {
                self.restoreAll();
                self.window.console.error('Stat Reporter - Unsuccessful request', response);
                if (callback) {
                    callback(new Error('Unsuccessful request'), false);
                }
            }
        }).catch(function(fetchErr) {
            self.restoreAll();
            self.window.console.error(fetchErr);
            if (callback) {
                callback(fetchErr, false);
            }
        });
    } catch (err) {
        self.originalConsoleError.apply(self.window.console, [err]);
        if (callback) {
            callback(err, false);
        }
    }
};

JsReporting.prototype._bindFlushEvents = function() {
    'use strict';

    var self = this;

    if (self.window.addEventListener) {
        self.window.addEventListener('beforeunload', function() {
            self._flushAndFetch();
        });
    }

    if (document.addEventListener) {
        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                self._flushAndFetch();
            }
        }, false);
    }
};

JsReporting.prototype.configUrl = function(url) {
    'use strict';

    this.url = url;
};

JsReporting.prototype.addInstrumenter = function(name, instrumenter) {
    'use strict';

    this.instrumenters[name] = instrumenter;
    this.instrumenters[name].bufferName = name.concat('Buffer');
    instrumenter.instrument({ log: this.log.bind(this, name) });
};

JsReporting.prototype.log = function(instrumenterName, record, recordType, callback) {
    'use strict';

    var self = this;

    if (typeof self.window.fetch === 'undefined') {
        self.restoreAll();
        self.window.console.log('Fetch API is not supported');
        return;
    }

    var instrumenter = self.instrumenters[instrumenterName];
    var bufferName = self.instrumenters[instrumenterName].bufferName;
    var countToFlush = self.DEFAULT_FLUSH_COUNT;
    var timeToFlush = self.DEFAULT_FLUSH_TIME;

    if (typeof instrumenter.config !== 'undefined' && instrumenter.config !== null) {
        var newConfig = instrumenter.config;
        if (typeof newConfig.flushAtCount !== 'undefined' && newConfig.flushAtCount !== null) {
            countToFlush = newConfig.flushAtCount;
        }

        if (typeof newConfig.flushAtTime !== 'undefined' && newConfig.flushAtTime !== null) {
            timeToFlush = newConfig.flushAtTime;
        }
    }

    var recordBody = {};
    var bufferedRecords = [];

    record.location = {
        href: self.window.location.href,
        search: self.window.location.search,
        pathname: self.window.location.pathname,
        hash: self.window.location.hash,
        origin: self.window.location.origin,
        host: self.window.location.host,
        hostname: self.window.location.hostname
    };

    recordBody[recordType] = record;

    var buffer = function(singleRecord) {
        try {
            var logBuffers = JSON.parse(self.window.sessionStorage.getItem(bufferName));

            if (logBuffers === null) {
                logBuffers = {};
                logBuffers.timestamp = new Date().getTime();
            }
            if (typeof logBuffers.records === 'undefined' || logBuffers.records === null) {
                logBuffers.records = [singleRecord];
            } else {
                logBuffers.records.push(singleRecord);
            }
            try {
                self.window.sessionStorage.setItem(bufferName, JSON.stringify(logBuffers));
            } catch (e1) { // Session storage is full or JSON stringify fails
                self.originalConsoleError.apply(self.window.console, [e1]);
                return false;
            }
        } catch (e2) { // No session storage available
            self.originalConsoleError.apply(self.window.console, [e2]);
            return false;
        }

        return true;
    };

    var flush = function(forced, isStored) {
        try {
            var logBuffers = JSON.parse(self.window.sessionStorage.getItem(bufferName));

            if (logBuffers !== null && logBuffers.records !== null) {
                var timeLapse = new Date().getTime() - logBuffers.timestamp;

                // Flush when
                // The number of records reaches the configured maximum size
                // The time lapse exceeds the defined maximum time length to store
                // Cannot save more records because of full storage
                // Being forced to flush when users switch/close windows
                if (logBuffers.records.length >= countToFlush || timeLapse >= timeToFlush || !isStored || forced) {
                    bufferedRecords = bufferedRecords.concat(logBuffers.records);
                    self.window.sessionStorage.removeItem(bufferName);
                    return true;
                }
            }
        } catch (e1) { // No session storage available
            self.originalConsoleError.apply(self.window.console, [e1]);
        }

        return false;
    };

    var isSaved = buffer(recordBody);

    if (isSaved !== true) {
        bufferedRecords = [recordBody];
    }

    var isFlushed = flush(false, isSaved);

    var payload = {
        logRecords: bufferedRecords
    };

    if (isSaved !== true || isFlushed === true) {
        self._fetchLog(payload, callback);
    }
};

JsReporting.prototype.restoreAll = function() {
    'use strict';

    var self = this;
    Object.keys(self.instrumenters).forEach(function(instrumenterName) {
        self.instrumenters[instrumenterName].restore();
    });
};
