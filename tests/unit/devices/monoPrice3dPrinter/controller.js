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
 * @fileoverview Unit test for devices/monoPrice3dPrinter/controller.js
 */

exports.monoPrice3dPrinterControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var monoPrice3dPrinterController = require(__dirname + '/../../../../devices/monoPrice3dPrinter/controller'),
        config             = { deviceIp    : '192.168.1.1',
                               devicePort  : '80',
                               path        : '/test',
                               method      : 'POST',
                               badData     : 'FAILURE',
                               postRequest : 'hello :)'},
        testPost           = monoPrice3dPrinterController.postPrepare(config);

    test.deepEqual(testPost, { host    : '192.168.1.1',
                               port    : '80',
                               path    : '/test',
                               method  : 'GET'
                             }, 'Additional params are filtered out.');

    test.done();
  },

  getPrintStatus : function (test) {
    'use strict';

    var monoPrice3dPrinterController = require(__dirname + '/../../../../devices/monoPrice3dPrinter/controller'),
        testMonoPrice3dPrinterData   = monoPrice3dPrinterController.getPrintStatus('T190/195P29/0/7P'),
        testBadData                  = monoPrice3dPrinterController.getPrintStatus('Garbage');

    test.deepEqual(testMonoPrice3dPrinterData, { extruderTemp   : '190',
                                                  extruderTarget : '195',
                                                  bedTemp        : '29',
                                                  bedTarget      : '0',
                                                  percent        : '7'
                                               }, 'Parse through printer data response');
    test.deepEqual(testBadData, { extruderTemp   : '0',
                                  extruderTarget : '0',
                                  bedTemp        : '0',
                                  bedTarget      : '0',
                                  percent        : '0'
                               }, 'Bad data should assume the device is off and return 0 values');

    test.done();
  }
};
