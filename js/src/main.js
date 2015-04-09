'use strict';

// Loading dependencies and setting variables.
var i18n = require('i18next-client'),
    Handlebars = require('hbsfy/runtime'),
    frenchCatalog = require('./../../locales/fr/fr.json'),
    testTemplate = require('./templates/test.hbs');

/**
 *  Simple helper for direct translations.
 *
 *  @param {string} i18n_key - Key to look up in translations catalog.
 *  @return {string}
 *
 *  Example Usage:
 *  {{ t "Hello world." }}
 */
Handlebars.registerHelper('t', function(i18n_key) {
    var result = i18n.t(i18n_key);
    return new Handlebars.SafeString(result);
});

/**
 *  A more robust helper for handling translations including plurals.
 *  Creates one big object of variables from the passed in data
 *  to the template, and any key/value pairs on the call to the
 *  helper. Passes this object off to the i18n methods to
 *  retrieve the appropriate result.
 *
 *  @param {object} context - Automatically set by Handlebars. The template context.
 *  @param {object} options - Automatically set by Handlebars. Contains key/values set when calling helper.
 *  @return {string}
 *
 *  Example Usage:
 *  {{ tr this key="Hello world." }}
 *  {{ tr this key="I have an apple." count=3 }}
 *  {{ tr this key="I have an apple." count=apple_count }}
 *  {{ tr this key="You have __messages__ new message." count=1 messages=1 }}
 *  {{ tr this key="You have __messages__ new message." count=message_count messages=message_count }}
 */
Handlebars.registerHelper('tr', function(context, options) {
    var context = context || {},
        i18nOptions = i18n.functions.extend(options.hash, context);

    if (options.fn) {
        i18nOptions.defaultValue = options.fn(context);
    }

    var i18nResult = i18n.t(i18nOptions.key, i18nOptions);
    return new Handlebars.SafeString(i18nResult);
});

// Instantiate the i18n library, ensuring we give it a translation
// catalog so it doesn't try to load one async.
i18n.init({
    nsseparator: ':::',     // Necessary to allow gettext keys rather than symbolic keys (as use of `.` would break).
    keyseparator: '::',     // Necessary to allow gettext keys rather than symbolic keys (as use of `.` would break).
    lng: 'fr',
    resStore: {
        fr: {
            translation: frenchCatalog
        }
    }
});

// String lookup.
console.log(i18n.t('Hello world.'));

// Plural lookup.
console.log(i18n.t('I have an apple.', { count: 1 }));
console.log(i18n.t('I have an apple.', { count: 2 }));

// Plural lookup with variable replacement.
console.log(i18n.t('You have __messages__ new message.', { count: 1, messages: 1 }));
console.log(i18n.t('You have __messages__ new message.', { count: 6, messages: 6 }));

// Handlebars template using helpers to emulate all of the above.
console.log(testTemplate({
    apple_count: 1,
    message_count: 6
}));