/* global AJS */
/**
 * Overrides AUI's broken localisation implementation to something that will work in Confluence.
 * TODO maybe remove when https://ecosystem.atlassian.net/browse/AUI-3873 is resolved.
 *
 * Other plugins that use the date picker:
 * * Business Blueprints
 * * Playbook Blueprints
 * * UI Components
 *
 * They can continue to depend on confluence.web.resources:date-picker instead of directly on AUI when this is removed.
 *
 * @module confluence/date-picker-localisation
 */
require(['aui/datepicker'], function(DatePicker) {
    'use strict';

    // The price of forking
    /* eslint-disable no-param-reassign,atlassian-wrm-i18n/matching-i18n-key-in-properties-file */
    var yearSuffix = AJS.I18n.getText('ajs.datepicker.localisations.year-suffix');

    if (!DatePicker) {
        return;
    }
    // Override each individual property to maintain forward compatibility without breaking everything
    DatePicker.prototype.localisations.dayNames = [
        AJS.I18n.getText('ajs.datepicker.localisations.day-names.sunday'),
        AJS.I18n.getText('ajs.datepicker.localisations.day-names.monday'),
        AJS.I18n.getText('ajs.datepicker.localisations.day-names.tuesday'),
        AJS.I18n.getText('ajs.datepicker.localisations.day-names.wednesday'),
        AJS.I18n.getText('ajs.datepicker.localisations.day-names.thursday'),
        AJS.I18n.getText('ajs.datepicker.localisations.day-names.friday'),
        AJS.I18n.getText('ajs.datepicker.localisations.day-names.saturday')];
    DatePicker.prototype.localisations.dayNamesMin = [
        AJS.I18n.getText('ajs.datepicker.localisations.day-names-min.sunday'),
        AJS.I18n.getText('ajs.datepicker.localisations.day-names-min.monday'),
        AJS.I18n.getText('ajs.datepicker.localisations.day-names-min.tuesday'),
        AJS.I18n.getText('ajs.datepicker.localisations.day-names-min.wednesday'),
        AJS.I18n.getText('ajs.datepicker.localisations.day-names-min.thursday'),
        AJS.I18n.getText('ajs.datepicker.localisations.day-names-min.friday'),
        AJS.I18n.getText('ajs.datepicker.localisations.day-names-min.saturday')];
    DatePicker.prototype.localisations.firstDay = AJS.I18n.getText('ajs.datepicker.localisations.first-day');
    DatePicker.prototype.localisations.isRTL = AJS.I18n.getText('ajs.datepicker.localisations.is-RTL') === 'true';
    DatePicker.prototype.localisations.monthNames = [
        AJS.I18n.getText('ajs.datepicker.localisations.month-names.january'),
        AJS.I18n.getText('ajs.datepicker.localisations.month-names.february'),
        AJS.I18n.getText('ajs.datepicker.localisations.month-names.march'),
        AJS.I18n.getText('ajs.datepicker.localisations.month-names.april'),
        AJS.I18n.getText('ajs.datepicker.localisations.month-names.may'),
        AJS.I18n.getText('ajs.datepicker.localisations.month-names.june'),
        AJS.I18n.getText('ajs.datepicker.localisations.month-names.july'),
        AJS.I18n.getText('ajs.datepicker.localisations.month-names.august'),
        AJS.I18n.getText('ajs.datepicker.localisations.month-names.september'),
        AJS.I18n.getText('ajs.datepicker.localisations.month-names.october'),
        AJS.I18n.getText('ajs.datepicker.localisations.month-names.november'),
        AJS.I18n.getText('ajs.datepicker.localisations.month-names.december')];
    DatePicker.prototype.localisations.showMonthAfterYear = AJS.I18n.getText('ajs.datepicker.localisations.show-month-after-year') === 'true';
    DatePicker.prototype.localisations.yearSuffix = (yearSuffix && yearSuffix !== 'null') ? yearSuffix : '';
});
