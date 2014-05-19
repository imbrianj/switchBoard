/*jslint white: true */
/*global State, module, String, require, console */

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
 * @fileoverview Unit test runner.
 */

module.exports = (function () {
  var reporter = require('nodeunit').reporters.default;

  reporter.run(['tests/unit/lib/loadControllerTest.js',
                'tests/unit/lib/loadMarkupTest.js',
                'tests/unit/lib/runCommandTest.js',
                'tests/unit/lib/staticAssetsTest.js',
                'tests/unit/controllers/foscamTest.js',
                'tests/unit/controllers/mp3Test.js',
                'tests/unit/controllers/ps3Test.js',
                'tests/unit/controllers/rokuTest.js',
                'tests/unit/controllers/samsungTest.js',
                'tests/unit/controllers/speechTest.js',
                'tests/unit/controllers/stocksTest.js',
                'tests/unit/controllers/weatherTest.js',
                'tests/unit/events/scheduleTest.js']);
}());
