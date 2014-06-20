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
 * @fileoverview Unit test for controllers/foscam.js
 */

State = {};

exports.foscamControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var foscamController = require(__dirname + '/../../../controllers/foscam'),
        testAlarm        = foscamController.postPrepare({ deviceIp   : 'TEST-host',
                                                          devicePort : 80,
                                                          username   : 'TEST-username',
                                                          password   : 'TEST-password',
                                                          command    : 'AlarmOn' }),
        testPreset       = foscamController.postPrepare({ deviceIp   : 'TEST-host',
                                                          devicePort : 80,
                                                          username   : 'TEST-username',
                                                          password   : 'TEST-password',
                                                          command    : 'Preset2' }),
        testUp           = foscamController.postPrepare({ deviceIp   : 'TEST-host',
                                                          devicePort : 80,
                                                          username   : 'TEST-username',
                                                          password   : 'TEST-password',
                                                          command    : 'Up' }),
        testTake         = foscamController.postPrepare({ deviceIp   : 'TEST-host',
                                                          devicePort : 80,
                                                          username   : 'TEST-username',
                                                          password   : 'TEST-password',
                                                          command    : 'Take' });

    test.deepEqual(testAlarm, { host   : 'TEST-host',
                                port   : 80,
                                path   : '/set_alarm.cgi?user=TEST-username&amp;pwd=TEST-password&amp;motion_armed=1',
                                method : 'GET' }, 'Additional params are filtered out.');

    test.deepEqual(testPreset, { host   : 'TEST-host',
                                 port   : 80,
                                 path   : '/decoder_control.cgi?user=TEST-username&amp;pwd=TEST-password&amp;command=33',
                                 method : 'GET' }, 'Additional params are filtered out.');

    test.deepEqual(testUp, { host   : 'TEST-host',
                             port   : 80,
                             path   : '/decoder_control.cgi?user=TEST-username&amp;pwd=TEST-password&amp;command=0',
                             method : 'GET' }, 'Additional params are filtered out.');

    test.deepEqual(testTake, { host   : 'TEST-host',
                               port   : 80,
                               path   : '/snapshot.cgi?user=TEST-username&amp;pwd=TEST-password&amp;',
                               method : 'GET' }, 'Additional params are filtered out.');

    test.done();
  },

  onload : function (test) {
    'use strict';

    State.FOO       = {};
    State.FOO.value = 'on';

    var foscamController = require(__dirname + '/../../../controllers/foscam'),
        onloadMarkup     = foscamController.onload({ markup : '<h1>Contents:</h1> {{FOSCAM_DYNAMIC}}',
                                                     config : { deviceId : 'FOO',
                                                                deviceIp : '127.0.0.1',
                                                                username : 'USERNAME',
                                                                password : 'PASSWORD' } });

    test.ok((onloadMarkup.indexOf('<h1>Contents:</h1>') !== -1), 'Passed markup validated');
    test.ok((onloadMarkup.indexOf('http://127.0.0.1/videostream.cgi?user=USERNAME&amp;pwd=PASSWORD') !== -1), 'Foscam image reference validated');

    test.done();
  }
};