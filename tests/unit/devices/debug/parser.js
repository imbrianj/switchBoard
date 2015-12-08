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
 * @fileoverview Unit test for devices/debug/parser.js
 */

exports.debugParserTest = {
  parser : function (test) {
    'use strict';

    var debugParser = require(__dirname + '/../../../../devices/debug/parser'),
        markup      = '<h1>Foo</h1> <div>{{DEBUG_UPDATE}} {{DEBUG_UPTIME}} {{DEBUG_RUNTIME}} {{DEBUG_MEMORY_USED}} {{DEBUG_MEMORY_PERCENT}}%</div>',
        value       = { clientCount: 1,
                        cpuLoad: [5, 10, 15],
                        freeMemory: 99,
                        memoryUsed: 3853,
                        percentMemory: 97,
                        startup: 1449558084357,
                        totalMemory: 3952,
                        uptime: 3764084 },
        goodMarkup  = debugParser.debug('dummy', markup, 'ok', value),
        noValue     = debugParser.debug('dummy', markup, 'ok', null);

    test.strictEqual(goodMarkup.indexOf('{{'),     -1, 'All values replaced');
    test.notStrictEqual(goodMarkup.indexOf('97%'), -1, 'Passed markup validated1');
    test.strictEqual(noValue.indexOf('{{'),        -1, 'All values replaced');
    test.notStrictEqual(noValue.indexOf(' 0%'),    -1, 'Passed markup validated');

    test.done();
  }
};
