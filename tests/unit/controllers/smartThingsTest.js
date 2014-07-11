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
 * @fileoverview Unit test for controllers/smartthings.js
 */

exports.smartthingsControllerTest = {
  postPrepare : function (test) {
    var smartthingsController = require(__dirname + '/../../../controllers/smartthings'),
        config                = { host    : 'TEST-host',
                                  port    : '443',
                                  path    : '/TEST/',
                                  method  : 'GET',
                                  badData : 'FAILURE' },
        testPostPrepare       = smartthingsController.postPrepare(config);

    test.deepEqual(testPostPrepare, { host : 'TEST-host', port : '443', path : '/TEST/', method : 'GET', headers : { 'Accept': 'application/json', 'Accept-Charset' : 'utf-8', 'User-Agent' : 'node-switchBoard' } }, 'Additional params are filtered out.');

    test.done();
  },

  findSubDevice : function (test) {
    'use strict';

    var smartthingsController = require(__dirname + '/../../../controllers/smartthings'),
        config                = { host    : 'TEST-host',
                                  port    : '443',
                                  path    : '/TEST/',
                                  method  : 'GET',
                                  badData : 'FAILURE' },
        subDevicesRepeat      = { 0 : { label : 'Some Light' }, 1 : { label : 'Some Light' }, 2 : { label : 'Light 3' } },
        subDevicesUnique      = { 0 : { label : 'Light 1' },    1 : { label : 'Light 2' },    2 : { label : 'Light 3' } },
        testSubDevicesRepeat  = smartthingsController.findSubDevices('Some Light', subDevicesRepeat),
        testSubDevicesUnique  = smartthingsController.findSubDevices('Light 2',    subDevicesUnique);

    test.deepEqual(testSubDevicesRepeat, [ { label: 'Some Light' }, { label: 'Some Light' } ], 'Two lights should be returned if they both have the same name');
    test.deepEqual(testSubDevicesUnique, [ { label: 'Light 2' } ],                             'Only one light is returned as its unique');

    test.done();
  }
};
