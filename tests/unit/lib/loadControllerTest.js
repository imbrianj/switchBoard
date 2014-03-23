/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for loadController.js
 */

exports.loadControllerTest = {
  loadControllerFile : function (test) {
    'use strict';

    var loadController   = require(__dirname + '/../../../lib/loadController.js'),
        controllerConfig = { typeClass : 'samsung',
                             title     : 'TEST samsung' },
        controller       = loadController.loadControllerFile(controllerConfig, 'samsung');

    test.equal(controller.controller.keymap.length, 242, 'Controller file loaded');
    test.ok((controller.markup.indexOf('control-block') !== -1), 'Controller markup loaded');

    test.done();
  },

  loadController : function (test) {
    'use strict';

    var loadController = require('../../../lib/loadController.js'),
        devices        = { samsung   : { title : 'TEST Samsung SmartTV' },
                           panasonic : { title : 'TEST Panasonic', disabled : true } },
        controller     = loadController.loadController(devices);

    test.ok(controller.config === undefined, 'Config object is not populated');
    test.ok(!controller.panasonic, 'Disabled devices are omitted');

    test.done();
  }
};