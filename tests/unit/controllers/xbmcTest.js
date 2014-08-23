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
 * @fileoverview Unit test for controllers/xbmc.js
 */

State = {};

exports.xbmcControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var xbmcController = require(__dirname + '/../../../controllers/xbmc'),
        commandRequest = xbmcController.postPrepare({ deviceIp   : '123.456.789.101',
                                                      devicePort : '8080',
                                                      command    : 'TEST',
                                                      method     : 'POST',
                                                      postRequest : 'This is 21 bytes long'});

    test.deepEqual(commandRequest, { host    : '123.456.789.101',
                                     port    : '8080',
                                     path    : '/jsonrpc?TEST',
                                     method  : 'POST',
                                     headers : {
                                       'Accept'         : 'application/json',
                                       'Accept-Charset' : 'utf-8',
                                       'User-Agent'     : 'node-switchBoard',
                                       'Content-Type'   : 'application/json',
                                       'Content-Length' : 21
                                     }
                                   }, 'XBMC command validation');

    test.done();
  },

  postData : function (test) {
    'use strict';

    var xbmcController = require(__dirname + '/../../../controllers/xbmc'),
        postRequest    = xbmcController.postData({ command : 'Input.Left' });

    test.equals(postRequest, '{"id":1,"jsonrpc":"2.0","method":"Input.Left"}', 'XBMC post data validation');

    test.done();
  }
};
