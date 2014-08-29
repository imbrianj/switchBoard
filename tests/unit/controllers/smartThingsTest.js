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
 * @fileoverview Unit test for controllers/smartthings.js
 */

State = {};

exports.smartthingsControllerTest = {
  fragments : function(test) {
    'use strict';

    var smartthingsController = require(__dirname + '/../../../controllers/smartthings'),
        fragments             = smartthingsController.fragments();

    test.strictEqual(typeof fragments.group,    'string', 'Group fragment verified');
    test.strictEqual(typeof fragments.lock,     'string', 'Lock fragment verified');
    test.strictEqual(typeof fragments.switch,   'string', 'Switch fragment verified');
    test.strictEqual(typeof fragments.contact,  'string', 'Contact fragment verified');
    test.strictEqual(typeof fragments.water,    'string', 'Water fragment verified');
    test.strictEqual(typeof fragments.motion,   'string', 'Motion fragment verified');
    test.strictEqual(typeof fragments.presence, 'string', 'Presence fragment verified');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var smartthingsController = require(__dirname + '/../../../controllers/smartthings'),
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

    State.FOO       = {};
    State.FOO.state = 'ok';

    var smartthingsController = require(__dirname + '/../../../controllers/smartthings'),
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

                                        temperature : {
                                          value : 72
                                        }
                                      }
                                    }
                                  ]
                                };

    smartthingsController.updateState(smartthings, response);

    test.strictEqual(State.FOO.value.devices[0].type,           'switch',  'The first device is a switch');
    test.strictEqual(State.FOO.value.devices[1].type,           'contact', 'The first device is a contact sensor');
    test.strictEqual(State.FOO.value.devices[1].peripheral.temp, 72,       'The second device has a peripheral function');
    test.strictEqual(State.FOO.updated > (now.getTime() - 1),    true,     'State object should be newer than the initial time');

    test.done();
  },

  findSubDevice : function (test) {
    'use strict';

    var smartthingsController = require(__dirname + '/../../../controllers/smartthings'),
        config                = { host    : 'TEST-host',
                                  port    : '443',
                                  path    : '/TEST/',
                                  method  : 'GET',
                                  badData : 'FAILURE' },
        subDevicesRepeat      = { 0 : { label : 'Some Light' }, 1 : { label : 'Some Light' }, 2 : { label : 'Light 3' } },
        subDevicesUnique      = { 0 : { label : 'Light 1' },    1 : { label : 'Light 2' },    2 : { label : 'Light 3' } },
        testSubDevicesRepeat  = smartthingsController.findSubDevices('Some Light', subDevicesRepeat),
        testSubDevicesUnique  = smartthingsController.findSubDevices('Light 2',    subDevicesUnique);

    test.deepEqual(testSubDevicesRepeat, [ { label: 'Some Light' }, { label: 'Some Light' } ], 'Two lights should be returned if they both have the same name');
    test.deepEqual(testSubDevicesUnique, [ { label: 'Light 2' } ],                             'Only one light is returned as its unique');

    test.done();
  },

  getDevicePath : function (test) {
    'use strict';

    State.FOO       = {};
    State.FOO.state = 'ok';
    State.FOO.value = { devices :
                         { 0 : { id    : '01234567890',
                                 label : 'Test Switch',
                                 type  : 'switch',
                                 state : 'off' },
                           1 : { id    : '09876543210',
                                 label : 'Test Door',
                                 type  : 'contact',
                                 state : 'off',
                                 peripheral : { temp: 72 } } } };

    var smartthingsController = require(__dirname + '/../../../controllers/smartthings'),
        smartthings           = { device : { deviceId : 'FOO' } },
        switchState           = smartthingsController.getDevicePath('state-switch-Test Switch-on', smartthings),
        contactState          = smartthingsController.getDevicePath('state-contact-Test Door-on', smartthings);

    test.strictEqual(State.FOO.value.devices[0].state, 'on', 'The first device should now be on');
    test.strictEqual(State.FOO.value.devices[1].state, 'on', 'The second device should now be open');

    test.done();
  }
};
