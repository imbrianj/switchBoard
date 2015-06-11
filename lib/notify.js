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

/**
 * @author brian@bevey.org
 * @fileoverview Manage desktop notification pushes and general notification
 *               helper methods.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20150610,

    /**
     * Accepts a title, message, device ID and image (all optional) and formats
     * them, then sends them to webSockets to be displayed.
     *
     * If you add a deviceId, clicking on the notification will cause that tab
     * to be selected on the client.
     *
     * Notifications are only available to clients that support both Desktop
     * Notifications (duh) as well as WebSockets.  It's assumed that if you do
     * not support WebSockets, it's unlikely you support Destktop Notifications.
     */
    sendNotification : function(title, message, deviceId, image) {
      var webSockets = require(__dirname + '/webSockets'),
          config     = {};

      config.options      = {};
      config.options.icon = image    || '/images/icons/apple-touch-icon.png';
      config.options.body = message  || '';
      config.title        = title    || 'Switchboard';
      config.deviceId     = deviceId || '';

      webSockets.send(config);
    },

    /**
     * Accepts a message and formats it, then sends it to webSockets to be read
     * aloud client-side.
     *
     * Speech is only available to clients that support both speechSynthesis
     * as well as WebSockets.  It's assumed that if you do not support
     * WebSockets, it's unlikely you support speechSynthesis.
     */
    sendSpeech : function(message, language, voice) {
      var webSockets = require(__dirname + '/webSockets');

      language = language || 'en-US';
      message  = message  || '';
      voice    = voice    || 'male';

      webSockets.send({ speech : message, language : language, voice : voice });
    },

    /**
     * Accepts a sound name, then sends it to webSockets to be played aloud
     * client-side.
     *
     * Sounds are only available to clients that support both audio as well as
     * WebSockets.  It's assumed that if you do not support WebSockets, it's
     * unlikely you support audio.
     */
    sendSound : function(sound) {
      var webSockets = require(__dirname + '/webSockets');

      if(sound) {
        webSockets.send({ sound : sound });
      }
    },

    /**
     * Accepts a message and object comprised of device controllers.  If any of
     * the controllers are conidered a notification means, the message is sent
     * to them.
     */
    notify : function(message, controllers) {
      var runCommand = require(__dirname + '/../lib/runCommand'),
          deviceId;

      for(deviceId in controllers) {
        if(controllers[deviceId].config) {
          switch(controllers[deviceId].config.typeClass) {
            case 'pushover' :
            case 'sms'      :
            case 'speech'   :
              runCommand.runCommand(deviceId, 'text-' + message);
            break;
          }
        }
      }
    }
  };
}());
