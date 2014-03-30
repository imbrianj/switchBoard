/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for controllers/sms.js
 */

exports.smsControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var smsController = require(__dirname + '/../../../controllers/sms'),
        config        = { twilioSid : 'TEST-sid',
                          twilioToken : 'TEST-token',
                          host : 'TEST-host',
                          port : '443',
                          path : '/TEST/',
                          method : 'POST',
                          badData : 'FAILURE',
                          postRequest : 'Test message to send'
                        },
        testData      = smsController.postPrepare(config);

    test.deepEqual(testData, { host : 'TEST-host',
                               port : '443',
                               path : '/TEST/',
                               method : 'POST',
                               auth : 'TEST-sid:TEST-token',
                               headers : {
                                'Accept' : 'application/json',
                                'Accept-Charset' : 'utf-8',
                                'User-Agent' : 'twilio-node-universal-controller',
                                'Content-Type' : 'application/x-www-form-urlencoded',
                                'Content-Length' : 20
                              }
                            }, 'Additional params are filtered out.');

    test.done();
  },

  postData : function (test) {
    'use strict';

    var smsController = require(__dirname + '/../../../controllers/sms'),
        config        = { twilioPhone : '1234567891',
                          phone       : '1987654321',
                          text        : 'TEST SMS body text' },
        testData      = smsController.postData(config);

    test.deepEqual(testData, 'From=1234567891&To=1987654321&Body=TEST%20SMS%20body%20text', 'Additional params are filtered out and params stringified');

    test.done();
  },
};