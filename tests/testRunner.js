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
                'tests/unit/controllers/foscamTest.js',
                'tests/unit/controllers/ps3Test.js',
                'tests/unit/controllers/rokuTest.js',
                'tests/unit/controllers/samsungTest.js',
                'tests/unit/controllers/speechTest.js',
                'tests/unit/controllers/stocksTest.js',
                'tests/unit/controllers/weatherTest.js']);
}());
