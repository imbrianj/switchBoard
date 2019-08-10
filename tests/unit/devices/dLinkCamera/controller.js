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

  md5 : function (test) {
    'use strict';

    var dLinkCameraController = require(__dirname + '/../../../../devices/dLinkCamera/controller'),
        md5                   = dLinkCameraController.md5('This is a test'),
        anotherMd5            = dLinkCameraController.md5('This is another test');


    test.strictEqual(md5,        'ce114e4501d2f4e2dcea3e17b546f339', 'MD5 summed');
    test.strictEqual(anotherMd5, 'a87edc4866a7e4257e5912ba9735d20e', 'Different string doesn\'t match');

    test.done();
  },

  decimalToHex : function (test) {
    'use strict';

    var dLinkCameraController = require(__dirname + '/../../../../devices/dLinkCamera/controller'),
        smallDecimal          = dLinkCameraController.decimalToHex(1),
        mediumDecimal         = dLinkCameraController.decimalToHex(10),
        bigDecimal            = dLinkCameraController.decimalToHex(100);


    test.strictEqual(smallDecimal,  '00000001', 'Small decimal to hex');
    test.strictEqual(mediumDecimal, '0000000A', 'Medium decimal to hex');
    test.strictEqual(bigDecimal,    '00000064', 'Larger decimal to hex');

    test.done();
  },

  generateResponse : function (test) {
    'use strict';

    var dLinkCameraController = require(__dirname + '/../../../../devices/dLinkCamera/controller'),
        testResponse          = dLinkCameraController.generateResponse({ username : 'test',
                                                                         password : 'Testing123',
                                                                         uri      : '/config/motion.cgi?enable=no',
                                                                         count    : 2,
                                                                         cnonce   : '0987654321',
                                                                         auth     : {
                                                                           nonce  : '1234567890',
                                                                           realm  : 'SwitchBoard'
                                                                         } });

    test.strictEqual(testResponse, '9879b26fd7bf05843b81ac36b717a48e', 'Confirm response value is generated correctly.');

    test.done();
  },

  getCNonce : function (test) {
    'use strict';

    var dLinkCameraController = require(__dirname + '/../../../../devices/dLinkCamera/controller'),
        testHasNonce          = dLinkCameraController.getCNonce({ count : 2, cnonce : 1234567890123456 }),
        testNoNonce           = dLinkCameraController.getCNonce({});

    test.strictEqual(testHasNonce,       1234567890123456, 'Reuses original nonce if count is unchanged.');
    test.strictEqual(testNoNonce.length, 16,               'Creates nonce of correct length.');
    test.notStrictEqual(testNoNonce,     1234567890123456, 'Creates a unique nonce.');

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
                                                                    command    : 'TAKE' }),
        testDigest            = dLinkCameraController.postPrepare({ deviceIp   : 'DIGEST-host',
                                                                    devicePort : 80,
                                                                    username   : 'TEST-username',
                                                                    password   : 'TEST-password',
                                                                    command    : 'LEFT',
                                                                    auth       : {
                                                                      nonce : '1234567890',
                                                                      realm : 'SwitchBoard'
                                                                    } });

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
    test.notStrictEqual(testDigest.headers.Authorization.indexOf('nonce'), -1, 'Digest auth returns Digest Authorization headers.');

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
                                                           deviceIp : '127.0.0.1'
                                                         } } };
        controller.controller = require(__dirname + '/../../../../devices/dLinkCamera/controller');

    runCommand.init(controller);
    controller = controller.controller.init(controller.FOO);

    test.notStrictEqual(controller.markup.indexOf('/?FOO=stream'), -1, 'DLinkCamera image reference validated');

    test.done();
  }
};
