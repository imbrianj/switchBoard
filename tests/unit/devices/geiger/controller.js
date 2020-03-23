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
 * @fileoverview Unit test for devices/geiger/controller.js
 */

exports.geigerControllerTest = {
  fragments : function (test) {
    'use strict';

    var geigerController = require(__dirname + '/../../../../devices/geiger/controller'),
        fragments        = geigerController.fragments();

    test.strictEqual(typeof fragments.report, 'string', 'Fragment verified');
    test.strictEqual(typeof fragments.graph,  'string', 'Fragment verified');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var geigerController = require(__dirname + '/../../../../devices/geiger/controller'),
        config             = { host        : 'example.com',
                               port        : '80',
                               path        : '/test/',
                               method      : 'POST',
                               badData     : 'FAILURE',
                               postRequest : 'hello :)'},
        testPost           = geigerController.postPrepare(config);

    test.deepEqual(testPost, { host    : 'example.com',
                               port    : '80',
                               path    : '/test/',
                               method  : 'POST',
                               headers : {
                                 'Accept'         : 'application/json',
                                 'Accept-Charset' : 'utf-8',
                                 'User-Agent'     : 'node-switchBoard',
                                 'Content-Type'   : 'application/x-www-form-urlencoded',
                                 'Content-Length' : 8
                               }
                              }, 'Additional params are filtered out.');

    test.done();
  },

  postData : function (test) {
    'use strict';

    var geigerController = require(__dirname + '/../../../../devices/geiger/controller'),
        geigerData       = { username: 'bar', password: 'baz', maxCount: 5 },
        postData         = geigerController.postData(geigerData);

    test.equal(postData, 'type=geiger&user=bar&pass=baz&count=5');

    test.done();
  },

  getReadings : function (test) {
    'use strict';

    var geigerController = require(__dirname + '/../../../../devices/geiger/controller'),
        geigerData       = [ {
          aid  : "123456",
          gid  : "2",
          cpm  : "21.0123",
          acpm : "20.1234",
          usv  : "0.075",
          name : "Ghandi",
          time : 1234567890
        },
        {
          aid  : "123457",
          gid  : "2",
          cpm  : "21.0126",
          acpm : "20.1237",
          usv  : "0.077",
          name : "Ghandi",
          time : 1234569890
        } ],
        testGeigerData   = geigerController.getReadings(geigerData, 1),
        testBadData      = geigerController.getReadings({}, 10);

    test.equal(testGeigerData.report.length, 1,               'One reading should be found for data feeds');
    test.deepEqual(testBadData,              { report : [] }, 'Nothing should be returned for bad data');

    test.done();
  }
};
