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
 * @fileoverview Unit test for apps/gerty/nest.js
 */

exports.nestTest = {
  nest : function (test) {
    'use strict';

    var nest        = require(__dirname + '/../../../../apps/gerty/nest'),
        device      = { value : { presence : 'on',
                                  devices  : {
                                   0 : { label : 'TEST1', temp : 77, target : 76, humidity : 30, state : 'cool', type : 'thermostat' },
                                   1 : { label : 'TEST2', temp : 80, target : 79, humidity : 25, state : 'off',  type : 'thermostat' },
                                   2 : { label : 'TEST3', temp : 70, target : 73, humidity : 20, state : 'heat', type : 'thermostat' },
                                   3 : { label : 'TEST4', smoke : 'err', co : 'ok',   battery : 'ok',  type : 'protect' },
                                   4 : { label : 'TEST5', smoke : 'ok',  co : 'err',  battery : 'ok',  type : 'protect' },
                                   5 : { label : 'TEST6', smoke : 'ok',  co : 'ok',   battery : 'err', type : 'protect' },
                                   6 : { label : 'TEST8', smoke : 'ok',  co : 'ok',   battery : 'ok',  type : 'protect' }
                                 }
                               } },
        deviceAlarm = nest.nest(device),
        deviceOk,
        deviceAway;

    device.value.devices[3].smoke   = 'ok';
    device.value.devices[4].co      = 'ok';
    device.value.devices[5].battery = 'ok';
    deviceOk = nest.nest(device);

    device.value.presence = 'off';
    device.value.devices[0].temp = 100;
    device.value.devices[1].temp = 90;
    device.value.devices[2].temp = 93;
    deviceAway = nest.nest(device);

    test.deepEqual(deviceAlarm, { social: 1,  comfortable: -3,                 scared: -20 }, 'A bunch of alarms going off.  Freak out');
    test.deepEqual(deviceOk,    { social: 1,  comfortable: 0,                  scared: 0 },   'Not much going on here');
    test.deepEqual(deviceAway,  { social: -5, comfortable: -4.777777777777776, scared: 0 },   'Nobody home.  And it\'s crazy hot');

    test.done();
  }
};
