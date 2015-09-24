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
 * @fileoverview Unit test for devices/activeBuilding/parsers.js
 */

exports.activeBuildingParserTest = {
  parser : function (test) {
    'use strict';

    var activeBuildingParser = require(__dirname + '/../../../../devices/activeBuilding/parser'),
        markup               = '<h1>Foo</h1> <div>{{ACTIVEBUILDING_DYNAMIC}}</div>',
        singleMarkup         = activeBuildingParser.activeBuilding('dummy', markup, 'ok', ['USPS'], 'en'),
        pluralMarkup         = activeBuildingParser.activeBuilding('dummy', markup, 'ok', ['FedEx', 'Dry Cleaning'], 'en'),
        badMarkup            = activeBuildingParser.activeBuilding('dummy', markup, 'ok', null,  'en');

    test.strictEqual(singleMarkup.indexOf('{{'), -1, 'All values replaced');
    test.strictEqual(singleMarkup, '<h1>Foo</h1> <div>You have a package from: USPS</div>',               'Passed markup validated');
    test.strictEqual(pluralMarkup.indexOf('{{'), -1, 'All values replaced');
    test.strictEqual(pluralMarkup, '<h1>Foo</h1> <div>You have packages from: FedEx and Dry Cleaning</div>', 'Passed markup validated');
    test.strictEqual(badMarkup.indexOf('{{'),    -1, 'All values replaced');
    test.strictEqual(badMarkup, '<h1>Foo</h1> <div>No packages available.</div>',                         'Passed markup validated');

    test.done();
  }
};
