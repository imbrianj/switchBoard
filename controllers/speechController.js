/*jslint white: true */
/*global module, String, require, console */

module.exports = (function () {
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

    translateCommand : function (voice, text, platform) {
      var command = '';

      switch(platform) {
        case 'linux' :
        case 'freebsd' :
        case 'sunos' :
          voice = voice === 'female' ? '-ven+f3' : '';

          command = 'espeak ' + voice + ' "' + text + '"';
        break;

        case 'darwin' :
          voice = voice === 'female' ? '-v vicki' : '';

          command = 'say ' + voice + ' "' + text + '"';
        break;

        default :
          console.log('Speech: Text to speech is not supported on your platform!');
        break;
      }

      return command;
    },

    init : function () {
      this.send({ 'text' : 'Text to speech initiated' });
    },

    send : function (config) {
      var exec        = require('child_process').exec,
          speech      = {};

      speech.text     = config.text     || '';
      speech.callback = config.callback || function () {};
      speech.voice    = config.voice    || 'male';
      speech.platform = config.platofrm || process.platform;

      if(speech.text) {
        exec(this.translateCommand(speech.voice, speech.text, speech.platform), function (err, stdout, stderr) {
          var errorMsg = '';

          if(err) {
            errorMsg = 'Speech: ' + err;
            speech.callback(errorMsg);
            console.log(errorMsg);
          }

          else {
            speech.callback(null, stdout);
          }
        });
      }

      else {
        console.log('Speech: No text specified');
      }
    }
  };
}());