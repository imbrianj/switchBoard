/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for rokuController.js
 */

exports.rokuControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var rokuController = require(__dirname + '/../../../controllers/roku'),
        commandRequest = rokuController.postPrepare({ deviceIp : '123.456.789.101', devicePort : '80', command : 'TEST' }),
        letterRequest  = rokuController.postPrepare({ deviceIp : '123.456.789.101', devicePort : '80', letter : 'T' }),
        listRequest    = rokuController.postPrepare({ deviceIp : '123.456.789.101', devicePort : '80', list : true }),
        launchRequest  = rokuController.postPrepare({ deviceIp : '123.456.789.101', devicePort : '80', launch : 'TEST' });

    test.deepEqual(commandRequest, { host: '123.456.789.101', port: '80', path: '/keypress/TEST', method: 'POST' }, 'Roku command validation');
    test.deepEqual(letterRequest, { host: '123.456.789.101', port: '80', path: '/keypress/Lit_T', method: 'POST' }, 'Roku letter validation');
    test.deepEqual(listRequest, { host: '123.456.789.101', port: '80', path: '/query/apps', method: 'GET' }, 'Roku list validation');
    test.deepEqual(launchRequest, { host: '123.456.789.101', port: '80', path: '/launch/11?contentID=TEST', method: 'POST' }, 'Roku list validation');

    test.done();
  }
};