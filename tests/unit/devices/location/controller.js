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
 * @fileoverview Unit test for devices/location/controller.js
 */

exports.locationControllerTest = {
  fragments : function(test) {
    'use strict';

    var locationController = require(__dirname + '/../../../../devices/location/controller'),
        fragments          = locationController.fragments();

    test.strictEqual(typeof fragments.item, 'string', 'Fragment verified');

    test.done();
  },

  postPrepare : function(test) {
    'use strict';

    var locationController = require(__dirname + '/../../../../devices/location/controller'),
        config             = { host        : 'example.com',
                               port        : '80',
                               path        : '/test/',
                               method      : 'POST',
                               badData     : 'FAILURE',
                               postRequest : 'hello :)'},
        testPost           = locationController.postPrepare(config);

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

  getLocations : function(test) {
    'use strict';

    var locationController = require(__dirname + '/../../../../devices/location/controller'),
        locationData       = [ {
          lat   : "45.678901234",
          long  : "-124.45678901",
          alt   : "15.0",
          link  : "https://maps.google.com/?q=45.678901234,-124.45678901",
          speed : "5.67890123",
          user  : "<b>Tester</b>",
          time  : 1234567890
        },
        {
          lat   : "45.678901236",
          long  : "-124.45678902",
          alt   : "16.0",
          link  : "https://maps.google.com/?q=45.678901236,-124.45678902",
          speed : "15.67890123",
          user  : "Tester",
          time  : 1234568890
        } ],
        testLocationData   = locationController.getLocations(locationData, 1),
        testBadData        = locationController.getLocations({}, 10);

    test.deepEqual(testLocationData, [{ lat   : '45.678901234',
                                        long  : '-124.45678901',
                                        alt   : '15.0',
                                        url   : 'https://maps.google.com/?q=45.678901234,-124.45678901',
                                        speed : '5.67890123',
                                        name  : 'Tester',
                                        time  : '1234567890'
                                     }], 'One article should be found for RSS feeds');
    test.deepEqual(testBadData,  {}, 'Nothing should be returned for bad data');

    test.done();
  }
};
