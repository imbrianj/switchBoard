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
 * @fileoverview Unit test for devices/neato/controller.js
 */

exports.neatoControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var neatoController = require(__dirname + '/../../../../devices/neato/controller'),
        config     = { host        : 'example.com',
                       port        : '80',
                       path        : '/test/',
                       method      : 'POST',
                       badData     : 'FAILURE',
                       postRequest : 'hello :)'},
        listConfig = { host        : 'example.com',
                       port        : 443,
                       path        : '/test/',
                       method      : 'GET',
                       list        : true,
                       postRequest : 'form data',
                       auth        : {
                         robot : {
                           serial : '1234567890',
                           secret : '0987654321'
                         }
                       } },
        testConfig = neatoController.postPrepare(config),
        testList   = neatoController.postPrepare(listConfig);

    test.deepEqual(testConfig, { host    : 'example.com',
                                 port    : '80',
                                 path    : '/test/',
                                 method  : 'POST',
                                 headers : {
                                   'Accept-Charset' : 'utf-8',
                                   'User-Agent'     : 'node-switchBoard',
                                   'Content-Type'   : 'application/json',
                                   'X-Agent'        : 'node-switchBoard',
                                   'Content-Length' : 8
                                 } }, 'Additional params are filtered out.');

    test.deepEqual(testList.host,                         'nucleo.neatocloud.com',                     'If you\'re sending auth data, it should be going to nucleo');
    test.deepEqual(testList.port,                         4443,                                        'Nucleo always runs on port 4443');
    test.deepEqual(testList.path,                         '/vendors/neato/robots/1234567890/messages', 'Path should always have the robot serial number');
    test.deepEqual(testList.headers.Authorization.length, 73,                                          'Auth is generated, but sanity check length');

    test.done();
  },

  postData : function (test) {
    'use strict';

    var neatoController = require(__dirname + '/../../../../devices/neato/controller'),
        listData        = neatoController.postData({ list: true, username: 'bar', password: 'baz' }),
        startData       = neatoController.postData({ command : 'START' }),
        stopData        = neatoController.postData({ command : 'STOP' }),
        nullData        = neatoController.postData({});

    test.equal(listData,  '{"reqId":0,"cmd":"getRobotState","params":false}',                                                   'List command');
    test.equal(startData, '{"reqId":0,"cmd":"startCleaning","params":{"category":2,"mode":2,"modifier":1,"navigationMode":1}}', 'Start command');
    test.equal(stopData,  '{"reqId":0,"cmd":"stopCleaning","params":false}',                                                    'Stop command');
    test.equal(nullData,  'email=&password=',                                                                                   'Bad input');

    test.done();
  },

  findRobot : function (test) {
    'use strict';

    var neatoController = require(__dirname + '/../../../../devices/neato/controller'),
        config          = { device : { title : 'Robot 2' } },
        neatoData       = [{
                            name       : 'Robot 1',
                            status     : 'Cleanin',
                            serial     : '1234567890',
                            secret_key : '0987654321'
                          },
                          {
                            name       : 'Robot 2',
                            status     : 'Cleanin',
                            serial     : '1234567890',
                            secret_key : '0987654321'
                          }];

    test.deepEqual(neatoController.findRobot(neatoData, config), { serial: '1234567890', name: 'Robot 2', secret: '0987654321' }, 'Returns filtered values for robot with given name');

    test.done();
  }
};
