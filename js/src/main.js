'use strict';

// Loading dependencies, caching selectors and defining other variables.
var Ajax = require('simple-ajax'),
    apiPrefix = '../locales/',
    i18nHelper = require('./utils/i18n-helper'),
    testTemplate = require('./test.hbs'),
    greetingElement = document.querySelector('.js-greeting'),
    languageElement = document.querySelector('.js-select-language'),
    messageCountElement = document.querySelector('.js-message-count'),
    messageElement = document.querySelector('.js-messages'),
    templateContainerElement = document.querySelector('.js-template-container');

/**
 *  Retrieves the language files that match the language code.
 *  Performs an API request for data if necessary.
 *
 *  @param {string} langCode - Two-letter language code.
 *  @return {object} - Promise.
 */
function getTranslations(langCode) {
    return new Promise(function(resolve, reject) {
        if (i18nHelper.options.resStore.hasOwnProperty(langCode)) {
            resolve();
        } else {
            var ajax = new Ajax({
                method: 'GET',
                url: apiPrefix + langCode + '/' + langCode + '.json'
            });

            ajax.on('success', function(event, data) {
                i18nHelper.addResourceBundle(langCode, 'translation', JSON.parse(data));
                resolve();
            });

            ajax.on('error', function(event, data) {
                reject(JSON.parse(data));
            });

            ajax.send();
        }
    });
}

/**
 *  Applies the translation data to the i18n instance and
 *  then triggers an update of the greetings.
 *
 *  @param {string} langCode - Two-letter language code.
 */
function setLanguage(langCode) {
    var translationsRequest = getTranslations(langCode);

    translationsRequest.then(
        function() {
            i18nHelper.setLng(langCode, function() {
                setGreeting();
                setMessage();
                setTemplate();
            });
        },
        function() {
            console.warn('setLanguage', 'Error setting language.');
        }
    );
}

/**
 *  Updates the DOM with the appropriate greeting.
 *  This demonstrates a standard translation via `gettext`.
 */
function setGreeting() {
    var greetingTranslation = i18nHelper.t('Hello world.');
    greetingElement.innerHTML = greetingTranslation;
}

/**
 *  Takes the message count and ensures its a numeric value. Uses
 *  `ngettext` to determine which message (singular or plural)
 *  should be used then uses `sprintf` to update the dynamic
 *  values within the statement. After this is all done, the
 *  DOM is updated.
 */
function setMessage() {
    var inputValue = messageCountElement.value
    inputValue = parseInt(inputValue.trim(), 10) || 0;

    messageElement.innerHTML = i18nHelper.t('You have __messages__ new message.', {
        count: inputValue,
        messages: inputValue
    });
}

/**
 *  Updates the DOM with a handlebars template that outputs
 *  sentences via `gettext`, `ngettext` and `sprintf`.
 */
function setTemplate() {
    templateContainerElement.innerHTML = testTemplate({
        total_people: 2,
        total_messages: 1
    });
}

/**
 *  Whenever the language selection changes, trigger update
 *  logic to change accordingly.
 *
 *  @param {object} event - DOM Event.
 */
languageElement.addEventListener('change', function(event) {
    var chosenValue = event.target.value;
    setLanguage(chosenValue);
});

/**
 *  Whenever the message count field is updated we trigger
 *  the logic to update the DOM.
 *
 *  @param {object} event - DOM Event.
 */
messageCountElement.addEventListener('keyup', function(event) {
    event.preventDefault();
    setMessage();
});

// Ensure starting sentences are output.
setGreeting();
setMessage();
setTemplate();