/*jslint white: true */
/*global speechController, module, String, require, console */

var speechController = module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control of text-to-speech using espeak.
   * @requires child_process
   * @note Requires the installation of espeak, available via apt-get:
   *       sudo apt-get install espeak
   */
  return {
    version : 20140315,

    inputs  : ['text'],

    translateCommand : function () {
      var voice = this.voice === 'female' ? '-ven+f3' : '';

      return 'espeak ' + voice + ' "' + this.text + '"';
    },

    init : function () {
      speechController.send({ 'text' : 'Text to speech initiated' });
    },

    send : function (config) {
      this.text     = config.text     || '';
      this.callback = config.callback || function () {};
      this.voice    = config.voice    || 'male';

      var that      = this,
          exec      = require('child_process').exec;

      if(this.text) {
        exec(speechController.translateCommand(), function (err, stdout, stderr) {
          if(err) {
            that.callback(err);
            console.log(err);
          }

          else {
            that.callback(null, stdout);
          }
        });
      }

      else {
        console.log('Speech: No text specified');
      }
    }
  };
}());