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
 * @fileoverview Unit test for controllers/weather.js
 */

State = {};

exports.weatherControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var weatherController = require(__dirname + '/../../../controllers/weather'),
        config            = { host    : 'TEST-host',
                              port    : '443',
                              path    : '/TEST/',
                              method  : 'GET',
                              badData : 'FAILURE' },
        testData          = weatherController.postPrepare(config);

    test.deepEqual(testData, { host : 'TEST-host', port : '443', path : '/TEST/', method : 'GET' }, 'Additional params are filtered out.');

    test.done();
  },

  onload : function(test) {
    'use strict';

    State.FOO       = {};
    State.FOO.state = 'ok';
    State.FOO.value = 'Error';

    var weatherController = require(__dirname + '/../../../controllers/weather'),
        onloadMarkup      = weatherController.onload({ markup : '<div class="weather{{DEVICE_STATE}}"><h1>{{WEATHER_CURRENT}}</h1></div>',
                                                       config : { deviceId : 'FOO' } });

    test.ok((onloadMarkup.indexOf('Looks like something went wrong') !== -1), 'Passed markup validated');

    State.FOO.value = { code : '47',
                        city : 'Seattle',
                        temp : 75,
                        text : 'Lightning Storm',
                        forecast : {
                          '1' : {
                            code : 32,
                            day  : 'Friday',
                            text : 'Sunny',
                            high : 75,
                            low  : 65
                          }
                        }};

    onloadMarkup = weatherController.onload({ markup : '<div class="weather{{DEVICE_STATE}}"><h1>{{WEATHER_CURRENT}}</h1><ul>{{WEATHER_FORECAST}}</ul></div>',
                                              config : { deviceId : 'FOO' } });

    test.ok((onloadMarkup.indexOf('<span class="fa fa-bolt"></span> Seattle Current Weather: 75&deg; Lightning Storm') !== -1), 'Current weather populated');
    test.ok((onloadMarkup.indexOf('<span class="fa fa-sun-o"></span> Friday: Sunny 75&deg;/65&deg;')                   !== -1),'Forecast weather populated');

    test.done();
  }
};
