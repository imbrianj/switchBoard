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
 * @fileoverview Gerty methods related to language parsing and keyword
 *               searching.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20200412,

    /**
     * Some devices can be assumed - if you say "TV" and only have one TV
     * configured, we don't need to require you to use the proper name.
     */
    getGenericDevices : function (controllers) {
      var genericTypes = { tv          : ['samsung', 'tcl', 'panasonic', 'lg'],
                           television  : ['samsung', 'tcl', 'panasonic', 'lg'],
                           stereo      : ['denon', 'pioneer'],
                           camera      : ['foscam', 'dLinkCamera'],
                           ps3         : ['ps3'],
                           playstation : ['ps3'],
                           stocks      : ['stocks'],
                           vacuum      : ['neato'],
                           weather     : ['weather'] },
          unique       = {},
          notUnique    = {},
          generic,
          device;

      for (device in controllers) {
        if (device !== 'config') {
          for (generic in genericTypes) {
            if (genericTypes.hasOwnProperty(generic)) {
              if (!notUnique[generic]) {
                if (genericTypes[generic].indexOf(controllers[device].config.typeClass) !== -1) {
                  if (unique[generic.toUpperCase()]) {
                    notUnique[generic] = true;
                    delete unique[generic.toUpperCase()];
                  }

                  else {
                    unique[generic.toUpperCase()] = device;
                  }
                }
              }
            }
          }
        }
      }

      return unique;
    },

    /**
     * Goes through all devices and looks up each subdevice so when you ask to
     * "Turn off the Hall Light" - we'll know which services to send that
     * request through.
     */
    getSubdevices : function (controllers) {
      var deviceState = require(__dirname + '/../../lib/deviceState'),
          subdevices  = {},
          currentState,
          device,
          subdevice,
          i;

      for (device in controllers) {
        if (device !== 'config') {
          currentState = deviceState.getDeviceState(device);

          if ((currentState) && (currentState.value) && (currentState.value.devices)) {
            i = 0;
            subdevices[device] = { subdevices : [] };

            for (subdevice in currentState.value.devices) {
              if (currentState.value.devices.hasOwnProperty(subdevice)) {
                subdevices[device].subdevices[i] = currentState.value.devices[subdevice].label;
                i += 1;
              }
            }
          }
        }
      }

      return subdevices;
    },

    /**
     * Accept a chunk of translation codes along with the language and return
     * an array of the translated strings.
     */
    getKeywords : function (codes, language) {
      var translate = require(__dirname + '/../../lib/translate'),
          strings   = [],
          i         = 0;

      for (i; i < codes.length; i += 1) {
        strings[codes[i]] = translate.translate('{{i18n_' + codes[i] + '}}', 'gerty', language);
      }

      return strings;
    },

    /**
     * Grab generic device names that have been translated.
     */
    getGenericTerms : function (language) {
      var codes = ['TV', 'STEREO', 'CAMERA', 'PLAYSTATION', 'STOCKS', 'VACUUM', 'WEATHER'];

      return this.getKeywords(codes, language);
    },

    /**
     * Grab each translated verb we're listening for.
     */
    getVerbs : function (language) {
      var codes = ['ON', 'OFF', 'HALF', 'HALFWAY', 'HEAT', 'COOL', 'TOGGLE', 'OPEN', 'CLOSE', 'UP', 'DOWN', 'RAISE', 'LOWER', 'LEFT', 'RIGHT', 'ENTER', 'ARM', 'DISARM', 'START', 'DOCK', 'PAUSE', 'STOP'];

      return this.getKeywords(codes, language);
    },

    /**
     * Grab each inquiry keyword we're listening for.
     */
    getInquiry : function (language) {
      var codes = ['DO', 'HOW', 'SHOULD', 'WHAT', 'WHEN', 'WHERE', 'WHO', 'WHY'];

      return this.getKeywords(codes, language);
    }
  };
}());
