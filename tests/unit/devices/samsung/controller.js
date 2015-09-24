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
 * @fileoverview Unit test for devices/samsung/controller.js
 */

State = {};

exports.samsungControllerTest = {
  base64Encode : function (test) {
    'use strict';

    var samsungController = require(__dirname + '/../../../../devices/samsung/controller'),
        encoded           = samsungController.base64Encode('TEST');

    test.strictEqual(encoded, 'VEVTVA==', 'Base64 encoding validation');

    test.done();
  },

  chunkOne : function (test) {
    'use strict';

    var samsungController = require(__dirname + '/../../../../devices/samsung/controller'),
        chunkOne          = samsungController.chunkOne({ serverIp   : '123.456.789.101',
                                                         serverMac  : '12:34:56',
                                                         remoteName : 'TEST-remoteName',
                                                         appString  : 'TEST-appString' });

    test.strictEqual(chunkOne, '\u0000\u000e\u0000TEST-appString<\u0000d\u0000\u0014\u0000MTIzLjQ1Ni43ODkuMTAx\f\u0000MTI6MzQ6NTY=\u0014\u0000VEVTVC1yZW1vdGVOYW1l', 'chunkOne validation');

    test.done();
  },

  chunkTwo : function (test) {
    'use strict';

    var samsungController = require(__dirname + '/../../../../devices/samsung/controller'),
        chunkTwoCommand   = samsungController.chunkTwo({ command : 'TESTING-COMMAND',
                                                         tvAppString : 'TEST-tvAppString' }),
        chunkTwoText      = samsungController.chunkTwo({ text : 'TESTING-TEXT',
                                                         appString : 'TEST-appString' });

    test.strictEqual(chunkTwoCommand, '\u0000\u0010\u0000TEST-tvAppString!\u0000\u0000\u0000\u0000\u001c\u0000S0VZX1RFU1RJTkctQ09NTUFORA==', 'chunkTwo command validation');
    test.strictEqual(chunkTwoText,    '\u0001\u000e\u0000TEST-appString\u0014\u0000\u0001\u0000\u0010\u0000VEVTVElORy1URVhU',                'chunkTwo text validation');

    test.done();
  }
};
