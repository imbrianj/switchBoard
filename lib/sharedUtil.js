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
 * @fileoverview Collection of small sugar functions shared between client and
 *               server.
 */

(function (exports){
  'use strict';

  exports.util = {
    version : 20171030,

    /**
     * Replace all instances of a substring within a larger string by a new
     * string.  Basically .replace, but for all instances of the substring.
     */
    replaceAll : function (text, find, replace) {
      var value = text;

      if (typeof text === 'string') {
        value = text.replace(new RegExp(find, 'g'), replace);
      }

      return value;
    },

    /**
     * Accept a string and removes any HTML tags for more safe display.
     */
    stripTags : function (text) {
      return typeof text === 'string' ? text.replace(/(<([^>]+)>)/ig, '') : text;
    },

    /**
     * Strip out control characters from the inputted string.
     */
    stripControl : function (text) {
      return typeof text === 'string' ? text.replace(new RegExp('[\x00-\x1F\x7F]+', 'g'), '') : text;
    },

    /**
     * Sanitize a given string against control characters and HTML tags.
     */
    sanitize : function (text) {
      return exports.util.stripTags(exports.util.stripControl(text));
    },

    /**
     * Accept a readable name "Test Device" and convert it to a usable token:
     * "test_device".
     */
    encodeName : function (name) {
      if ((name) && (typeof name === 'string')) {
        name = name.replace(/[\s!@#$%^&*()"'\\<>,;.:/+]/g, '_').toLowerCase();
      }

      return name;
    },

    /**
     * Translates strings set in a devices parser.  If you're on the
     * server-side, it uses the standard translate library to look up strings.
     * If on the client side, it references translation data attributes set to
     * the root of the device markup.
     */
    translate : function (key, typeClass, language) {
      var translate,
          message = '';

      if ((key) && (typeof key === 'string')) {
        key = key.toUpperCase();

        if (typeof SB === 'object') {
          language = document.documentElement.getAttribute('lang');

          translate = function (message, typeClass) {
            var node = SB.getByClass(typeClass, SB.getByTag('main')[0], 'section')[0];

            message = message.replace('{{i18n_', '').replace('}}', '');

            if ((node.dataset) && (node.dataset['string' + message.charAt(0) + message.substr(1).toLowerCase()])) {
              message = node.dataset['string' + message.charAt(0) + message.substr(1).toLowerCase()];
            }

            else if (SB.spec.strings[message]) {
              message = SB.spec.strings[message];
            }

            return message;
          };
        }

        else {
          translate = require(__dirname + '/translate').translate;
        }

        message = translate('{{i18n_' + key + '}}', typeClass, language);
      }

      else {
        message = key;
      }

      return message;
    },

    /**
     * Accept an array of names or values - and return the proper translated
     * string list of them.  ['Apple', 'Orange', 'Banana'] would return:
     * "Apple, Orange and Banana".  Requires lang and deviceType to determine
     * correct translation strings.
     */
    arrayList : function (elms, deviceType, language) {
      var message = '',
          i       = 0;

      for (i; i < elms.length; i += 1) {
        if (i) {
          if (i === (elms.length - 1)) {
            message = message + ' ' + exports.util.translate('AND', deviceType, language) + ' ';
          }

          else {
            message = message + ', ';
          }
        }

        message = message + elms[i];
      }

      return message;
    },

    /**
     * Accept an integer of seconds elapsed and converts to a readable duration
     * string for display.
     */
    displayRelativeTime : function (seconds) {
      var relative = {
            day    : 86400,
            hour   : 3600,
            minute : 60,
            second : 1
          },
          times    = {
            day    : '00',
            hour   : '00',
            minute : '00',
            second : '00'
          },
          type;

      for (type in relative) {
        if (seconds >= relative[type]) {
          times[type] = Math.floor(seconds / relative[type]);

          if (times[type] < 10) {
            times[type] = '0' + times[type];
          }

          seconds = seconds - (times[type] * relative[type]);
        }
      }

      return times.day + ' ' + times.hour + ':' + times.minute + ':' + times.second;
    },

    /**
     * Accept a Unix timestamp and translation function and return a readable
     * string of the day / time.
     */
    displayTime : function (unix, translate, format, explicit) {
      var stamp    = explicit || new Date(unix),
          date     = stamp.getDate(),
          day      = stamp.getDay(),
          days     = { 0 : 'sun', 1 : 'mon', 2 : 'tue', 3 : 'wed', 4 : 'thur', 5 : 'fri', 6 : 'sat' },
          hour     = stamp.getHours(),
          minute   = stamp.getMinutes(),
          meridian = translate('am'),
          output   = '';

      if (hour > 12) {
        hour     = hour - 12;
        meridian = translate('pm');
      }

      hour = hour === 0 ? 12 : hour;

      if (minute < 10) {
        minute = '0' + minute;
      }

      day = translate(days[day]);

      switch (format) {
        case 'long' :
          output = day + ' ' + date + ' @ ' + hour + ':' + minute + meridian;
        break;

        default :
          output = day + ' @ ' + hour + ':' + minute + meridian;
        break;
      }

      return output;
    },

    /**
     * Accept a temperature in fahrenheit and convert it to celsius.
     */
    fToC : function (f) {
      return Math.round((f - 32) / 1.8);
    },

    /**
     * Accept a temperature in celsius and convert it to fahrenheit.
     */
    cToF : function (c) {
      return Math.round((c * 1.8) + 32);
    },
  };
})(typeof exports === 'undefined' ? this.SB : exports);
