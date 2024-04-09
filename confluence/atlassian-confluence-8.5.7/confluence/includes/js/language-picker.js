/**
 * A language picker service that allows to hook into the selection of a language using an AUI Dropdown
 */
define('confluence/language-picker', [
    'jquery'
], function($) {
    'use strict';

    /**
     * Runs the specified lifecycle event if it exists
     * @param {object} options       Options passed down from initialisation.
     * @param {string} eventName     The name of the lifecycle event to run.
     * @param {object} $target       The jQuery element representing the selection taking place.
     * @returns {boolean} true if the lifecycle event was executed. False if it wasn't defined.
     * @private
     */
    function _runLifecycleEvent(options, eventName, $target) {
        if (options && options[eventName] && typeof options[eventName] === 'function') {
            options[eventName]($target.data('key'), $target.data('value'));
            return true;
        }
        return false;
    }

    /**
     * Initialises the Language Picker with extra options.
     *
     * The language picker should be laid out on the page as:
     *      <a href="#{your-id}" aria-owns="{your-id}" aria-haspopup="true" class="...">...</a>
     *      <div id="{your-id}" class="aui-style-default aui-dropdown2">
     *          <ul class="...">
     *              <li>
     *                  <a|other-element  ...
     *                      data-key="{language-key}"
     *                      data-value="{language-display-name}"
     *                      href="{optional!link}">
     *                          {language-display-name}
     *                  </a|other-element>
     *              </li>
     *              ...
     *          </ul>
     *      </div>
     *
     * The anchor is optional. You could instead put the data-key and data-value directly on the List Item.
     * href is only used if the element is an a tag.
     * @param {string}      id                      equal to {your-id} value in the markup, not including a '#'.
     * @param {object}      options                 All possible options
     * @param {function}    options.onBeforeSelect  Function that runs before the selection of the item
     *                                                  actually takes place. It gets the key and value
     *                                                  from the data-attributes defined above.
     * @param {function}    options.onSelect        Function that runs when the selection of the item
     *                                                      is made. It gets the key and value
     *                                                      from the data-attributes defined above.
     *                                                  If this function is not provide, the href of
     *                                                      the anchor is used if one is provided.
     *                                                  Otherwise, nothing happens.
     * @param {function}    options.onAfterSelect   Function that runs after the selection of the item
     *                                                  is made. It gets the key and value
     *                                                  from the data-attributes defined above.
     */
    function init(id, options) {
        var $dropdown = $('#' + id);
        if (!$dropdown.length) {
            return;
        }
        $dropdown.click(function(e) {
            e.preventDefault();

            var $target = $(e.target);

            _runLifecycleEvent(options, 'onBeforeSelect', $target);

            if (!_runLifecycleEvent(options, 'onSelect', $target)) {
                if ($target.prop('tagName').toLowerCase() === 'a') {
                    if ($target.prop('href')) {
                        window.location = $target.prop('href');
                    }
                }
            }

            _runLifecycleEvent(options, 'onAfterSelect', $target);
        });
    }

    return {
        init: init
    };
});
