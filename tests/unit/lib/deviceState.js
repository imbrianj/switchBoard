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
 * @fileoverview Unit test for deviceState.js
 */

exports.deviceState = {
  getDeviceState : function (test) {
    'use strict';

    var deviceState = require(__dirname + '/../../../lib/deviceState'),
        testFauxDevice,
        allStates;

    deviceState.updateState('faux-device', 'faux-type',  { state : 'ok', value : 100 });
    deviceState.updateState('faux-device2', 'faux-type', { state : 'ok', value : 150 });

    testFauxDevice = deviceState.getDeviceState('faux-device');
    allStates      = deviceState.getDeviceState();

    test.notStrictEqual(parseInt(testFauxDevice.updated, 10), NaN, 'Timestamp should return a number.');
    test.strictEqual(testFauxDevice.value,                    100, 'Returned value should match set value.');
    test.strictEqual(allStates['faux-device'].value,          100, 'Should return all device states');
    test.strictEqual(allStates['faux-device2'].value,         150, 'Should return all device states');

    test.done();
  },

  newState : function (test) {
    'use strict';

    var deviceState = require(__dirname + '/../../../lib/deviceState'),
        fauxDeviceState;

    deviceState.updateState('faux-device', 'faux-type', {});
    fauxDeviceState = deviceState.getDeviceState('faux-device');

    test.notStrictEqual(parseInt(fauxDeviceState.value.updated, 10), NaN, 'Timestamp should return a number.');

    test.done();
  },

  updateState : function (test) {
    'use strict';

    var deviceState    = require(__dirname + '/../../../lib/deviceState'),
        newDeviceState,
        existingState;

    deviceState.updateState('faux-device',     'faux-type', {});
    deviceState.updateState('existing-device', 'faux-type', { value : 50 });
    deviceState.updateState('faux-device',     'faux-type', { state : 'ok', value : 100 });
    newDeviceState = deviceState.getDeviceState('faux-device');
    deviceState.updateState('existing-device', 'existing-type', {});
    existingState  = deviceState.getDeviceState('existing-device');

    test.strictEqual(newDeviceState.state, 'ok', 'Device state should have been set to ok');
    test.strictEqual(newDeviceState.value, 100,  'Device value should have been set to 100');
    test.notStrictEqual(parseInt(newDeviceState.updated, 10), NaN, 'Timestamp should return a number.');

    test.strictEqual(existingState.state, 'err', 'Device state should have been set to err since no ok had been sent');
    test.strictEqual(existingState.value, 50,    'Device value should have been kept at 50 since no updated had been made');
    test.notStrictEqual(parseInt(existingState.updated, 10), NaN, 'Timestamp should return a number.');

    test.done();
  }
};
