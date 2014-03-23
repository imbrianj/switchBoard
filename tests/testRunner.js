/*jslint white: true */
/*global module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Unit test runner.
 */

module.exports = (function () {
  var reporter = require('nodeunit').reporters.default;

  reporter.run(['tests/unit/lib/loadControllerTest.js',
                'tests/unit/lib/loadMarkupTest.js',
                'tests/unit/lib/runCommandTest.js',
                'tests/unit/lib/staticAssetsTest.js',
                'tests/unit/controllers/ps3ControllerTest.js',
                'tests/unit/controllers/rokuControllerTest.js',
                'tests/unit/controllers/samsungControllerTest.js',
                'tests/unit/controllers/speechControllerTest.js']);
}());
