/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for speechController.js
 */

exports.speechControllerTest = {
  translateCommand : function (test) {
    'use strict';

    var speechController = require(__dirname + '/../../../controllers/speechController.js'),
        female           = speechController.translateCommand('female', 'TEST female voice'),
        male             = speechController.translateCommand('male', 'TEST male voice');

    test.equal(female, 'espeak -ven+f3 "TEST female voice"', 'Female voice validation');
    test.equal(male, 'espeak  "TEST male voice"', 'Male voice validation');

    test.done();
  }
};