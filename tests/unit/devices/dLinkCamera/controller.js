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
 * @fileoverview Unit test for devices/dLinkCamera/controller.js
 */

exports.dLinkCameraControllerTest = {
  fragments : function (test) {
    'use strict';

    var dLinkCameraController = require(__dirname + '/../../../../devices/dLinkCamera/controller'),
        fragments             = dLinkCameraController.fragments();


    test.strictEqual(typeof fragments.photos, 'string', 'Fragment verified');
    test.strictEqual(typeof fragments.photo,  'string', 'Fragment verified');
    test.strictEqual(typeof fragments.videos, 'string', 'Fragment verified');
    test.strictEqual(typeof fragments.video,  'string', 'Fragment verified');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var dLinkCameraController = require(__dirname + '/../../../../devices/dLinkCamera/controller'),
        testAlarm             = dLinkCameraController.postPrepare({ deviceIp   : 'TEST-host',
                                                                    devicePort : 80,
                                                                    username   : 'TEST-username',
                                                                    password   : 'TEST-password',
                                                                    command    : 'ALARM_ON' }),
        testPreset            = dLinkCameraController.postPrepare({ deviceIp   : 'TEST-host',
                                                                    devicePort : 80,
                                                                    username   : 'TEST-username',
                                                                    password   : 'TEST-password',
                                                                    command    : 'PRESET2' }),
        testUp                = dLinkCameraController.postPrepare({ deviceIp   : 'TEST-host',
                                                                    devicePort : 80,
                                                                    username   : 'TEST-username',
                                                                    password   : 'TEST-password',
                                                                    command    : 'UP' }),
        testTake              = dLinkCameraController.postPrepare({ deviceIp   : 'TEST-host',
                                                                    devicePort : 80,
                                                                    username   : 'TEST-username',
                                                                    password   : 'TEST-password',
                                                                    command    : 'TAKE' });

    test.deepEqual(testAlarm, { host    : 'TEST-host',
                                port    : 80,
                                path    : '/config/motion.cgi?enable=yes',
                                headers : { Authorization: 'Basic VEVTVC11c2VybmFtZTpURVNULXBhc3N3b3Jk' },
                                method  : 'GET' }, 'Additional params are filtered out.');

    test.deepEqual(testPreset, { host    : 'TEST-host',
                                 port    : 80,
                                 path    : '/cgi-bin/longcctvpst.cgi?action=goto&number=2',
                                 headers : { Authorization: 'Basic VEVTVC11c2VybmFtZTpURVNULXBhc3N3b3Jk' },
                                 method  : 'GET' }, 'Additional params are filtered out.');

    test.deepEqual(testUp, { host    : 'TEST-host',
                             port    : 80,
                             path    : '/cgi-bin/longcctvmove.cgi?action=move&direction=up&panstep=1&tiltstep=1',
                             headers : { Authorization: 'Basic VEVTVC11c2VybmFtZTpURVNULXBhc3N3b3Jk' },
                             method  : 'GET' }, 'Additional params are filtered out.');

    test.deepEqual(testTake, { host    : 'TEST-host',
                               port    : 80,
                               path    : '/image/jpeg.cgi',
                               headers : { Authorization: 'Basic VEVTVC11c2VybmFtZTpURVNULXBhc3N3b3Jk' },
                               method  : 'GET' }, 'Additional params are filtered out.');

    test.done();
  },

  init : function (test) {
    'use strict';

    var runCommand            = require(__dirname + '/../../../../lib/runCommand'),
        controller            = { 'FOO' : { markup     : '<h1>Contents:</h1> {{DLINKCAMERA_DYNAMIC}}',
                                            controller : { inputs   : ['state'],
                                            send       : function (request) { return request; } },
                                            config     : { deviceId : 'FOO',
                                                           title    : 'DLink Camera',
                                                           deviceIp : '127.0.0.1',
                                                           username : 'USERNAME',
                                                           password : 'PASSWORD' } } };
        controller.controller = require(__dirname + '/../../../../devices/dLinkCamera/controller');

    runCommand.init(controller);
    controller = controller.controller.init(controller.FOO);

    test.notStrictEqual(controller.markup.indexOf('/?FOO=stream'), -1, 'DLinkCamera image reference validated');

    test.done();
  }
};
