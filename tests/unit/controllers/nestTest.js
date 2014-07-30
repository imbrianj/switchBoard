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
 * @fileoverview Unit test for controllers/nest.js
 */

State = {};

exports.nestControllerTest = {
  cToF : function (test) {
    'use strict';

    var nestController = require(__dirname + '/../../../controllers/nest');

    test.equal(nestController.cToF(0),   32,  'Freezing point');
    test.equal(nestController.cToF(100), 212, 'Boiling point');
    test.equal(nestController.cToF(24),  75.2, 'A nice day');

    test.done();
  },

  fToC : function (test) {
    'use strict';

    var nestController = require(__dirname + '/../../../controllers/nest');

    test.equal(nestController.fToC(32),   0,   'Freezing point');
    test.equal(nestController.fToC(212),  100, 'Boiling point');
    test.equal(nestController.fToC(75.2), 24,  'A nice day');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var nestController = require(__dirname + '/../../../controllers/nest'),
        postAuth       = { host    : 'TEST-host',
                           port    : '443',
                           path    : '/TEST/',
                           method  : 'POST',
                           badData : 'FAILURE',
                           auth    : { userId : 'User',
                                       token  : 'Token' } },
        getNoAuth      = { host    : 'TEST-host',
                           port    : '443',
                           path    : '/TEST/',
                           method  : 'GET',
                           badData : 'FAILURE' },
        testPostAuth   = nestController.postPrepare(postAuth),
        testGetNoAuth  = nestController.postPrepare(getNoAuth);

    test.deepEqual(testPostAuth, { host    : 'TEST-host',
                                   port    : '443',
                                   path    : '/TEST/',
                                   method  : 'POST',
                                   headers : {
                                     Accept                  : 'application/json',
                                     'Accept-Charset'        : 'utf-8',
                                     'User-Agent'            : 'node-switchBoard',
                                     'Content-Type'          : 'application/x-www-form-urlencoded',
                                     'X-nl-protocol-version' : 1,
                                     'X-nl-user-id'          : 'User',
                                     Authorization           : 'Basic Token' }
                                 }, 'Additional params are filtered out.');

    test.deepEqual(testGetNoAuth, { host    : 'TEST-host',
                                    port    : '443',
                                    path    : '/TEST/',
                                    method  : 'GET',
                                    headers : {
                                      Accept           : 'application/json',
                                      'Accept-Charset' : 'utf-8',
                                      'User-Agent'     : 'node-switchBoard',
                                      'Content-Type'   : 'application/x-www-form-urlencoded' }
                                  }, 'Additional params are filtered out.');

    test.done();
  },

  postData : function (test) {
    'use strict';

    var nestController = require(__dirname + '/../../../controllers/nest'),
        config         = { username : 'USER',
                           password : 'PASSWORD' },
        testData       = nestController.postData(config);

    test.deepEqual(testData, 'username=USER&password=PASSWORD', 'Additional params are filtered out and params stringified');

    test.done();
  },

  findLabel : function (test) {
    'use strict';

    var nestController = require(__dirname + '/../../../controllers/nest');

    test.equal(nestController.findLabel('00000000-0000-0000-0000-000100000003'), 'Den',      'Translate location');
    test.equal(nestController.findLabel('00000000-0000-0000-0000-00010000000f'), 'Upstairs', 'Translate location');

    test.done();
  },

  onload : function(test) {
    'use strict';

    State.FOO       = {};
    State.FOO.state = 'ok';
    State.FOO.value = { thermostat : {
                          '123456' : {
                            state    : 'cool',
                            label    : 'Living Room',
                            temp     : 72,
                            target   : 70,
                            humidity : 44
                          }
                      },

                      protect : {
                        '456789' : {
                          smoke   : 'ok',
                          co      : 'ok',
                          battery : 'err',
                          label   : 'Office'
                        }
                      }};

    var nestController = require(__dirname + '/../../../controllers/nest'),
        onloadMarkup   = nestController.onload({ markup : '<div class="nest"><ul><li>{{NEST_THERMOSTAT}}</li></ul><li>{{NEST_PROTECT}}</li></ul></div>',
                                                 config : { deviceId : 'FOO' } });

    test.ok((onloadMarkup.indexOf('class="thermostat device-active cool"')   !== -1), 'Thermostat is cooling');
    test.ok((onloadMarkup.indexOf('<dd class="state">State: cool</dd>')      !== -1), 'Thermostat is cooling');
    test.ok((onloadMarkup.indexOf('<dd class="temp">Temp: 72&deg;</dd>')     !== -1), 'Current thermostat temp');
    test.ok((onloadMarkup.indexOf('<dd class="target">Target: 70&deg;</dd>') !== -1), 'Current target temp');
    test.ok((onloadMarkup.indexOf('<dd class="humidity">Humidity: 44%</dd>') !== -1), 'Current humidity');
    test.ok((onloadMarkup.indexOf('<li class="protect batt device-active">') !== -1), 'Smoke detector has a low battery');
    test.ok((onloadMarkup.indexOf('<dt>Office</dt>')                         !== -1), 'Smoke detector is in the Office');
    test.ok((onloadMarkup.indexOf('<dd class="smoke">Smoke: ok</dd>')        !== -1), 'No smoke found');
    test.ok((onloadMarkup.indexOf('<dd class="co">CO: ok</dd>')              !== -1), 'No CO found');
    test.ok((onloadMarkup.indexOf('<dd class="batt">Batt: err</dd>')         !== -1), 'Smoke detector has a low battery');

    State.FOO.value = { thermostat : {
                          '123456' : {
                            state    : 'heat',
                            label    : 'Living Room',
                            temp     : 62,
                            target   : 65,
                            humidity : 44
                          }
                      },

                      protect : {
                        '456789' : {
                          smoke   : 'err',
                          co      : 'err',
                          battery : 'ok',
                          label   : 'Bedroom'
                        }
                      }};

    onloadMarkup = nestController.onload({ markup : '<div class="nest"><ul><li>{{NEST_THERMOSTAT}}</li></ul><li>{{NEST_PROTECT}}</li></ul></div>',
                                           config : { deviceId : 'FOO' } });

    test.ok((onloadMarkup.indexOf('class="thermostat device-active heat"')       !== -1), 'Thermostat is heating');
    test.ok((onloadMarkup.indexOf('<dd class="state">State: heat</dd>')          !== -1), 'Thermostat is heating');
    test.ok((onloadMarkup.indexOf('<dd class="temp">Temp: 62&deg;</dd>')         !== -1), 'Current thermostat temp');
    test.ok((onloadMarkup.indexOf('<dd class="target">Target: 65&deg;</dd>')     !== -1), 'Current target temp');
    test.ok((onloadMarkup.indexOf('<dd class="humidity">Humidity: 44%</dd>')     !== -1), 'Current humidity');
    test.ok((onloadMarkup.indexOf('<li class="protect smoke co device-active">') !== -1), 'Smoke detector detects both Smoke and CO');
    test.ok((onloadMarkup.indexOf('<dt>Bedroom</dt>')                            !== -1), 'Smoke detector is in the Bedroom');
    test.ok((onloadMarkup.indexOf('<dd class="smoke">Smoke: err</dd>')           !== -1), 'Smoke detected');
    test.ok((onloadMarkup.indexOf('<dd class="co">CO: err</dd>')                 !== -1), 'CO detected');
    test.ok((onloadMarkup.indexOf('<dd class="batt">Batt: ok</dd>')              !== -1), 'Smoke detector battery is ok');

    test.done();
  }
};
