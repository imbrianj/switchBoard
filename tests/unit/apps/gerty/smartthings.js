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
 * @fileoverview Unit test for apps/gerty/smartthings.js
 */

exports.smartthingsTest = {
  smartthings : function (test) {
    'use strict';

    var smartthings = require(__dirname + '/../../../../apps/gerty/smartthings'),
        devices     = { value : { devices : { 'FOO'  : { type : 'switch',   state : 'on',  label : 'Label Foo' },
                                              'BAR'  : { type : 'lock',     state : 'off', label : 'Label Bar' },
                                              'BAZ'  : { type : 'contact',  state : 'on',  label : 'Label Baz', peripheral : { temp : 70 } },
                                              'BANG' : { type : 'water',    state : 'off', label : 'Label Bang' },
                                              'BIF'  : { type : 'motion',   state : 'off', label : 'Label Bif' },
                                              'BAM'  : { type : 'presence', state : 'on',  label : 'Label Bam + Temp', peripheral : { temp : 70 } }
                                            },
                                  mode    : 'Home'
                                },
                      },
        deviceHome  = smartthings.smartthings(devices),
        deviceSleep,
        deviceAway;

    devices.value.mode = 'Night';
    deviceSleep = smartthings.smartthings(devices);

    devices.value.mode = 'Away';
    devices.value.devices.BAM.state = 'off';
    devices.value.devices.BAZ.peripheral.temp = 40;
    deviceAway = smartthings.smartthings(devices);

    test.deepEqual(deviceHome,  { social : 6,   comfortable : 4 },   'All is well in the world.  People are home and the temperature is comfortable');
    test.deepEqual(deviceSleep, { social : 5,   comfortable : 104 }, 'I\'m asleep - so I\'m very comfortable, but not as social');
    test.deepEqual(deviceAway,  { social : -15, comfortable : 0 },   'I\'m away - so I\'m not social.  It\'s also really cold in one room');

    test.done();
  }
};
