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
 * @fileoverview Unit test for devices/octoprint/controller.js
 */

exports.octoprintControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var octoprintController = require(__dirname + '/../../../../devices/octoprint/controller'),
        config              = { deviceIp    : '192.168.1.1',
                                devicePort  : '80',
                                path        : '/test',
                                key         : 'thisIsMyKey',
                                method      : 'GET',
                                badData     : 'FAILURE',
                                postRequest : 'hello :)'},
        testPost           = octoprintController.postPrepare(config);

    test.deepEqual(testPost, { host     : '192.168.1.1',
                               port     : '80',
                               path     : '/test',
                               method   : 'GET',
                               headers  : {
                                 Accept           : 'application/json',
                                 'Accept-Charset' : 'utf-8',
                                 'User-Agent'     : 'node-switchBoard',
                                 'X-Api-Key'      : 'thisIsMyKey'
                              } }, 'Additional params are filtered out.');

    test.done();
  },

  getPrintStatus : function (test) {
    'use strict';

    var octoprintController = require(__dirname + '/../../../../devices/octoprint/controller'),
        config              = { device : { title : 'Test' } },
        testOctoprintData   = octoprintController.getPrintStatus('{"temperature": {"bed": {"actual": 90.0, "target": 90.0}, "tool0": {"actual": 240.0, "target": 240.0}}}', config, true),
        testOctoprintFData  = octoprintController.getPrintStatus('{"temperature": {"bed": {"actual": 33.3, "target": 90.0}, "tool0": {"actual": 118.0, "target": 240.0}}}', config, false),
        testBadData         = octoprintController.getPrintStatus('Garbage', config, true);

    test.deepEqual(testOctoprintData, { extruderTemp   : 240,
                                        extruderTarget : 240,
                                        bedTemp        : 90,
                                        bedTarget      : 90
                                      }, 'Parse through printer data response');
   test.deepEqual(testOctoprintFData, { extruderTemp   : 244.4,
                                        extruderTarget : 464,
                                        bedTemp        : 91.4,
                                        bedTarget      : 194
                                      }, 'Parse through printer fahrenheit data response');
    test.deepEqual(testBadData, { extruderTemp   : 0,
                                  extruderTarget : 0,
                                  bedTemp        : 0,
                                  bedTarget      : 0
                                }, 'Bad data should assume the device is off and return 0 values');

    test.done();
  },

  getJobStatus : function (test) {
    'use strict';

    var octoprintController  = require(__dirname + '/../../../../devices/octoprint/controller'),
        config               = { device : { title : 'Test' } },
        testOctoprintJobData = octoprintController.getJobStatus('{"progress": {"completion": 22.78, "filepos": 199810, "printTime": 970, "printTimeLeft": 2138}}', config),
        testBadData          = octoprintController.getJobStatus('Garbage', config);

    test.deepEqual(testOctoprintJobData, { percent       : 22,
                                           printTime     : 970,
                                           timeRemaining : 2138
                                         }, 'Parse through printer job data response');
    test.deepEqual(testBadData, { percent       : 0,
                                  printTime     : 0,
                                  timeRemaining : 0
                                }, 'Bad data should assume the device is off and return 0 values');

    test.done();
  },

  getPrinterSummary : function (test) {
    'use strict';

    var octoprintController = require(__dirname + '/../../../../devices/octoprint/controller'),
        object1             = { food : 'bananas', animals : ['fish', 'dog'] },
        object2             = { states : ['Florida', 'Confusion'], boolean : true },
        testPrintSummary    = octoprintController.getPrinterSummary(object1, object2);

    test.deepEqual(testPrintSummary, { food    : 'bananas',
                                       animals : ['fish', 'dog'],
                                       states  : ['Florida', 'Confusion'],
                                       boolean : true
                                     }, 'Objects are merged');

    test.done();
  }
};
