/*jslint white: true */
/*global module, String, require, console */

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
 * @fileoverview Unit test for translate.js
 */

exports.translateTest = {
  findSynonyms : function (test) {
    'use strict';

    var translate = require('../../../lib/translate');

    test.deepEqual(translate.findSynonyms('gerty', 'en').SAD, ['Sad', 'Bummed', 'Upset', 'Depressed'], 'Found Synonyms');

    test.done();
  },

  translate : function(test) {
    'use strict';

    var translate = require('../../../lib/translate'),
        message   = 'This is {{FOO}} an {{i18n_OK}} {{i18n_POWER}} {{i18n_PLAY}} for {{i18n_PROTECT}} against {{i18n_SMOKE}}';

    test.strictEqual(translate.translate(message, 'nest', 'en'),     'This is {{FOO}} an OK Power Play for Protect against Smoke', 'Translate works for both common and device specific.');
    test.strictEqual(translate.translate(message, 'nest', 'en-FOO'), 'This is {{FOO}} an OK Power Play for Protect against Smoke', 'Translate shouldn\'t die with a bad language sent.');
    test.strictEqual(translate.translate('',      'nest', 'en'),     '',                                                           'Translate shouldn\'t die with a bad string sent.');

    test.done();
  }
};
