/**
 * Copyright (c) 2014 brian@bevey.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

/**
 * @author brian@bevey.org
 * @fileoverview Does token replacement for the given language set.
 * @requires fs
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20180107,

    /**
     * Accept a string and return that string without punctation.
     */
    stripPunctuation : function (input) {
      return input.replace(/[:;.,!?]/g, '');
    },

    /**
     * Returns the array of synonyms for a given device's translations.
     */
    findSynonyms : function (typeClass, language) {
      var defaultLang  = require(__dirname + '/../lang/en'),
          selectedLang = null,
          synonyms     = [];

      // If you've configured a language that is not the default (en) and the
      // translation file is in the correct path, we'll include it.
      if ((language) && (language !== 'en')) {
        try {
          selectedLang = require(__dirname + '/../lang/' + language);
        }

        catch (err) {
          console.log('\x1b[35mTranslation\x1b[0m: No translation file found.');
        }
      }

      if (defaultLang.strings()[typeClass].SYNONYMS) {
        synonyms = defaultLang.strings()[typeClass].SYNONYMS;
      }

      if (selectedLang) {
        synonyms = selectedLang.strings()[typeClass].SYNONYMS;
      }

      return synonyms;
    },

    /**
     * Replaces all tokenized substrings with translated strings from the
     * configured laguage.
     */
    translate : function (message, typeClass, language) {
      var defaultLang    = require(__dirname + '/../lang/en'),
          selectedLang   = null,
          replaceStrings = function (message, strings) {
            var i = '';

            if ((strings) && (message.indexOf('{{i18n_') !== -1)) {
              for (i in strings) {
                if (i !== 'SYNONYMS') {
                  message = message.split('{{i18n_' + i + '}}').join(strings[i]);

                  // No sense continuing if we know we've translated everything
                  // in the given string.
                  if (message.indexOf('{{i18n_') === -1) {
                    break;
                  }
                }
              }
            }

            return message;
          };

      // If you've configured a language that is not the default (en) and the
      // translation file is in the correct path, we'll include it.
      if ((language) && (language !== 'en')) {
        try {
          selectedLang = require(__dirname + '/../lang/' + language);
        }

        catch (err) {
          console.log('\x1b[35mTranslation\x1b[0m: No translation file found.');
        }
      }

      if (typeof message === 'string') {
        // If you have a default language that isn't en configured, we'll try
        // that first.
        if (selectedLang) {
          message = replaceStrings(message, selectedLang.strings()[typeClass]);
          message = replaceStrings(message, selectedLang.strings().common);
        }

        // If some strings have not been translated yet, we'll fall back to en.
        message = replaceStrings(message, defaultLang.strings()[typeClass]);
        message = replaceStrings(message, defaultLang.strings().common);
      }

      return message;
    }
  };
}());
