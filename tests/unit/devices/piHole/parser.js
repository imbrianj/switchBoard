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
 * @fileoverview Unit test for devices/piHole/parser.js
 */

exports.piHoleParserTest = {
  parser : function (test) {
    'use strict';

    var piHoleParser = require(__dirname + '/../../../../devices/piHole/parser'),
        markup     = '<h1>Foo</h1> <div>{{PIHOLE_UPDATE}}, {{PIHOLE_QUERIES_TODAY}}, {{PIHOLE_QUERIES_BLOCKED_TODAY}}, {{PIHOLE_PERCENT_BLOCKED_TODAY}}, {{PIHOLE_DOMAINS_BLOCKED}}</div>',
        value      = { lastUpdate          : 1556421306000,
                       queriesToday        : '125,500',
                       queriesBlockedToday : '99,999',
                       percentBlockedToday : '15.5',
                       domainsBlocked      : '111,810' },
        goodMarkup = piHoleParser.piHole('dummy', markup, 'ok', value),
        noValue    = piHoleParser.piHole('dummy', markup, 'ok', null);

    test.strictEqual(goodMarkup.indexOf('{{'),                                -1, 'All values replaced');
    test.notStrictEqual(goodMarkup.indexOf('125,500, 99,999, 15.5, 111,810'), -1, 'Passed markup validated');
    test.strictEqual(noValue.indexOf('{{'),                                   -1, 'Confirmation');

    test.done();
  }
};
