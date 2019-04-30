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
 * @fileoverview Unit test for devices/piHole/controller.js
 */

exports.piHoleTest = {
  postPrepare : function (test) {
    'use strict';

    var piHoleController = require(__dirname + '/../../../../devices/piHole/controller'),
        config           = { host        : '192.168.1.145',
                             port        : 80,
                             path        : '/admin/api.php?summary',
                             badData     : 'FAILURE',
                             postRequest : 'hello :)'},
        testPost         = piHoleController.postPrepare(config);

    test.deepEqual(testPost, { host    : '192.168.1.145',
                               port    : 80,
                               path    : '/admin/api.php?summary',
                               method  : 'GET',
                               headers : {
                                 'Accept'         : 'application/json',
                                 'Accept-Charset' : 'utf-8',
                                 'User-Agent'     : 'node-switchBoard'
                               }
                              }, 'Additional params are filtered out.');

    test.done();
  },

  getData : function (test) {
    'use strict';

    var piHoleController = require(__dirname + '/../../../../devices/piHole/controller'),
        piHoleData       = { domains_being_blocked : '111,810',
                             dns_queries_today     : '125,500',
                             ads_blocked_today     : '99,999',
                             ads_percentage_today  : '15.5',
                             queries_forwarded     : '22,000',
                             queries_cached        : '5,000',
                             gravity_last_updated  : { absolute: 1556421306 } },
        testPiHoleData    = piHoleController.getData(piHoleData),
        testBadData       = piHoleController.getData(null);

    test.deepEqual(testPiHoleData, { cached              : '5,000',
                                     domainsBlocked      : '111,810',
                                     forwarded           : '22,000',
                                     lastUpdate          : 1556421306000,
                                     percentBlockedToday : '15.5',
                                     queriesBlockedToday : '99,999',
                                     queriesToday        : '125,500' }, 'Parse API response');
    test.deepEqual(testBadData, {}, 'Nothing should be returned for empty data');

    test.done();
  }
};
