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
   * @fileoverview Send speech synthesis commands to all Websocket connected
   *               clients.
   */
  return {
    version : 20151007,

    inputs : ['text'],

    /**
     * Default to this device being active and workable.
     */
    init : function (controller) {
      var deviceState = require(__dirname + '/../../lib/deviceState');

      deviceState.updateState(controller.config.deviceId, 'clientSpeech', { state : 'ok' });
    },

    /**
     * Accepts a message and formats it, then sends it to webSockets to be read
     * aloud client-side.
     *
     * Speech is only available to clients that support both speechSynthesis
     * as well as WebSockets.  It's assumed that if you do not support
     * WebSockets, it's unlikely you support speechSynthesis.
     */
    send : function (config) {
      var webSockets   = require(__dirname + '/../../lib/webSockets'),
          clientSpeech = {};

      clientSpeech.speech   = config.text            || '';
      clientSpeech.language = config.config.language || 'en-US';
      clientSpeech.voice    = config.device.voice    || 'male';

      webSockets.send(clientSpeech);
    }
  };
}());
