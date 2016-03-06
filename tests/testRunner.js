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
 * @fileoverview Unit test runner.
 */

module.exports = (function () {
  'use strict';

  var reporter = require('nodeunit').reporters.default;

  reporter.run(['tests/unit/apps/gerty/activeBuilding.js',
                'tests/unit/apps/gerty/entertainment.js',
                'tests/unit/apps/gerty/language.js',
                'tests/unit/apps/gerty/mood.js',
                'tests/unit/apps/gerty/nest.js',
                'tests/unit/apps/gerty/smartthings.js',
                'tests/unit/apps/gerty/stereo.js',
                'tests/unit/apps/gerty/stocks.js',
                'tests/unit/apps/gerty/travis.js',
                'tests/unit/apps/gerty/tv.js',
                'tests/unit/apps/gerty/weather.js',
                'tests/unit/devices/activeBuilding/controller.js',
                'tests/unit/devices/denon/controller.js',
                'tests/unit/devices/foscam/controller.js',
                'tests/unit/devices/gerty/controller.js',
                'tests/unit/devices/github/controller.js',
                'tests/unit/devices/lg/controller.js',
                'tests/unit/devices/mp3/controller.js',
                'tests/unit/devices/location/controller.js',
                'tests/unit/devices/nest/controller.js',
                'tests/unit/devices/panasonic/controller.js',
                'tests/unit/devices/pioneer/controller.js',
                'tests/unit/devices/ps3/controller.js',
                'tests/unit/devices/pushover/controller.js',
                'tests/unit/devices/raspberryRemote/controller.js',
                'tests/unit/devices/roku/controller.js',
                'tests/unit/devices/rss/controller.js',
                'tests/unit/devices/samsung/controller.js',
                'tests/unit/devices/smartthings/controller.js',
                'tests/unit/devices/sms/controller.js',
                'tests/unit/devices/speech/controller.js',
                'tests/unit/devices/sports/controller.js',
                'tests/unit/devices/stocks/controller.js',
                'tests/unit/devices/traffic/controller.js',
                'tests/unit/devices/travis/controller.js',
                'tests/unit/devices/twitter/controller.js',
                'tests/unit/devices/weather/controller.js',
                'tests/unit/devices/wemo/controller.js',
                'tests/unit/devices/xbmc/controller.js',
                'tests/unit/lib/deviceState.js',
                'tests/unit/lib/loadController.js',
                'tests/unit/lib/loadMarkup.js',
                'tests/unit/lib/runCommand.js',
                'tests/unit/lib/schedule.js',
                'tests/unit/lib/staticAssets.js',
                'tests/unit/lib/translate.js',
                'tests/unit/devices/activeBuilding/parser.js',
                'tests/unit/devices/debug/parser.js',
                'tests/unit/devices/denon/parser.js',
                'tests/unit/devices/foscam/parser.js',
                'tests/unit/devices/gerty/parser.js',
                'tests/unit/devices/github/parser.js',
                'tests/unit/devices/location/parser.js',
                'tests/unit/devices/nest/parser.js',
                'tests/unit/devices/raspberryRemote/parser.js',
                'tests/unit/devices/roku/parser.js',
                'tests/unit/devices/rss/parser.js',
                'tests/unit/devices/smartthings/parser.js',
                'tests/unit/devices/sports/parser.js',
                'tests/unit/devices/stocks/parser.js',
                'tests/unit/devices/traffic/parser.js',
                'tests/unit/devices/travis/parser.js',
                'tests/unit/devices/twitter/parser.js',
                'tests/unit/devices/weather/parser.js',
                'tests/unit/devices/website/parser.js',
                'tests/unit/devices/wemo/parser.js',
                'tests/unit/devices/xbmc/parser.js',
                'tests/unit/js/combo.min.js']);
}());
