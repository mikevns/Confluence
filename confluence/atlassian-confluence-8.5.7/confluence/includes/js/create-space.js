/**
 * @module confluence/create-space
 */
define('confluence/create-space', [
    'ajs',
    'jquery',
    'confluence/templates',
    'window',
    'underscore',
    'confluence/api/constants',
    'confluence/api/logger',
    'confluence/meta',
    'confluence/api/event'
], function(
    AJS,
    $,
    Templates,
    window,
    _,
    CONSTANTS,
    logger,
    Meta,
    event
) {
    'use strict';

    // Note: this is the old create space dialog, left here for the middle/right clicks
    // new one is in the create content plugin
    function CreateSpace() {
        // Maintain one dialog instance and reuse it if the form is closed and re-opened.
        var dialog = null;
        var $keyField;
        var $nameField;
        var $submitButton;
        var keyErrors;
        var nameErrors;
        var isValid = false;
        var keyValidationRequest;
        var keygenTimeout = 100;

        var validationFunctions = {
            key: function() {
                var deferred = $.Deferred();
                var value = $.trim($keyField.val());
                if (!value) {
                    deferred.reject(AJS.I18n.getText('space.key.empty'));
                    return deferred;
                }

                if (keyValidationRequest) {
                    logger.log('Aborting previous space key validation request.');
                    keyValidationRequest.abort();
                }
                keyValidationRequest = $.getJSON(CONSTANTS.CONTEXT_PATH + '/ajax/spaceavailable.action', { key: value }).done(function(data) {
                    if (!data.available && data.message) {
                        deferred.reject(data.message);
                    } else {
                        deferred.resolve();
                    }

                    keyValidationRequest = false;
                });

                return deferred.promise();
            },

            name: function() {
                var deferred = $.Deferred();
                if (!$.trim($nameField.val())) {
                    deferred.reject(AJS.I18n.getText('space.name.empty'));
                } else {
                    deferred.resolve();
                }

                return deferred.promise();
            }
        };

        /**
         *  A utility function for IE and Firefox specifically that will select all text in the supplied textbox control.
         *
         * Webkit has a more sensible behaviour on focus so doesn't need this.
         */
        function selectAll($textbox) {
            var textElem = $textbox[0];
            if (textElem.setSelectionRange) {
                var length = $textbox.val().length;
                textElem.setSelectionRange(0, length);
            } else if (textElem.createTextRange) {
                var range = textElem.createTextRange();
                range.execCommand('SelectAll');
                range.select();
            }
        }

        function enableSubmit(enabled) {
            if (enabled) {
                $submitButton.removeAttr('disabled');
            } else {
                $submitButton.attr('disabled', 'disabled');
            }
            isValid = enabled;
        }

        var invalidatedFields = {};

        function validateField(field) {
            enableSubmit(false);
            var fieldKey = field.attr('name');
            var errorContainer = field.siblings('.error');

            // We use a deferred so that sync and async Validation can be treated the same.
            invalidatedFields[fieldKey] = true;
            var promise = validationFunctions[fieldKey]();
            promise.done(function() {
                // Validation OK
                delete invalidatedFields[fieldKey];
                errorContainer.text('').addClass('hidden');
            });
            promise.fail(function(message) {
                // Validation BAD
                errorContainer.text(message).removeClass('hidden');
            });
            promise.always(function() {
                // Run AFTER the invalidatedFields is updated!!
                enableSubmit($.isEmptyObject(invalidatedFields));
                // For testability
                field.attr('data-validated-value', field.val());
            });

            return promise;
        }

        /**
         * Wires up a form with the Key Generator, Key description URL updater and AJAX validation.
         */
        function bindToForm($createSpaceForm) {
            var $spaceUrlExampleKeySpan = $createSpaceForm.find('#space-url-example');
            var spaceUrlBase = Meta.get('base-url') + '/display/';
            var spaceKeyPlaceholder = '<' + AJS.I18n.getText('space.create.form.key.placeholder') + '>';

            /**
             * The space URL example is updated as the key field is changed. If the key is "", the
             * default placeholder text (e.g. "<SPACE KEY>") is displayed in the URL.
             */
            var updateSpaceUrlExample = function(key) {
                key = key || spaceKeyPlaceholder;
                var url = spaceUrlBase + key;
                $spaceUrlExampleKeySpan.text(url);
            };
            var reallySubmit = false;

            enableSubmit(false);
            updateSpaceUrlExample();

            $keyField = $createSpaceForm.find('input[name=\'key\']').first();
            $nameField = $createSpaceForm.find('input[name=\'name\']').first();
            keyErrors = $keyField.parent().find('.error');
            nameErrors = $nameField.parent().find('.error');

            // validate generated keys ...
            $keyField.generateFrom($nameField, {
                uppercase: false,
                maxNameLength: 255,
                maxKeyLength: 255,
                timeoutMS: keygenTimeout,
                validationCallback: function() {
                    // Called when the key is changed
                    $keyField.keyup();
                }
            });

            function keyup() {
                var $field = $(this);
                var keyVal = $field.val();
                if (typeof $field.data('originalVal') === 'undefined') {
                    $field.data('originalVal', '');
                }
                if ($field.data('originalVal') === keyVal) {
                    return;
                }
                $field.data('originalVal', keyVal);
                validateField($field);
            }

            // ... and hand crafted keys and names...
            $keyField.keyup(_.debounce(keyup, 500));
            $nameField.keyup(keyup);

            $keyField.keyup(function() {
                updateSpaceUrlExample($keyField.val());
            });

            // ensure selection works correctly in IE
            $keyField.focus(function() {
                selectAll($keyField);
            });

            // Toggle the 'Locked' padlock icon when the checkbox is changed.
            $createSpaceForm.find('#permission-private').change(function() {
                $('#permissions-group').toggleClass('locked');
            });

            $createSpaceForm.submit(function(e) {
                // reallySubmit is a workaround required because our validation happens in a setTimeout, and the callback
                // needs to be able to submit, which calls this method again.
                if (!reallySubmit) {
                    e.preventDefault();
                } else {
                    return;
                }

                // We do it after a delay of keygenTimeout + 1 so that the keygen has a chance to update the key field first.
                window.setTimeout(function() {
                    // Validation on submit is required because there can be cases where a key and then enter is pressed so fast
                    // that the keydown event that calls submit is called before the keyup event that validates the form. This
                    // would make the form think it is in a valid state and try to submit, causing it to end up on the create
                    // space page if the key being pressed with enter causes the key/name to be invalid.
                    var keyDeferred = validateField($keyField);
                    var nameDeferred = validateField($nameField);

                    $.when({}, keyDeferred, nameDeferred).then(function() {
                        // Prevent form submission if either validation fails.
                        if (isValid) {
                            reallySubmit = true;
                            $createSpaceForm.submit();
                        }
                    });
                }, keygenTimeout + 1);
            });
        }

        function createDialog() {
            var $createSpaceForm = $(Templates.CreateSpace.createSpaceForm({
                atlToken: $('#atlassian-token').prop('content')
            }));

            var submitCallback = function() {
                $createSpaceForm.submit();
            };

            var cancelCallback = function() {
                dialog.hide();

                $nameField.val('');
                $keyField.val('');
                keyErrors.text('').addClass('hidden');
                nameErrors.text('').addClass('hidden');
                enableSubmit(false);
            };

            var dialog = new AJS.ConfluenceDialog({
                width: 600,
                height: 400,
                id: 'create-space-dialog',
                closeOnOutsideClick: true,
                onCancel: cancelCallback,
                onSubmit: submitCallback
            });

            dialog.addHeader(AJS.I18n.getText('space.create.form.title'));
            dialog.addPanel('Panel 1', $createSpaceForm);

            dialog.addSubmit(AJS.I18n.getText('space.create.form.submit.button'), submitCallback);
            dialog.addCancel(AJS.I18n.getText('cancel.name'), cancelCallback);

            // CONFDEV-12853: Add help link via prepend() instead of append() to prevent FF display issue
            dialog.popup.element.find('.dialog-title').prepend(Templates.CreateSpace.helpLink());

            $submitButton = dialog.popup.element.find('.button-panel-submit-button');

            bindToForm($createSpaceForm);

            dialog.gotoPage(0);
            dialog.gotoPanel(0);
            return dialog;
        }

        event.bind('ready-for-create-space-form-init', function(e, $form) {
            $submitButton = $form.find('input[type=submit]');
            bindToForm($form);
        });

        // If on the Create Space Page and not the dialog (e.g. if going straight to a URL), bind the form.
        var formOnPageLoad = $('#create-space-form:not(.noautobind)');
        if (formOnPageLoad.length) {
            event.trigger('ready-for-create-space-form-init', [formOnPageLoad]);
        }
    }

    return CreateSpace;
});

require('confluence/module-exporter').safeRequire('confluence/create-space', function(CreateSpace) {
    'use strict';

    var AJS = require('ajs');

    AJS.toInit(CreateSpace);
});
