/**
 * Copyright (c) 2014 markewest@gmail.com
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

(function (exports){
  'use strict';

  exports.wemo = function (deviceId, markup, state, value, fragments, language) {
    var templateSwitch  = fragments.switch,
        templateGroup   = fragments.group,
        i               = 0,
        j               = 0,
        tempMarkup      = '',
        stateClass      = '',
        subDeviceMarkup = '',
        subDevice,
        encodeName = function (name) {
          var util;

          if (typeof SB === 'object') {
            name = SB.util.encodeName(name);
          }

          else {
            util = require(__dirname + '/../../lib/sharedUtil').util;
            name = util.encodeName(name);
          }

          return name;
        },
        translate  = function (message) {
          var util;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'wemo');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'wemo', language);
          }

          return message;
        },
        findSubDevice = function (subDeviceLabel, subDevices) {
          var collected = {},
              i         = 0;

          for (i in subDevices) {
            if (subDevices[i].label === subDeviceLabel) {
              collected = subDevices[i];

              break;
            }
          }

          return collected;
        },
        getDeviceMarkup = function (device) {
          var deviceMarkup   = '';

          if (stateClass) {
            stateClass = stateClass + 'device-active';
          }

          deviceMarkup = templateSwitch.split('{{SUB_DEVICE_ID}}').join(device.label.split(' ').join('+'));
          deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_NAME}}').join(device.label);
          deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_CLASS}}').join(device.className || 'fa-lightbulb-o');

          if (device.state === 'on') {
            deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATE}}').join(' device-active');
            deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATUS}}').join(translate('ACTIVE'));
          }

          else if (device.state === 'off') {
            deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATE}}').join('');
            deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATUS}}').join(translate('INACTIVE'));
          }

          else {
            deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATE}}').join(' device-off');
            deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATUS}}').join(translate('INACTIVE'));
          }

          return deviceMarkup;
        };

    if ((value) && (value.devices)) {
      // You want to display Wemo devices in groups.
      if (value.groups) {
        for (i in value.groups) {
          tempMarkup      = tempMarkup + templateGroup;
          subDeviceMarkup = '';

          for (j in value.groups[i]) {
            subDevice = findSubDevice(value.groups[i][j], value.devices);

            if (subDevice) {
              subDeviceMarkup = subDeviceMarkup + getDeviceMarkup(subDevice);
            }
          }

          tempMarkup = tempMarkup.split('{{GROUP_CLASS}}').join(encodeName(i));
          tempMarkup = tempMarkup.split('{{GROUP_TITLE}}').join(i);
          tempMarkup = tempMarkup.split('{{SUB_DEVICE_LIST}}').join(subDeviceMarkup);
        }
      }

      // Otherwise, you want to show them in a list.
      else {
        for (i in value.devices) {
          tempMarkup = tempMarkup + getDeviceMarkup(value.devices[i]);
        }
      }

      if (tempMarkup) {
        tempMarkup = tempMarkup.replace('{{SUB_DEVICE_CLASS}}', ' text-device-status');
      }
    }

    return markup.replace('{{WEMO_DYNAMIC}}', tempMarkup);
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
