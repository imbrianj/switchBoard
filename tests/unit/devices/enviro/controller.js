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
 * @fileoverview Unit test for devices/enviro/controller.js
 */

exports.enviroControllerTest = {
  fragments : function (test) {
    'use strict';

    var enviroController = require(__dirname + '/../../../../devices/enviro/controller'),
        fragments        = enviroController.fragments();

    test.strictEqual(typeof fragments.report,  'string', 'Fragment verified');
    test.strictEqual(typeof fragments.graph,   'string', 'Fragment verified');
    test.strictEqual(typeof fragments.low,     'string', 'Fragment verified');
    test.strictEqual(typeof fragments.optimum, 'string', 'Fragment verified');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var enviroController = require(__dirname + '/../../../../devices/enviro/controller'),
        config           = { deviceIp    : '127.0.0.1',
                             port        : '80',
                             path        : '/',
                             method      : 'GET',
                             badData     : 'FAILURE',
                             postRequest : 'hello :)' },
        testPost         = enviroController.postPrepare(config);

    test.deepEqual(testPost, { host    : '127.0.0.1',
                               port    : '80',
                               path    : '/',
                               method  : 'GET',
                               headers : {
                                 'Accept'         : 'application/json',
                                 'Accept-Charset' : 'utf-8',
                                 'User-Agent'     : 'node-switchBoard',
                               }
                              }, 'Additional params are filtered out.');

    test.done();
  },

  formatReport : function (test) {
    'use strict';

    var enviroController = require(__dirname + '/../../../../devices/enviro/controller'),
        enviroData       = {
          unix     : 1585879709,
          readings : [{
                        "units" : "C",
                        "name"  : "TEMPERATURE",
                        "value" : 11.22
                      },
                      {
                        "units" : "hPa",
                        "name"  : "PRESSURE",
                        "value" : 611.42
                      },
                      {
                        "units" : "%",
                        "name"  : "HUMIDITY",
                        "value" : 54.24
                      },
                      {
                        "units" : "Lux",
                        "name"  : "LIGHT",
                        "value" : 17.95
                      },
                      {
                        "units" : "kO",
                        "name"  : "OXIDISED",
                        "value" : 93.15
                      },
                      {
                        "units" : "ug/m3",
                        "name"  : "PM1",
                        "value" : 0
                      }]
        },
        testEnviroData   = enviroController.formatReport(enviroData, { celsius : false, language : 'en' }, 'Enviro'),
        testEnviroCData  = enviroController.formatReport(enviroData, { celsius : true,  language : 'en' }, 'Enviro'),
        testBadData      = enviroController.formatReport(null, { celsius : true,  language : 'en' }, 'Enviro');

    test.equal(testEnviroData[0].value,  52.2,   'Temperature should be returned in F');
    test.equal(testEnviroCData[0].value, 11.220, 'Temperature should be returned in C');
    test.deepEqual(testBadData,          [],     'Nothing should be returned for bad data');

    test.done();
  }
};
