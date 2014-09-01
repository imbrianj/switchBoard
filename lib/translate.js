/*jslint white: true */
/*global State, module, require, console */

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

  var Connections = [];

  return {
    version : 20140901,

    /**
     * Replaces all tokenized substrings with translated strings from the
     * configured laguage.
     */
    translate : function (message, typeClass, language) {
      var fs             = require('fs'),
          defaultLang    = require(__dirname + '/../lang/en-US'),
          selectedLang   = null,
          replaceStrings = function(message, strings) {
            var i = '';

            if(message.indexOf('{{i18n_') !== -1) {
              for(i in strings) {
                message = message.split('{{i18n_' + i + '}}').join(strings[i]);

                // No sense continuing if we know we've translated everything
                // in the given string.
                if(message.indexOf('{{i18n_') === -1) {
                  break;
                }
              }
            }

            return message;
          };

      // If you've configured a language that is not the default (en-US) and the
      // translation file is in the correct path, we'll include it.
      if((language) && (language !== 'en-US') && (fs.existsSync(__dirname + '/../lang/' + language + '.js'))) {
        selectedLang = require(__dirname + '/../lang/' + language);
      }

      if(typeof message === 'string') {
        // If you have a default language that isn't en-US configured, we'll try
        // that first.
        if(selectedLang) {
          message = replaceStrings(message, selectedLang.strings()[typeClass]);
          message = replaceStrings(message, selectedLang.strings().common);
        }

        // If some strings have not been translated yet, we'll fall back to
        // en-US.
        message = replaceStrings(message, defaultLang.strings()[typeClass]);
        message = replaceStrings(message, defaultLang.strings().common);
      }

      return message;
    }
  };
}());
