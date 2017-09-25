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
 * @fileoverview Announce when a specific word has been repeated multiple times
 *               within a news feed, implying something notable has happened.
 */

module.exports = (function () {
  'use strict';

  var CooldownWords = {};

  return {
    version : 20170921,

    translate : function (token, lang) {
      var translate = require(__dirname + '/../lib/translate');

      return translate.translate('{{i18n_' + token + '}}', 'rss', lang);
    },

    findProperNouns : function (articleParts, blacklist) {
      var i           = 0,
          word,
          properNouns = [];

      for (i; i < articleParts.length; i += 1) {
        word = articleParts[i];

        if ((this.isWordCapitalized(word)) && (blacklist.indexOf(word.toLowerCase()) === -1)) {
          properNouns.push(word);
        }
      }

      return properNouns;
    },

    isWordCapitalized : function (string) {
      var isCapitalized = false;

      if (string) {
        if (string[0] === string[0].toUpperCase()) {
          // Filter out numbers and special chars.
          if (string[0] !== string[0].toLowerCase()) {
            isCapitalized = true;
          }
        }
      }

      return isCapitalized;
    },

    parseArticles : function (articles, blacklist) {
      var nouns = [],
          i     = 0,
          articleParts;

      for (i; i < articles.length; i += 1) {
        articleParts = articles[i].title.split(' ').concat(articles[i].text.split(' '));

        nouns = nouns.concat(this.findProperNouns(articleParts, blacklist));
      }

      return nouns;
    },

    findPopularWords : function (articles, blacklist) {
      var nouns    = this.parseArticles(articles, blacklist),
          noun     = '',
          i        = 0,
          weighted = {};

      for (i; i < nouns.length; i += 1) {
        noun            = nouns[i];
        weighted[noun]  = weighted[noun] || 0;
        weighted[noun] += 1;
      }

      return weighted;
    },

    announceTrendingNews : function (deviceId, command, controllers, values, config) {
      var popularWords = [],
          notifyWords  = [],
          notify,
          threshold    = config.threshold      || 10,
          delay        = 60000 * (config.delay || 30),
          blacklist    = config.blacklist      || [],
          lang         = controllers.config.language,
          message      = '',
          word         = '',
          now          = new Date().getTime();

      if ((values) && (values.value) && (values.value[0]) && (values.value[0].title)) {
        popularWords = this.findPopularWords(values.value, blacklist);

        for (word in popularWords) {
          if (popularWords[word] > threshold) {
            if ((!CooldownWords[word]) || ((CooldownWords[word] + delay) < now)) {
              CooldownWords[word] = now;

              notifyWords.push(word);
            }
          }
        }

        if (notifyWords.length) {
          notify  = require(__dirname + '/../lib/notify');

          message = this.translate(notifyWords.length > 1 ? 'TRENDING_WORDS' : 'TRENDING_WORD', lang);
          message = message.split('{{TRENDING}}').join(notifyWords.join(', '));

          notify.notify(message, controllers, deviceId);
        }
      }
    }
  };
}());
