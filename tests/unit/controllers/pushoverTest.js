/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test for controllers/pushover.js
 */

exports.pushoverControllerTest = {
  postPrepare : function (test) {
    'use strict';

    var pushoverController = require(__dirname + '/../../../controllers/pushover'),
        config             = { token       : 'TEST-token',
                               userKey     : 'TEST-userkey',
                               host        : 'TEST-host',
                               port        : '443',
                               path        : '/TEST/',
                               method      : 'POST',
                               badData     : 'FAILURE',
                               postRequest : 'Test message to send'
                             },
        testData           = pushoverController.postPrepare(config);

    test.deepEqual(testData, { host    : 'TEST-host',
                               port    : '443',
                               path    : '/TEST/',
                               method  : 'POST',
                               headers : {
                                'Accept'         : 'application/json',
                                'Accept-Charset' : 'utf-8',
                                'User-Agent'     : 'pushover-node-universal-controller',
                                'Content-Type'   : 'application/x-www-form-urlencoded',
                                'Content-Length' : 20
                              }
                            }, 'Additional params are filtered out.');

    test.done();
  },

  postData : function (test) {
    'use strict';

    var pushoverController = require(__dirname + '/../../../controllers/pushover'),
        config             = { token   : '1234567891',
                               userKey : '1987654321',
                               text    : 'TEST Pushover body text' },
        testData           = pushoverController.postData(config);

    test.deepEqual(testData, 'token=1234567891&user=1987654321&message=TEST%20Pushover%20body%20text', 'Additional params are filtered out and params stringified');

    test.done();
  },
};