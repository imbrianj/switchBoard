/*jslint white: true */
/*global State, module, require, console */

/**
 * Copyright (c) 2014 brian@bevey.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

module.exports = (function () {
  'use strict';

  /**
   * @author brian@bevey.org
   * @fileoverview Basic control of text-to-speech using espeak / say.
   * @requires child_process
   * @note For Linux/BSD/SunOS: Requires the installation of espeak.
   *       On Raspbian, it's available via apt-get:
   *       sudo apt-get install espeak
   */
  return {
    version : 20140729,

    inputs  : ['text'],

    translateCommand : function (voice, text, platform) {
      var execute = { command : '', params : [] };

      switch(platform) {
        case 'linux' :
        case 'freebsd' :
        case 'sunos' :
          execute.command = 'espeak';

          if(voice === 'female') {
            execute.params.push('-ven+f3');
          }

          execute.params.push(text);
        break;

        case 'darwin' :
          execute.command = 'say';

          if(voice === 'female') {
            execute.params.push('-v');
            execute.params.push('vicki');
          }

          execute.params.push(text);
        break;

        default :
          execute = '';

          console.log('\x1b[31mSpeech\x1b[0m: Text to speech is not supported on your platform!');
        break;
      }

      return execute;
    },

    init : function (controller) {
      var callback = function(err, reply) {
            var deviceState = require(__dirname + '/../lib/deviceState'),
                message     = 'err';

            if(reply) {
              message = 'ok';
            }

            deviceState.updateState(controller.config.deviceId, controller.config.typeClass, { state : message });
          };

      this.send({ text : 'Text to speech initiated', callback : callback, device : { voice : controller.config.voice } });
    },

    send : function (config) {
      var spawn       = require('child_process').spawn,
          speech      = {},
          speak;

      speech.text     = config.text         || '';
      speech.callback = config.callback     || function () {};
      speech.voice    = config.device.voice || 'male';
      speech.platform = config.platform     || process.platform;
      speech.execute  = this.translateCommand(speech.voice, speech.text, speech.platform);

      if(speech.text && speech.execute) {
        speak = spawn(speech.execute.command, speech.execute.params);

        speak.once('close', function(code) {
            speech.callback(null, 'ok');
        });
      }

      else {
        console.log('\x1b[31mSpeech\x1b[0m: No text specified');

        speak.callback('err');
      }
    }
  };
}());
