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
 * @fileoverview Unit test for devices/tcl/controller.js
 */

exports.tclControllerTest = {
  fragments : function (test) {
    'use strict';

    var tclController = require(__dirname + '/../../../../devices/tcl/controller'),
        fragments     = tclController.fragments();

    test.strictEqual(typeof fragments.list, 'string', 'Fragment verified');

    test.done();
  },

  postPrepare : function (test) {
    'use strict';

    var tclController  = require(__dirname + '/../../../../devices/tcl/controller'),
        commandRequest = tclController.postPrepare({ deviceIp   : '123.456.789.101',
                                                      devicePort : '80',
                                                      command    : 'TEST' }),
        letterRequest  = tclController.postPrepare({ deviceIp   : '123.456.789.101',
                                                      devicePort : '80',
                                                      letter     : 'T' }),
        listRequest    = tclController.postPrepare({ deviceIp   : '123.456.789.101',
                                                      devicePort : '80',
                                                      list       : true }),
        launchRequest  = tclController.postPrepare({ deviceIp   : '123.456.789.101',
                                                      devicePort : '80',
                                                      launch     : 'TEST' });

    test.deepEqual(commandRequest, { host   : '123.456.789.101',
                                     port   : '80',
                                     path   : '/keypress/TEST',
                                     method : 'POST' }, 'TCL command validation');
    test.deepEqual(letterRequest, { host   : '123.456.789.101',
                                    port   : '80',
                                    path   : '/keypress/Lit_T',
                                    method : 'POST' }, 'TCL letter validation');
    test.deepEqual(listRequest, { host   : '123.456.789.101',
                                  port   : '80',
                                  path   : '/query/apps',
                                  method : 'GET' }, 'TCL list validation');
    test.deepEqual(launchRequest, { host   : '123.456.789.101',
                                    port   : '80',
                                    path   : '/launch/11?contentID=TEST',
                                    method : 'POST' }, 'TCL list validation');

    test.done();
  }
};
