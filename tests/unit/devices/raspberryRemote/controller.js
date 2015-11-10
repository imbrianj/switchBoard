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
 * @fileoverview Unit test for devices/raspberryRemote/controller.js
 */

exports.raspberryRemoteControllerTest = {
  fragments : function (test) {
    'use strict';

    var raspberryRemoteController = require(__dirname + '/../../../../devices/raspberryRemote/controller'),
        fragments                 = raspberryRemoteController.fragments();

    test.strictEqual(typeof fragments.switch, 'string', 'Fragment verified');

    test.done();
  },

  getDeviceParameters : function (test) {
    'use strict';

    var raspberryRemoteController = require(__dirname + '/../../../../devices/raspberryRemote/controller'),
        validCommand              = raspberryRemoteController.getDeviceParameters({ subdevice  : 'on-Desk Lamp',
                                                                                    subdevices : { 'Desk Lamp'  : 1,
                                                                                                   'Hall Light' : 2 },
                                                                                    system     : 111111 }),
        invalidCommand            = raspberryRemoteController.getDeviceParameters({ subdevice  : 'foo-Desk Lamp',
                                                                                    subdevices : { 'Desk Lamp'  : 1,
                                                                                                   'Hall Light' : 2 },
                                                                                    system     : 111111 }),
        invalidDevice             = raspberryRemoteController.getDeviceParameters({ subdevice  : 'off-NOT REAL',
                                                                                    subdevices : { 'Desk Lamp'  : 1,
                                                                                                   'Hall Light' : 2 },
                                                                                    system     : 111111 });

    test.deepEqual(validCommand,   [111111, 1, 1], 'Validate good command');
    test.deepEqual(invalidCommand, [],             'Validate bad command');
    test.deepEqual(invalidDevice,  [],             'Validate bad device');

    test.done();
  }
};
