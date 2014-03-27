/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for samsungController.js
 */

exports.samsungControllerTest = {
  base64Encode : function (test) {
    'use strict';

    var samsungController = require(__dirname + '/../../../controllers/samsungController.js'),
        encoded           = samsungController.base64Encode('TEST');

    test.equal(encoded, 'VEVTVA==', 'Base64 encoding validation');

    test.done();
  },

  chunkOne : function (test) {
    'use strict';

    var samsungController = require(__dirname + '/../../../controllers/samsungController.js'),
        chunkOne          = samsungController.chunkOne({ serverIp : '123.456.789.101', serverMac : '12:34:56', remoteName : 'TEST-remoteName', appString : 'TEST-appString' });

    test.equal(chunkOne, '\u0000\u000e\u0000TEST-appString<\u0000d\u0000\u0014\u0000MTIzLjQ1Ni43ODkuMTAx\f\u0000MTI6MzQ6NTY=\u0014\u0000VEVTVC1yZW1vdGVOYW1l', 'chunkOne validation');

    test.done();
  },

  chunkTwo : function (test) {
    'use strict';

    var samsungController = require(__dirname + '/../../../controllers/samsungController.js'),
        chunkTwoCommand   = samsungController.chunkTwo({ command : 'TESTING-COMMAND', tvAppString : 'TEST-tvAppString' }),
        chunkTwoText      = samsungController.chunkTwo({ text : 'TESTING-TEXT', appString : 'TEST-appString' });

    test.equal(chunkTwoCommand, '\u0000\u0010\u0000TEST-tvAppString!\u0000\u0000\u0000\u0000\u001c\u0000S0VZX1RFU1RJTkctQ09NTUFORA==', 'chunkTwo command validation');
    test.equal(chunkTwoText, '\u0001\u000e\u0000TEST-appString\u0014\u0000\u0001\u0000\u0010\u0000VEVTVElORy1URVhU', 'chunkTwo text validation');

    test.done();
  }
};