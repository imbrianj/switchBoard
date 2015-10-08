/*jslint white: true */
/*global module, require, console */

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
 * @fileoverview Announce when a new RSS or Atom feed article becomes available.
 */

module.exports = (function () {
  'use strict';

  var RssArticles = '';

  return {
    version : 20151009,

    translate : function(token, lang) {
      var translate = require(__dirname + '/../lib/translate');

      return translate.translate('{{i18n_' + token + '}}', 'rss', lang);
    },

    announceRss : function(device, command, controllers, values, config) {
      var sharedUtil   = require(__dirname + '/../lib/sharedUtil').util,
          deviceState  = require(__dirname + '/../lib/deviceState'),
          rssState     = deviceState.getDeviceState(device),
          articleTitle = '',
          notify,
          runCommand,
          lang         = controllers.config.language,
          message      = '';

      if((values) && (values.value) && (values.value[0]) && (values.value[0].title)) {
        articleTitle = values.value[0].title;

        if(RssArticles !== articleTitle) {
          if((articleTitle) && (RssArticles)) {
            notify     = require(__dirname + '/../lib/notify');
            runCommand = require(__dirname + '/../lib/runCommand');

            message = this.translate('NEW_ARTICLE', lang);
            message = message.split('{{DEVICE}}').join(controllers[device].config.title);
            message = message.split('{{TITLE}}').join(articleTitle);

            notify.notify(message, controllers, device);
          }

          RssArticles = articleTitle;
        }
      }
    }
  };
}());
