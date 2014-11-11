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
 * @fileoverview Unit test for parsers/xbmc.js
 */

exports.xbmcParserTest = {
  parser : function (test) {
    'use strict';

    var xbmcParser = require(__dirname + '/../../../parsers/xbmc'),
        markup     = '<h1>Foo</h1> <div>{{DEVICE_CURRENT}}</div>',
        value      = { current : 'Some Value' },
        goodMarkup = xbmcParser.xbmc('dummy', markup, 'ok', value),
        noValue    = xbmcParser.xbmc('dummy', markup, 'ok', null);

    test.strictEqual(goodMarkup.indexOf('{{'), -1, 'All values replaced');

    test.strictEqual(goodMarkup, '<h1>Foo</h1> <div>Some Value</div>', 'Passed markup validation 1');
    test.strictEqual(noValue.indexOf('{{'), -1,                        'All values replaced');
    test.strictEqual(noValue,    '<h1>Foo</h1> <div></div>',           'Passed markup validated 2');

    test.done();
  }
};
