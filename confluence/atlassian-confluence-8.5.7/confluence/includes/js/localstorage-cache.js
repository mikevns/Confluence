/**
 * A extension of the cacheManager (cache-manager.js) that supports
 * localstorage as a persistence mechanism.
 *
 * @module confluence/localstorage-cache
 */
define('confluence/localstorage-cache', [
    'confluence/object-cache',
    'jquery',
    'window'
], function(CacheManager,
    $,
    window) {
    'use strict';

    /**
     * @constructor
     * @param storageKey the localstorage key to store data against.
     * @param cacheSize size of the cache.
     *
     * @extends module:confluence/object-cache
     * @alias module:confluence/localstorage-cache
     */
    var LocalStorageCacheManager = function(storageKey, cacheSize) {
        this.cache = {};
        this.cacheStack = [];
        this.cacheSize = cacheSize || 30;

        // If localStorage doesn't exist or if no storageKey is provided this object behaves as a cacheManager.
        if (!window.localStorage || (typeof storageKey !== 'string' && storageKey.length > 0)) {
            return;
        }

        var localStoreKey = 'Confluence.' + storageKey;
        var localCacheKey = localStoreKey + '.cache';
        var localCacheStackKey = localStoreKey + '.cacheStack';

        var cache = window.localStorage.getItem(localCacheKey);
        var cacheStack = window.localStorage.getItem(localCacheStackKey);
        var self = this;

        // Must check both of these together. A browser could GC one before the other.
        if (cache && cacheStack) {
            try {
                // On misuse of the API, localstorage keys can get polluted this checks for that and resets values.
                this.cache = JSON.parse(cache);
                this.cacheStack = JSON.parse(cacheStack);
            } catch (e) {
                this.cache = {};
                this.cacheStack = {};
            }
        }

        $(window).unload(function() {
            window.localStorage.setItem(localCacheKey, JSON.stringify(self.cache));
            window.localStorage.setItem(localCacheStackKey, JSON.stringify(self.cacheStack));
        });
    };

    LocalStorageCacheManager.prototype = new CacheManager();

    return LocalStorageCacheManager;
});

require('confluence/module-exporter').exportModuleAsGlobal('confluence/localstorage-cache', 'AJS.Confluence.localStorageCacheManager');
