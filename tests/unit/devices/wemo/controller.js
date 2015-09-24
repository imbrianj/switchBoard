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
 * @fileoverview Unit test for devices/wemo/controller.js
 */

State = {};

exports.wemoControllerTest = {
  fragments : function(test) {
    'use strict';

    var wemoController = require(__dirname + '/../../../../devices/wemo/controller'),
        fragments      = wemoController.fragments();

    test.strictEqual(typeof fragments.group,  'string', 'Group fragment verified');
    test.strictEqual(typeof fragments.switch, 'string', 'Switch fragment verified');

    test.done();
  },

  postPrepare : function(test) {
    'use strict';

    var wemoController = require(__dirname + '/../../../../devices/wemo/controller'),
        configGet      = { deviceIp   : '127.0.0.1',
                           devicePort : '49153',
                           command    : 'state',
                           badData    : 'FAILURE' },
        testGet        = wemoController.postPrepare(configGet),
        configSet      = { deviceIp   : '127.0.0.1',
                           devicePort : '49153',
                           command    : 'on',
                           badData    : 'FAILURE' },
        testSet         = wemoController.postPrepare(configSet);

    test.deepEqual(testGet, { host : '127.0.0.1', port : '49153', path : '/upnp/control/basicevent1', method : 'POST', headers : { 'content-type' : 'text/xml; charset=utf-8', 'accept': 'text/xml', 'cache-control' : 'no-cache', 'soapaction' : '"urn:Belkin:service:basicevent:1#GetBinaryState"' } }, 'Additional params are filtered out.');
    test.deepEqual(testSet, { host : '127.0.0.1', port : '49153', path : '/upnp/control/basicevent1', method : 'POST', headers : { 'content-type' : 'text/xml; charset=utf-8', 'accept': 'text/xml', 'cache-control' : 'no-cache', 'soapaction' : '"urn:Belkin:service:basicevent:1#SetBinaryState"' } }, 'Additional params are filtered out.');

    test.done();
  },

  postData : function(test) {
    'use strict';

    var wemoController = require(__dirname + '/../../../../devices/wemo/controller'),
        configGet      = { command    : 'state' },
        testGet        = wemoController.postData(configGet),
        configSet      = { command    : 'on' },
        testSet        = wemoController.postData(configSet);

    test.notStrictEqual(testGet.indexOf('u:GetBinaryState'), -1, 'State should use GetBinaryState');
    test.notStrictEqual(testSet.indexOf('u:SetBinaryState'), -1, 'On should use SetBinaryState');

    test.done();
  }
};
