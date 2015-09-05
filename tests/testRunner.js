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

  reporter.run(['tests/unit/apps/gerty/activeBuildingTest.js',
                'tests/unit/apps/gerty/entertainmentTest.js',
                'tests/unit/apps/gerty/languageTest.js',
                'tests/unit/apps/gerty/moodTest.js',
                'tests/unit/apps/gerty/nestTest.js',
                'tests/unit/apps/gerty/smartthingsTest.js',
                'tests/unit/apps/gerty/stereoTest.js',
                'tests/unit/apps/gerty/stocksTest.js',
                'tests/unit/apps/gerty/travisTest.js',
                'tests/unit/apps/gerty/tvTest.js',
                'tests/unit/apps/gerty/weatherTest.js',
                'tests/unit/controllers/activeBuildingTest.js',
                'tests/unit/controllers/denonTest.js',
                'tests/unit/controllers/foscamTest.js',
                'tests/unit/controllers/gertyTest.js',
                'tests/unit/controllers/lgTest.js',
                'tests/unit/controllers/mp3Test.js',
                'tests/unit/controllers/nestTest.js',
                'tests/unit/controllers/panasonicTest.js',
                'tests/unit/controllers/pioneerTest.js',
                'tests/unit/controllers/ps3Test.js',
                'tests/unit/controllers/pushoverTest.js',
                'tests/unit/controllers/raspberryRemoteTest.js',
                'tests/unit/controllers/rokuTest.js',
                'tests/unit/controllers/rssTest.js',
                'tests/unit/controllers/samsungTest.js',
                'tests/unit/controllers/smartThingsTest.js',
                'tests/unit/controllers/smsTest.js',
                'tests/unit/controllers/speechTest.js',
                'tests/unit/controllers/stocksTest.js',
                'tests/unit/controllers/trafficTest.js',
                'tests/unit/controllers/travisTest.js',
                'tests/unit/controllers/weatherTest.js',
                'tests/unit/controllers/wemoTest.js',
                'tests/unit/controllers/xbmcTest.js',
                'tests/unit/lib/deviceStateTest.js',
                'tests/unit/lib/loadControllerTest.js',
                'tests/unit/lib/loadMarkupTest.js',
                'tests/unit/lib/runCommandTest.js',
                'tests/unit/lib/scheduleTest.js',
                'tests/unit/lib/staticAssetsTest.js',
                'test/unit/lib/translateTest.js',
                'tests/unit/parsers/activeBuildingTest.js',
                'tests/unit/parsers/denonTest.js',
                'tests/unit/parsers/foscamTest.js',
                'tests/unit/parsers/gertyTest.js',
                'tests/unit/parsers/nestTest.js',
                'tests/unit/parsers/raspberryRemoteTest.js',
                'tests/unit/parsers/rokuTest.js',
                'tests/unit/parsers/rssTest.js',
                'tests/unit/parsers/smartthingsTest.js',
                'tests/unit/parsers/stocksTest.js',
                'tests/unit/parsers/trafficTest.js',
                'tests/unit/parsers/travisTest.js',
                'tests/unit/parsers/weatherTest.js',
                'tests/unit/parsers/wemoTest.js',
                'tests/unit/parsers/xbmcTest.js',
                'tests/unit/js/commonTest.js']);
}());
