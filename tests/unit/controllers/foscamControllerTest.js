/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for foscamController.js
 */

exports.foscamControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var foscamController = require(__dirname + '/../../../controllers/foscamController.js'),
        testAlarm        = foscamController.postPrepare({ deviceIp : 'TEST-host', devicePort: 80, username : 'TEST-username', password : 'TEST-password', command : 'AlarmOn' }),
        testPreset        = foscamController.postPrepare({ deviceIp : 'TEST-host', devicePort: 80, username : 'TEST-username', password : 'TEST-password', command : 'Preset2' });

    test.deepEqual(testAlarm, { host : 'TEST-host', port : '80', path : '/set_alarm.cgi?user=TEST-username&pwd=TEST-password&motion_armed=0', method : 'GET' }, 'Additional params are filtered out.');

    test.deepEqual(testPreset, { host : 'TEST-host', port : '80', path : '/decoder_control.cgi?user=TEST-username&pwd=TEST-password&command=33', method : 'GET' }, 'Additional params are filtered out.');

    test.done();
  }
};