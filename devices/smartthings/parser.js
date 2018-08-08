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

(function (exports){
  'use strict';

  exports.smartthings = function (deviceId, markup, state, value, fragments, language) {
    var templateAction  = fragments.action,
        templateStatic  = fragments.static,
        templateGroup   = fragments.group,
        i               = 0,
        j               = 0,
        tempMarkup      = '',
        mode            = '',
        subdeviceMarkup = '',
        subdevices,
        subdeviceGroup,
        encodeName      = function (name) {
          var util;

          if (typeof SB === 'object') {
            name = SB.util.encodeName(name);
          }

          else {
            util = require(__dirname + '/../../lib/sharedUtil').util;
            name = util.encodeName(name);
          }

          return 'group-' + name;
        },
        translate       = function (message) {
          var util;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'smartthings');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'smartthings', language);
          }

          return message;
        },
        findSubdevices  = function (subdeviceLabel, subdevices) {
          var subdevice = {},
              collected = [],
              i         = 0,
              j         = 0;

          for (i in subdevices) {
            if (subdevices.hasOwnProperty(i)) {
              subdevice = subdevices[i];

              if (subdevice.label === subdeviceLabel) {
                collected[j] = subdevice;
                j += 1;
              }
            }
          }

          return collected;
        },
        getDeviceMarkup = function (device) {
          var deviceTemplate = '',
              deviceMarkup   = '',
              deviceClass    = '',
              peripherals    = [],
              peripheral     = '',
              vibrate        = '';

          switch (device.type) {
            case 'switch' :
              deviceTemplate = templateAction;
              deviceClass    = 'fa-lightbulb-o';
            break;

            case 'lock' :
              deviceTemplate = templateAction;
              deviceClass    = 'fa-unlock-alt';
            break;

            case 'contact' :
              deviceTemplate = templateStatic;
              deviceClass    = 'fa-columns';
            break;

            case 'water' :
              deviceTemplate = templateStatic;
              deviceClass    = 'fa-tint';
            break;

            case 'motion' :
              deviceTemplate = templateStatic;
              deviceClass    = 'fa-street-view';
            break;

            case 'presence' :
              deviceTemplate = templateStatic;
              deviceClass    = 'fa-male';
            break;
          }

          if ((device.peripheral) && (device.peripheral.temp)) {
            peripherals.push(device.peripheral.temp + '&deg;');
          }

          if ((device.peripheral) && (device.peripheral.battery)) {
            peripherals.push(device.peripheral.battery + '%');
          }

          if (peripherals.length) {
            peripheral = ' (' + peripherals.join(' ') + ')';
          }

          if ((device.peripheral) && (device.peripheral.vibrate === 'on')) {
            vibrate = ' device-vibrate';
          }

          if (deviceTemplate) {
            deviceMarkup = deviceTemplate.split('{{SUB_DEVICE_ID}}').join(device.label.split(' ').join('+'));
            deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_NAME}}').join(device.label + peripheral);
            deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_CLASS}}').join(device.className || deviceClass);

            if (device.state === 'on') {
              deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATE}}').join(' device-active' + vibrate);
              deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATUS}}').join(translate('ACTIVE'));
            }

            else if (device.peripheral && device.peripheral.battery && device.peripheral.battery < 10) {
              deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATE}}').join(' peripheral batt' + vibrate);
              deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATUS}}').join(translate('INACTIVE'));
            }

            else {
              deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATE}}').join(vibrate);
              deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATUS}}').join(translate('INACTIVE'));
            }
          }

          return deviceMarkup;
        };

    if ((value) && (typeof value === 'object') && (typeof value.mode === 'string')) {
      mode       = value.mode;
      subdevices = value.devices;

      if (subdevices) {
        // You want to display SmartThings devices in groups.
        if (value.groups) {
          for (i in value.groups) {
            if (value.groups.hasOwnProperty(i)) {
              tempMarkup      = tempMarkup + templateGroup;
              subdeviceMarkup = '';

              for (j in value.groups[i]) {
                if (value.groups[i].hasOwnProperty(j)) {
                  subdeviceGroup = findSubdevices(value.groups[i][j], subdevices);

                  if (subdeviceGroup && subdeviceGroup[0]) {
                    subdeviceMarkup = subdeviceMarkup + getDeviceMarkup(subdeviceGroup[0]);
                  }
                }
              }

              tempMarkup = tempMarkup.split('{{GROUP_CLASS}}').join(encodeName(i));
              tempMarkup = tempMarkup.split('{{GROUP_TITLE}}').join(i);
              tempMarkup = tempMarkup.split('{{SUB_DEVICE_LIST}}').join(subdeviceMarkup);
            }
          }
        }

        // Otherwise, you want to show them in a list.
        else {
          for (i in subdevices) {
            if (subdevices.hasOwnProperty(i)) {
              tempMarkup = tempMarkup + getDeviceMarkup(subdevices[i]);
            }
          }
        }
      }

      switch (mode) {
        case 'Home' :
          markup = markup.split('{{DEVICE_STATE_HOME}}').join(' device-active');
          markup = markup.split('{{HOME_STATUS}}').join(translate('ACTIVE'));
        break;

        case 'Away' :
          markup = markup.split('{{DEVICE_STATE_AWAY}}').join(' device-active');
          markup = markup.split('{{AWAY_STATUS}}').join(translate('ACTIVE'));
        break;

        case 'Night' :
          markup = markup.split('{{DEVICE_STATE_NIGHT}}').join(' device-active');
          markup = markup.split('{{NIGHT_STATUS}}').join(translate('ACTIVE'));
        break;
      }
    }

    markup = markup.split('{{DEVICE_STATE_HOME}}').join('');
    markup = markup.split('{{DEVICE_STATE_AWAY}}').join('');
    markup = markup.split('{{DEVICE_STATE_NIGHT}}').join('');
    markup = markup.split('{{HOME_STATUS}}').join(translate('INACTIVE'));
    markup = markup.split('{{AWAY_STATUS}}').join(translate('INACTIVE'));
    markup = markup.split('{{NIGHT_STATUS}}').join(translate('INACTIVE'));

    return markup.replace('{{SMARTTHINGS_DYNAMIC}}', tempMarkup);
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
