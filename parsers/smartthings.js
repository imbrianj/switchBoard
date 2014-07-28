/*jslint white: true */
/*global module, console */

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

(function(exports){
  'use strict';

  exports.smartthings = function (deviceId, markup, state, value, fragments) {
    var templateSwitch    = fragments.switch,
        templateLock      = fragments.lock,
        templateContact   = fragments.contact,
        templateWater     = fragments.water,
        templateMotion    = fragments.motion,
        templatePresence  = fragments.presence,
        templateGroup     = fragments.group,
        i                 = 0,
        j                 = 0,
        tempMarkup        = '',
        deviceMarkup      = '',
        mode              = '',
        subDeviceMarkup   = '',
        subDevice,
        subDevices,
        subDeviceGroup,
        encodeName = function(name) {
          name = name.split(' ').join('_');
          name = name.split('>').join('_');
          name = name.split('<').join('_');
          name = name.split('"').join('_');
          name = name.split('\'').join('_');
          name = name.split('!').join('_');
          name = name.split('@').join('_');
          name = name.split('#').join('_');
          name = name.split('$').join('_');
          name = name.split('%').join('_');
          name = name.split('^').join('_');
          name = name.split('&').join('_');
          name = name.split('*').join('_');
          name = name.split('(').join('_');
          name = name.split(')').join('_');
          name = name.split(',').join('_');
          name = name.split(';').join('_');
          name = name.split('.').join('_');
          name = 'group-' + name.toLowerCase();

          return name;
        },
        findSubDevices = function (subDeviceLabel, subDevices) {
          var subDevice = {},
              collected = [],
              i         = 0,
              j         = 0;

          for(i in subDevices) {
            subDevice = subDevices[i];

            if(subDevice.label === subDeviceLabel) {
              collected[j] = subDevice;
              j += 1;
            }
          }

          return collected;
        },
        getDeviceMarkup = function(device, markup) {
          var deviceTemplate = '',
              deviceMarkup   = '',
              peripheral     = '';

          switch(device.type) {
            case 'switch' :
              deviceTemplate = templateSwitch;
            break;

            case 'lock' :
              deviceTemplate = templateLock;
            break;

            case 'contact' :
              deviceTemplate = templateContact;
            break;

            case 'water' :
              deviceTemplate = templateWater;
            break;

            case 'motion' :
              deviceTemplate = templateMotion;
            break;

            case 'presence' :
              deviceTemplate = templatePresence;
            break;
          }

          if((device.peripheral) && (device.peripheral.temp)) {
            peripheral = ' (' + device.peripheral.temp + '&deg;)';
          }

          deviceMarkup = deviceTemplate.split('{{SUB_DEVICE_ID}}').join(device.label.split(' ').join('+'));
          deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_NAME}}').join(device.label + peripheral);

          if(device.state === 'on') {
            deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATE}}').join(' device-active');
          }

          else {
            deviceMarkup = deviceMarkup.split('{{SUB_DEVICE_STATE}}').join('');
          }

          return deviceMarkup;
        };

    if((value) && (typeof value === 'object') && (typeof value.mode === 'string')) {
      mode       = value.mode;
      subDevices = value.devices;

      if(subDevices) {
        // You want to display SmartThings devices in groups.
        if(value.groups) {
          for(i in value.groups) {
            tempMarkup      = tempMarkup + templateGroup;
            subDeviceMarkup = '';

            for(j in value.groups[i]) {
              subDeviceGroup = findSubDevices(value.groups[i][j], subDevices);

              if(subDeviceGroup && subDeviceGroup[0]) {
                subDeviceMarkup = subDeviceMarkup + getDeviceMarkup(subDeviceGroup[0]);
              }
            }

            tempMarkup = tempMarkup.split('{{GROUP_CLASS}}').join(encodeName(i));
            tempMarkup = tempMarkup.split('{{GROUP_TITLE}}').join(i);
            tempMarkup = tempMarkup.split('{{SUB_DEVICE_LIST}}').join(subDeviceMarkup);
          }
        }

        // Otherwise, you want to show them in a list.
        else {
          for(i in subDevices) {
            tempMarkup = tempMarkup + getDeviceMarkup(subDevices[i]);
          }
        }
      }

      switch(mode) {
        case 'Home' :
          markup = markup.split('{{DEVICE_STATE_HOME}}').join(' device-active');
        break;

        case 'Away' :
          markup = markup.split('{{DEVICE_STATE_AWAY}}').join(' device-active');
        break;

        case 'Night' :
          markup = markup.split('{{DEVICE_STATE_NIGHT}}').join(' device-active');
        break;
      }
    }

    markup = markup.split('{{DEVICE_STATE_HOME}}').join('');
    markup = markup.split('{{DEVICE_STATE_AWAY}}').join('');
    markup = markup.split('{{DEVICE_STATE_NIGHT}}').join('');

    return markup.replace('{{SMARTTHINGS_DYNAMIC}}', tempMarkup);
  };
})(typeof exports === 'undefined' ? this.Switchboard.parsers : exports);
