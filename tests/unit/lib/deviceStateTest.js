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
 * @fileoverview Unit test for deviceState.js
 */

State = {};

exports.deviceState = {
  newState : function(test) {
    'use strict';

    var deviceState   = require('../../../lib/deviceState'),
        newFauxDevice = deviceState.updateState('faux-device', {});

    test.notEqual(parseInt(State['faux-device'].updated, 10), NaN, 'Timestamp should return a number.');

    test.done();
  },

  updateState : function(test) {
    'use strict';

    State['faux-device']     = {};
    State['existing-device'] = { value : 50 };

    var deviceState = require('../../../lib/deviceState'),
        device      = deviceState.updateState('faux-device', { state : 'ok', value : 100 }),
        existing    = deviceState.updateState('existing-device', {});

    test.equal(State['faux-device'].state, 'ok', 'Device state should have been set to ok');
    test.equal(State['faux-device'].value, 100,  'Device value should have been set to 100');
    test.notEqual(parseInt(State['faux-device'].updated, 10), NaN, 'Timestamp should return a number.');

    test.equal(State['existing-device'].state, 'err', 'Device state should have been set to err since no ok had been sent');
    test.equal(State['existing-device'].value, 50,    'Device value should have been kept at 50 since no updated had been made');
    test.notEqual(parseInt(State['existing-device'].updated, 10), NaN, 'Timestamp should return a number.');

    test.done();
  }
};
