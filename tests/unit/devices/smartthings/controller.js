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
 * @fileoverview Unit test for devices/smartthings/controller.js
 */

exports.smartthingsControllerTest = {
  fragments : function (test) {
    'use strict';

    var smartthingsController = require(__dirname + '/../../../../devices/smartthings/controller'),
        fragments             = smartthingsController.fragments();

    test.strictEqual(typeof fragments.group,  'string', 'Group fragment verified');
    test.strictEqual(typeof fragments.action, 'string', 'Action fragment verified');
    test.strictEqual(typeof fragments.static, 'string', 'Static fragment verified');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var smartthingsController = require(__dirname + '/../../../../devices/smartthings/controller'),
        config                = { host    : 'TEST-host',
                                  port    : '443',
                                  path    : '/TEST/',
                                  method  : 'GET',
                                  badData : 'FAILURE' },
        testPostPrepare       = smartthingsController.postPrepare(config);

    test.deepEqual(testPostPrepare, { host : 'TEST-host', port : '443', path : '/TEST/', method : 'GET', headers : { 'Accept': 'application/json', 'Accept-Charset' : 'utf-8', 'User-Agent' : 'node-switchBoard' } }, 'Additional params are filtered out.');

    test.done();
  },

  updateState : function (test) {
    'use strict';

    var smartthingsController = require(__dirname + '/../../../../devices/smartthings/controller'),
        deviceState           = require(__dirname + '/../../../../lib/deviceState'),
        now                   = new Date(),
        smartthings           = { deviceId : 'FOO' },
        response              = { mode     : 'Home',
                                  devices  : [
                                    {
                                      id     : '01234567890',
                                      label  : 'Test Switch',
                                      values : {
                                        switch : {
                                          value : 'on'
                                        }
                                      }
                                    },
                                    {
                                      id     : '09876543210',
                                      label  : 'Test Door',
                                      values : {
                                        contact : {
                                          value : 'closed'
                                        },
                                        battery : {
                                          value: '55'
                                        },
                                        temperature : {
                                          value : '72'
                                        }
                                      }
                                    }
                                  ]
                                },
        newState;

    deviceState.updateState('FOO', 'smartthings', { state : 'ok' });
    smartthingsController.updateState(smartthings, response);
    newState = deviceState.getDeviceState('FOO');

    test.strictEqual(newState.value.devices[0].type,              'switch',  'The first device is a switch');
    test.strictEqual(newState.value.devices[0].peripheral,        undefined, 'The first device has no peripheral');
    test.strictEqual(newState.value.devices[1].type,              'contact', 'The first device is a contact sensor');
    test.strictEqual(newState.value.devices[1].peripheral.temp,    72,       'The second device has a peripheral function');
    test.strictEqual(newState.value.devices[1].peripheral.battery, 55,       'The second device has a battery');
    test.strictEqual(newState.updated > (Math.round(now.getTime() / 1000) - 1),       true,     'State object should be newer than the initial time');

    test.done();
  },

  findSubDevice : function (test) {
    'use strict';

    var smartthingsController = require(__dirname + '/../../../../devices/smartthings/controller'),
        subDevicesRepeat      = { 0 : { label : 'Some Light' }, 1 : { label : 'Some Light' }, 2 : { label : 'Light 3' } },
        subDevicesUnique      = { 0 : { label : 'Light 1' },    1 : { label : 'Light 2' },    2 : { label : 'Light 3' } },
        testSubDevicesRepeat  = smartthingsController.findSubDevices('Some Light', subDevicesRepeat),
        testSubDevicesUnique  = smartthingsController.findSubDevices('Light 2',    subDevicesUnique);

    test.deepEqual(testSubDevicesRepeat, [{ label: 'Some Light' }, { label: 'Some Light' }], 'Two lights should be returned if they both have the same name');
    test.deepEqual(testSubDevicesUnique, [{ label: 'Light 2' }],                             'Only one light is returned as its unique');

    test.done();
  },

  getDevicePath : function (test) {
    'use strict';

    var stState = { state : 'ok',
                    value : {
                      devices : {
                        0 : { id    : '01234567890',
                              label : 'Test Switch',
                              type  : 'switch',
                              state : 'off' },
                        1 : { id    : '09876543210',
                              label : 'Test Door',
                              type  : 'contact',
                              state : 'off',
                              peripheral : { temp: 72 } } } } };

    var smartthingsController = require(__dirname + '/../../../../devices/smartthings/controller'),
        deviceState           = require(__dirname + '/../../../../lib/deviceState'),
        callback              = function (err, state) {
          var stStateClone = JSON.parse(JSON.stringify(stState));

          stStateClone.value = state;

          deviceState.updateState('FOO', 'smartthings', stStateClone);
        },
        smartthings           = { device : { deviceId : 'FOO' } },
        finalState;

    deviceState.updateState('FOO', 'smartthings', stState);
    smartthingsController.getDevicePath('state-switch-Test Switch-on', smartthings, callback);
    smartthingsController.getDevicePath('state-contact-Test Door-on',  smartthings, callback);

    finalState = deviceState.getDeviceState('FOO');

    test.strictEqual(finalState.value.devices[0].state, 'on', 'The first device should now be on');
    test.strictEqual(finalState.value.devices[1].state, 'on', 'The second device should now be open');

    test.done();
  }
};
