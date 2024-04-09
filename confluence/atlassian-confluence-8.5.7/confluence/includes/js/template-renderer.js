/**
 * @module confluence/template-renderer
 */
define('confluence/template-renderer', [
    'jquery',
    'ajs',
    'confluence/meta'
], function(
    $,
    AJS,
    Meta
) {
    'use strict';

    var templates = {};

    /**
     * Wrap this function around values which should not be auto-HTML escaped in template substitution.
     *
     * @param value the String value which should not be escaped
     */
    function html(value) {
        var str = new String(value); // eslint-disable-line no-new-wrappers
        str.isHtml = true;
        return str;
    }

    /**
     * Loads template script elements from a passed element of from the document.
     * If the passed element is HTML it will be converted to an element before being parsed.
     */
    function loadTemplateScripts(element) {
        element = element || document;

        $('script', element).each(function() {
            if (this.type === 'text/x-template') {
                templates[this.title] = html(this.text);
            }
        });
    }

    function init() {
        loadTemplateScripts();
    }

    /**
     * Get the named template from the internal store. If the template is not found
     * then try to retrieve it directly from the DOM, on the assumption that there
     * may have been dynamic updates made to the DOM since loadTemplateScripts()
     * was called.
     */
    function getTemplate(name) {
        var template = templates[name];
        if (!template) {
            template = getTemplateFromPage(name, document);
        }

        return template;
    }

    /**
     * Find and return the named template from the page instead of from the internal store.
     *
     * @param {string} name - The name of the template
     * @param {HTMLElement} element - The root element to start searching from
     */
    function getTemplateFromPage(name, element) {
        var template = $('script[title="' + name + '"]', element);
        if (template.length === 0) {
            return null;
        }

        templates[name] = html(template[0].text);
        return templates[name];
    }

    var entities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '\'': '&#39;',
        '"': '&quot;'
    };

    function escapeEntities(str) {
        if (str == null) {
            return str;
        }
        if (str.isHtml) {
            return '' + str;
        }
        return ('' + str).replace(/[&<>'"]/g, function(c) { return entities[c] || c; });
    }

    function format(message) {
        var args = arguments;
        return message.replace(/\{(\d+)\}/g, function(str, i) {
            var replacement = args[parseInt(i, 10) + 1];
            return replacement != null ? replacement : str;
        });
    }

    /**
     * Retrieves a template with a given name from the page body (in the form
     * <script type="text/x-template" title="name">...</script>) and formats it
     * using AJS.format. The arguments are automatically HTML-encoded, so that
     * you cannot accidentally introduce XSS vulnerabilities with this templating
     * mechanism.
     *
     * @method renderTemplate
     * @param templateName the title of a script tag in the document which contains a template
     * @param args an array or list of arguments which will be the replacement values for tokens {0}, {1}, etc.
     * @return {String} the template with the tokens replaced or empty string if there is no matching template
     * @usage renderTemplate("someTemplate", "first", "second", "third");
     * @usage renderTemplate("someTemplate", ["first", "second", "third"]);
     */
    function renderTemplate(templateName, args) {
        if (!getTemplate(templateName)) {
            return '';
        }
        if (!$.isArray(args)) {
            args = Array.prototype.slice.call(arguments, 1); // arguments is not a proper Array
        }
        var template = getTemplate(templateName).toString();
        var formatArgs = [template];
        for (var i = 0; i < args.length; i++) {
            formatArgs.push(escapeEntities(args[i]));
        }
        return format.apply(this, formatArgs);
    }

    /**
     * Loads templates from a URL, stores them in the template store, then runs a callback.
     * @param url
     * @param callback
     */
    function loadTemplatesFromUrl(url, callback) {
        // If url should include static prefix and doesn't - add it.
        var prefix = Meta.get('static-resource-url-prefix');
        if (url.indexOf('http') !== 0 && url.indexOf(prefix) !== 0) {
            url = prefix + url;
        }
        $.ajax({
            url: url,
            data: {
                locale: AJS.params.userLocale // request should be cached against the user's locale
            },
            dataType: 'html',
            success: function(html) {
                var wrapper = $('<div></div>').append(html);
                loadTemplateScripts(wrapper);
                callback && callback();
            }
        });
    }

    /**
     * Loads templates for a resource name in a plugin module.
     * @param moduleKey - the complete key of the module, in the form pluginKey:moduleKey
     * @param resourceName - the resource name inside the module.
     * @param callback
     */
    function loadWebResourceTemplates(moduleKey, resourceName, callback) {
        var url = '/download/resources/' + moduleKey + '/' + resourceName;
        return loadTemplatesFromUrl(url, callback);
    }

    return {
        renderTemplate: renderTemplate,
        loadTemplatesFromUrl: loadTemplatesFromUrl,
        loadWebResourceTemplates: loadWebResourceTemplates,
        escapeEntities: escapeEntities,
        getTemplate: getTemplate,
        loadTemplateScripts: loadTemplateScripts,
        html: html,
        init: init
    };
});

require('confluence/module-exporter').safeRequire('confluence/template-renderer', function(TemplateRenderer) {
    'use strict';

    var AJS = require('ajs');

    AJS.renderTemplate = TemplateRenderer.renderTemplate;
    AJS.loadTemplatesFromUrl = TemplateRenderer.loadTemplatesFromUrl;
    AJS.loadWebResourceTemplates = TemplateRenderer.loadWebResourceTemplates;
    AJS.escapeEntities = TemplateRenderer.escapeEntities;
    AJS.getTemplate = TemplateRenderer.getTemplate;
    AJS.loadTemplateScripts = TemplateRenderer.loadTemplateScripts;
    AJS.html = TemplateRenderer.html;
    AJS.toInit(TemplateRenderer.init);
});
