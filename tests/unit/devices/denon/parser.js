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
 * @fileoverview Unit test for devices/denon/parser.js
 */

exports.denonParserTest = {
  parser : function (test) {
    'use strict';

    var denonParser = require(__dirname + '/../../../../devices/denon/parser'),
        markup      = '<dl><dt>Foo</dt><dd>Vol: {{DEVICE_Z1_VOLUME}}</dd><dd>Input: {{DEVICE_Z1_INPUT}}</dd><dd>Power: {{DEVICE_Z3_POWER}}</dd></dl>',
        goodMarkup  = denonParser.denon('dummy', markup, 'ok', { ZONE1 : { volume : 50, input : 3 }, ZONE3: { power : 'on' } }),
        badMarkup   = denonParser.denon('dummy', markup, 'ok', null);

    test.strictEqual(goodMarkup.indexOf('{{'),  -1, 'All values replaced');
    test.notStrictEqual(goodMarkup.indexOf('<dl><dt>Foo</dt><dd>Vol: 50</dd><dd>Input: 3</dd><dd>Power: on</dd></dl>'), -1, 'Passed markup validated');
    test.strictEqual(badMarkup.indexOf('{{'),   -1, 'All values replaced');
    test.notStrictEqual(badMarkup.indexOf('<dl><dt>Foo</dt><dd>Vol: </dd><dd>Input: </dd><dd>Power: </dd></dl>'),       -1, 'Passed markup validated');

    test.done();
  }
};
