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
 * @fileoverview Unit test for controllers/panasonic.js
 */

State = {};

exports.panasonicControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var panasonicController = require(__dirname + '/../../../controllers/panasonic'),
        commandRequest      = panasonicController.postPrepare({ deviceIp   : '123.456.789.101',
                                                                devicePort : '80',
                                                                command    : 'TEST' }),
        textRequest         = panasonicController.postPrepare({ deviceIp   : '123.456.789.101',
                                                                devicePort : '80',
                                                                text       : 'Text' }),
        volumeRequest       = panasonicController.postPrepare({ deviceIp   : '123.456.789.101',
                                                                devicePort : '80' });

    test.deepEqual(commandRequest, { host    : '123.456.789.101',
                                     port    : '80',
                                     path    : '/nrc/control_0',
                                     method  : 'POST',
                                     headers : { 'content-type'  : 'text/xml',
                                                 'accept'        : 'text/xml',
                                                 'cache-control' : 'no-cache',
                                                 'pragma'        : 'no-cache',
                                                 'soapaction'    : '"urn:panasonic-com:service:p00NetworkControl:1#X_SendKey"' } }, 'Panasonic command validation');

    test.deepEqual(textRequest, { host    : '123.456.789.101',
                                  port    : '80',
                                  path    : '/nrc/control_0',
                                  method  : 'POST',
                                  headers : { 'content-type'  : 'text/xml',
                                              'accept'        : 'text/xml',
                                              'cache-control' : 'no-cache',
                                              'pragma'        : 'no-cache',
                                              'soapaction'    : '"urn:panasonic-com:service:p00NetworkControl:1#X_SendKey"' } }, 'Panasonic command validation');

    test.deepEqual(volumeRequest, { host    : '123.456.789.101',
                                    port    : '80',
                                    path    : '/dmr/control_0',
                                    method  : 'POST',
                                    headers : { 'content-type'  : 'text/xml',
                                                'accept'        : 'text/xml',
                                                'cache-control' : 'no-cache',
                                                'pragma'        : 'no-cache',
                                                'soapaction'    : '"urn:panasonic-com:service:p00NetworkControl:1#X_SendKey"' } }, 'Panasonic command validation');

    test.done();
  },

  postData : function (test) {
    'use strict';

    var panasonicController = require(__dirname + '/../../../controllers/panasonic'),
        commandRequest      = panasonicController.postData({ deviceIp   : '123.456.789.101',
                                                             devicePort : '80',
                                                             command    : 'TEST' }),
        textRequest         = panasonicController.postData({ deviceIp   : '123.456.789.101',
                                                             devicePort : '80',
                                                             text       : 'Text' });

    test.notStrictEqual(commandRequest.indexOf('<X_KeyEvent>NRC_TEST-ONOFF</X_KeyEvent>'),                               -1, 'Command should have a key event');
    test.strictEqual(commandRequest.indexOf('<X_String>'),                                                               -1, 'Command should not have an X string');
    test.notStrictEqual(commandRequest.indexOf('<u:X_SendKey xmlns:u="urn:panasonic-com:service:p00NetworkControl:1">'), -1, 'Command should have an urn');

    test.strictEqual(textRequest.indexOf('<X_KeyEvent>'),                                                                -1, 'Text should not have a key event');
    test.notStrictEqual(textRequest.indexOf('<X_String>Text</X_String>'),                                                -1, 'Text should have an X string');
    test.notStrictEqual(textRequest.indexOf('<u:X_SendString xmlns:u="urn:panasonic-com:service:p00NetworkControl:1">'), -1, 'Text should have an urn');

    test.done();
  }
};
