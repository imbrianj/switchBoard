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
 * @fileoverview Unit test for parsers/nest.js
 */

exports.nestParserTest = {
  parser : function (test) {
    'use strict';

    var nestParser  = require(__dirname + '/../../../parsers/nest'),
        markup      = '<h1>Foo</h1> <div>{{NEST_DYNAMIC}}</div>',
        value       = { presence   : 'on',
                        thermostat : { foo  : { label : 'TEST1', temp : 77, target : 76, humidity : 30, state : 'cool' },
                                       bar  : { label : 'TEST2', temp : 80, target : 79, humidity : 25, state : 'off' },
                                       baz  : { label : 'TEST3', temp : 70, target : 73, humidity : 20, state : 'heat' } },
                        protect    : { foo  : { label : 'TEST4', smoke : 'err', co : 'ok',  battery : 'ok' },
                                       bar  : { label : 'TEST5', smoke : 'ok',  co : 'err', battery : 'ok' },
                                       baz  : { label : 'TEST6', smoke : 'ok',  co : 'ok',  battery : 'err' },
                                       bif  : { label : 'TEST7', smoke : 'err', co : 'err',  battery : 'err' },
                                       bang : { label : 'TEST8', smoke : 'ok',  co : 'ok',  battery : 'ok' } }
                      },
        valueTherm  = { presence   : 'on',
                        thermostat : { foo  : { label : 'TEST1', temp : 77, target : 76, humidity : 30, state : 'cool' },
                                       bar  : { label : 'TEST2', temp : 80, target : 79, humidity : 25, state : 'off' },
                                       baz  : { label : 'TEST3', temp : 70, target : 73, humidity : 20, state : 'heat' } }
                     },
        valueSmoke  = { presence   : 'on',
                        protect    : { foo  : { label : 'TEST4', smoke : 'err', co : 'ok',  battery : 'ok' },
                                                      bar  : { label : 'TEST5', smoke : 'ok',  co : 'err', battery : 'ok' },
                                                      baz  : { label : 'TEST6', smoke : 'ok',  co : 'ok',  battery : 'err' },
                                                      bif  : { label : 'TEST7', smoke : 'err', co : 'err',  battery : 'err' },
                                                      bang : { label : 'TEST8', smoke : 'ok',  co : 'ok',  battery : 'ok' } }
                     },
        fragments   = { thermostat : '<li><dl><dt>{{SUB_DEVICE_NAME}}</dt><dd>Temp: {{SUB_DEVICE_TEMP}}</dd><dd>Target: {{SUB_DEVICE_TARGET}}</dd><dd>Humidity: {{SUB_DEVICE_HUMIDITY}}</dd><dd class="cool{{DEVICE_STATE_COOL}}">Cool</dd><dd class="heat{{DEVICE_STATE_HEAT}}">Heat</dd><dd class="heat{{DEVICE_STATE_OFF}}">Off</dd></dl></li>',
                        protect    : '<li class="{{SUB_DEVICE_STATE}}"><dl><dt>{{SUB_DEVICE_NAME}}</dt><dd>Smoke: {{SUB_DEVICE_SMOKE}}</dd><dd>CO: {{SUB_DEVICE_CO}}</dd><dd>Batt: {{SUB_DEVICE_BATT}}</dd></dl></li>',
                        group      : '<li class="{{SUB_DEVICE_CLASS}}"><h4>{{SUB_DEVICE_NAME}}</h4><ul>{{SUB_DEVICE_LIST}}</ul></li>' },
        goodMarkup  = nestParser.nest('dummy', markup, 'ok', value, fragments),
        thermMarkup = nestParser.nest('dummy', markup, 'ok', valueTherm, fragments),
        smokeMarkup = nestParser.nest('dummy', markup, 'ok', valueSmoke, fragments),
        noValue     = nestParser.nest('dummy', markup, 'ok', null,  fragments);

    test.strictEqual(goodMarkup.indexOf('{{'), -1, 'All values replaced');

    test.notStrictEqual(goodMarkup.indexOf('<dt>TEST1</dt><dd>Temp: 77</dd><dd>Target: 76</dd><dd>Humidity: 30</dd><dd class="cool device-active">Cool</dd><dd class="heat">Heat</dd><dd class="heat">Off</dd>', -1), 'Passed markup validated');
    test.notStrictEqual(goodMarkup.indexOf('<dt>TEST2</dt><dd>Temp: 80</dd><dd>Target: 79</dd><dd>Humidity: 25</dd><dd class="cool">Cool</dd><dd class="heat">Heat</dd><dd class="heat device-off">Off</dd>',    -1), 'Passed markup validated');
    test.notStrictEqual(goodMarkup.indexOf('<dt>TEST3</dt><dd>Temp: 70</dd><dd>Target: 73</dd><dd>Humidity: 20</dd><dd class="cool">Cool</dd><dd class="heat device-active">Heat</dd><dd class="heat">Off</dd>', -1), 'Passed markup validated');

    test.notStrictEqual(goodMarkup.indexOf('<li class="smoke device-active"><dl><dt>TEST4</dt><dd>Smoke: err</dd><dd>CO: ok</dd><dd>Batt: ok</dd></dl></li>'),           -1, 'Passed markup validated');
    test.notStrictEqual(goodMarkup.indexOf('<li class="co device-active"><dl><dt>TEST5</dt><dd>Smoke: ok</dd><dd>CO: err</dd><dd>Batt: ok</dd></dl></li>'),              -1, 'Passed markup validated');
    test.notStrictEqual(goodMarkup.indexOf('<li class="batt device-active"><dl><dt>TEST6</dt><dd>Smoke: ok</dd><dd>CO: ok</dd><dd>Batt: err</dd></dl></li>'),            -1, 'Passed markup validated');
    test.notStrictEqual(goodMarkup.indexOf('<li class="smoke co batt device-active"><dl><dt>TEST7</dt><dd>Smoke: err</dd><dd>CO: err</dd><dd>Batt: err</dd></dl></li>'), -1, 'Passed markup validated');
    test.notStrictEqual(goodMarkup.indexOf('<li class=""><dl><dt>TEST8</dt><dd>Smoke: ok</dd><dd>CO: ok</dd><dd>Batt: ok</dd></dl></li>'),                               -1, 'Passed markup validated');

    test.strictEqual(thermMarkup.indexOf('<h4>Protect</h4>'),    -1, 'No indication of smoke detectors if you don\'t have one');
    test.strictEqual(thermMarkup.indexOf('Smoke:'),              -1, 'No indication of smoke detectors if you don\'t have one');

    test.strictEqual(smokeMarkup.indexOf('<h4>Thermostat</h4>'), -1, 'No indication of thermostat if you don\'t have one');
    test.strictEqual(smokeMarkup.indexOf('Temp:'),               -1, 'No indication of thermostat if you don\'t have one');

    test.strictEqual(noValue.indexOf('{{'), -1, 'All values replaced');
    test.strictEqual(noValue, '<h1>Foo</h1> <div></div>', 'Passed markup validated');

    test.done();
  }
};
