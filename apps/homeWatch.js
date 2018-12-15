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
 * @fileoverview Monitor a number of sensors around your home and execute
 *               specified commands if actions are triggered during certain
 *               active modes.  Allows a configurable delay to compensate for
 *               presence sensor lag.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20181213,

    homeWatch : function (deviceId, command, controllers, values, config) {
      var notify      = require(__dirname + '/../lib/notify'),
          translate   = require(__dirname + '/../lib/translate'),
          message     = '',
          trigger     = '',
          secureModes = config.secureModes || ['Away'],
          delay       = (config.delay || 15) * 1000,
          isIn        = function (command, collection, prefix) {
            var found = false,
                current;

            for (current in collection) {
              if (command === prefix + collection[current] + '-on') {
                found = collection[current];
                break;
              }
            }

            return found;
          },
          isArmed     = function () {
            var deviceState      = require(__dirname + '/../lib/deviceState'),
                smartThingsState = deviceState.getDeviceState(deviceId),
                isArmed          = false;

            if ((smartThingsState) && (smartThingsState.value) && (smartThingsState.value.mode)) {
              if (secureModes.indexOf(smartThingsState.value.mode) !== -1) {
                isArmed = true;
              }
            }

            return isArmed;
          },
          findCamera = function(trigger) {
            var cameras,
                camera,
                device;

            for (device in controllers) {
              if ((controllers[device]) && (controllers[device].config) &&
                  ((controllers[device].config.typeClass === 'foscam') ||
                   (controllers[device].config.typeClass === 'dLinkCamera'))) {
                // Keep track of all cameras in case there's a misconfigured
                // target camera - so it'll at least pull something.
                cameras.push(device);

                if (config.camera && config.camera[trigger] && config.camera[trigger] === device) {
                  camera = device;

                  break;
                }
              }
            }

            if (cameras.length && !camera) {
              camera = cameras[0];
            }

            return camera;
          };

      trigger = isIn(command, config.motion,  'subdevice-state-motion-') ||
                isIn(command, config.contact, 'subdevice-state-contact-');

      if (trigger && isArmed()) {
        // We use a delay here of a few seconds, as Presence sensors may take a
        // few seconds to register and update the mode.  We want to avoid false
        // positives as much as possible.
        setTimeout(function () {
          var camera,
              runCommand,
              callback;

          if(isArmed()) {
            console.log('\x1b[35m' + controllers[deviceId].config.title + '\x1b[0m: Home Watch found something suspicious');

            camera = findCamera(trigger);
            message = translate.translate('{{i18n_HOME_WATCH}}', 'smartthings', controllers.config.language).split('{{LABEL}}').join(trigger);

            if (camera) {
              runCommand = require(__dirname + '/../lib/runCommand');

              callback = function(err, dataReply) {
                var rawImage = dataReply.rawImage,
                    fileName = dataReply.fileName;

                notify.notify(message, controllers, camera, fileName, rawImage);
              };

              // This command takes the photo and (optionally) sends it to
              // Pushover.
              runCommand.runCommand(camera, 'TAKE', deviceId, null, null, callback);

              // This command takes a few snapshots on the desired camera.
              runCommand.macroCommands(camera + '=TAKE,TAKE,TAKE,TAKE,TAKE');
            }

            else {
              notify.notify(message, controllers, deviceId);
            }
          }
        }, delay);
      }
    }
  };
}());
