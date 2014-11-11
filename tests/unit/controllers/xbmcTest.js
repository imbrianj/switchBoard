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

exports.xbmcControllerTest = {
  postData : function (test) {
    'use strict';

    var xbmcController = require(__dirname + '/../../../controllers/xbmc'),
        commandRequest = xbmcController.postData({ command : 'Left' }),
        textRequest    = xbmcController.postData({ text : 'This is entered text' }),
        listRequest    = xbmcController.postData({ list : true, player : 1 });

    test.strictEqual(commandRequest, '{"id":1,"jsonrpc":"2.0","method":"Input.Left"}',                                                                                              'XBMC command validation');
    test.strictEqual(textRequest,    '{"id":0,"jsonrpc":"2.0","method":"Input.SendText","params":{"text":"This is entered text","done":false}}',                                    'XBMC text input validation');
    test.strictEqual(listRequest,    '{"id":"VideoGetItem","jsonrpc":"2.0","method":"Player.GetItem","params":{"properties":["title","album","artist","showtitle"],"playerid":1}}', 'XBMC list command validation');

    test.done();
  }
};
