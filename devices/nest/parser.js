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

  exports.nest = function (deviceId, markup, state, value, fragments, language) {
    var templateThermostat = fragments.thermostat,
        templateProtect    = fragments.protect,
        templateGroup      = fragments.group,
        thermostatMarkup   = '',
        protectMarkup      = '',
        stateClass         = '',
        device             = {},
        i,
        heat,
        cool,
        off,
        encodeName = function (name) {
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
        translate  = function (message) {
          var util;

          if ((typeof SB === 'object') && (typeof SB.util === 'object')) {
            message = SB.util.translate(message, 'nest');
          }

          else {
            util    = require(__dirname + '/../../lib/sharedUtil').util;
            message = util.translate(message, 'nest', language);
          }

          return message;
        };

    if (value) {
      for (i in value.devices) {
        if (value.devices.hasOwnProperty(i)) {
          device = value.devices[i];

          if (device.type === 'thermostat') {
            if (typeof SB === 'object') {
              if (SB.getByClass(encodeName(device.label), SB.get(deviceId), 'li')[0]) {
                off  = SB.getByClass(encodeName(device.label), SB.get(deviceId), 'li')[0];
                heat = SB.getByClass('fa-sun-o',       off, 'a')[0];
                cool = SB.getByClass('fa-snowflake-o', off, 'a')[0];

                if ((device.state === 'cool') && (!SB.hasClass(cool, 'device-active'))) {
                  SB.addClass(cool,    'device-active');
                  SB.removeClass(heat, 'device-active');
                  SB.removeClass(off,  'device-off');
                  SB.putText(SB.getByTag('em', off)[0], translate('COOL'));
                  markup = '';
                }

                else if ((device.state === 'heat') && (!SB.hasClass(heat, 'device-active'))) {
                  SB.addClass(heat,    'device-active');
                  SB.removeClass(cool, 'device-active');
                  SB.removeClass(off,  'device-off');
                  SB.putText(SB.getByTag('em', off)[0], translate('HEAT'));
                  markup = '';
                }

                else if ((device.state === 'off') && (!SB.hasClass(off, 'device-off'))) {
                  SB.addClass(off,     'device-off');
                  SB.removeClass(cool, 'device-active');
                  SB.removeClass(heat, 'device-active');
                  SB.putText(SB.getByTag('em', off)[0], translate('OFF'));
                  markup = '';
                }
              }
            }

            thermostatMarkup = thermostatMarkup + templateThermostat.split('{{SUB_DEVICE_ID}}').join(encodeName(device.label));
            thermostatMarkup = thermostatMarkup.split('{{SUB_DEVICE_NAME}}').join(device.label);
            thermostatMarkup = thermostatMarkup.split('{{SUB_DEVICE_TEMP}}').join(Math.round(device.temp));
            thermostatMarkup = thermostatMarkup.split('{{SUB_DEVICE_TARGET}}').join(Math.round(device.target));
            thermostatMarkup = thermostatMarkup.split('{{SUB_DEVICE_HUMIDITY}}').join(Math.round(device.humidity));

            switch (device.state) {
              case 'cool' :
                thermostatMarkup = thermostatMarkup.split('{{DEVICE_STATE_COOL}}').join(' device-active');
                thermostatMarkup = thermostatMarkup.split('{{SUB_DEVICE_STATUS}}').join(translate('COOL'));
              break;

              case 'heat' :
                thermostatMarkup = thermostatMarkup.split('{{DEVICE_STATE_HEAT}}').join(' device-active');
                thermostatMarkup = thermostatMarkup.split('{{SUB_DEVICE_STATUS}}').join(translate('HEAT'));
              break;

              default :
                thermostatMarkup = thermostatMarkup.split('{{DEVICE_STATE_OFF}}').join(' device-off');
                thermostatMarkup = thermostatMarkup.split('{{SUB_DEVICE_STATUS}}').join(translate('OFF'));
              break;
            }

            if (device.leaf === true) {
              thermostatMarkup = thermostatMarkup.split('{{DEVICE_STATE_LEAF}}').join(' device-active');
            }

            if ((value.presence) && (value.presence === 'on')) {
              thermostatMarkup = thermostatMarkup.split('{{DEVICE_STATE_HOME}}').join(' device-active');
            }

            else {
              thermostatMarkup = thermostatMarkup.split('{{DEVICE_STATE_AWAY}}').join(' device-active');
            }

            thermostatMarkup = thermostatMarkup.split('{{DEVICE_STATE_COOL}}').join('');
            thermostatMarkup = thermostatMarkup.split('{{DEVICE_STATE_HEAT}}').join('');
            thermostatMarkup = thermostatMarkup.split('{{DEVICE_STATE_OFF}}').join('');
            thermostatMarkup = thermostatMarkup.split('{{DEVICE_STATE_LEAF}}').join('');
            thermostatMarkup = thermostatMarkup.split('{{DEVICE_STATE_HOME}}').join('');
            thermostatMarkup = thermostatMarkup.split('{{DEVICE_STATE_AWAY}}').join('');
          }

          else if (device.type === 'protect') {
            stateClass = '';

            if (device.smoke !== 'ok') {
              stateClass = stateClass + 'smoke ';
            }

            if (device.co !== 'ok') {
              stateClass = stateClass + 'co ';
            }

            if (device.battery !== 'ok') {
              stateClass = stateClass + 'batt ';
            }

            if (stateClass) {
              stateClass = stateClass + 'device-active';
            }

            protectMarkup = protectMarkup + templateProtect.split('{{SUB_DEVICE_STATE}}').join(stateClass);
            protectMarkup = protectMarkup.split('{{SUB_DEVICE_NAME}}').join(device.label);
            protectMarkup = protectMarkup.split('{{SUB_DEVICE_SMOKE}}').join(device.smoke);
            protectMarkup = protectMarkup.split('{{SUB_DEVICE_CO}}').join(device.co);
            protectMarkup = protectMarkup.split('{{SUB_DEVICE_BATT}}').join(device.battery);
          }
        }
      }

      if (thermostatMarkup) {
        thermostatMarkup = templateGroup.replace('{{SUB_DEVICE_LIST}}',     thermostatMarkup);
        thermostatMarkup = thermostatMarkup.replace('{{SUB_DEVICE_CLASS}}', ' control-device-status');
        thermostatMarkup = thermostatMarkup.replace('{{SUB_DEVICE_NAME}}',  translate('THERMOSTAT'));
      }

      if (protectMarkup) {
        protectMarkup = templateGroup.replace('{{SUB_DEVICE_LIST}}',  protectMarkup);
        protectMarkup = protectMarkup.replace('{{SUB_DEVICE_CLASS}}', ' text-device-status');
        protectMarkup = protectMarkup.replace('{{SUB_DEVICE_NAME}}',  translate('PROTECT'));
      }
    }

    markup = markup.replace('{{NEST_DYNAMIC}}', thermostatMarkup + protectMarkup);

    return markup;
  };
})(typeof exports === 'undefined' ? this.SB.spec.parsers : exports);
