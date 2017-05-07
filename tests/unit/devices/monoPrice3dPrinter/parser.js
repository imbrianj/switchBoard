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
 * @fileoverview Unit test for devices/monoPrice3dPrinter/parser.js
 */

exports.monoPrice3dPrinterParserTest = {
  parser : function (test) {
    'use strict';

    var monoPrice3dPrinterParser = require(__dirname + '/../../../../devices/monoPrice3dPrinter/parser'),
        markup     = '<h1>Foo</h1> <ul><li>{{EXTRUDER_TEMP}}/{{EXTRUDER_TARGET}}</li><li>{{BED_TEMP}}/{{BED_TARGET}}</li><li>{{PERCENT_COMPLETE}}%</li></ul>',
        value      = { extruderTemp   : '190',
                       extruderTarget : '195',
                       bedTemp        : '29',
                       bedTarget      : '0',
                       percent        : '7' },
        goodMarkup = monoPrice3dPrinterParser.monoPrice3dPrinter('dummy', markup, 'ok', value),
        noValue    = monoPrice3dPrinterParser.monoPrice3dPrinter('dummy', markup, 'ok', null);

    test.strictEqual(goodMarkup.indexOf('{{'),                  -1, 'All values replaced');
    test.notStrictEqual(goodMarkup.indexOf('<li>190/195</li>'), -1, 'Passed markup validated1');
    test.notStrictEqual(goodMarkup.indexOf('<li>29/0</li>'),    -1, 'Passed markup validated2');
    test.notStrictEqual(goodMarkup.indexOf('<li>7%</li>'),      -1, 'Passed markup validated2');
    test.strictEqual(noValue.indexOf('{{'),                     -1, 'All values replaced');

    test.done();
  }
};
