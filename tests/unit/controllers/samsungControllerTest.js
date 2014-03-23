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
  }
};