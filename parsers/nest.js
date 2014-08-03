/*jslint white: true */
/*global module, console */

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

(function(exports){
  'use strict';

  exports.nest = function (deviceId, markup, state, value, fragments) {
    var templateThermostat = fragments.thermostat,
        templateProtect    = fragments.protect,
        templateGroup      = fragments.group,
        thermostatMarkup   = '',
        protectMarkup      = '',
        stateClass         = '',
        device             = {},
        i;

    if(value) {
      for(i in value.thermostat) {
        device = value.thermostat[i];

        switch(device.state) {
          case 'cool' :
            stateClass = 'device-active cool';
          break;

          case 'heat' :
            stateClass = 'device-active heat';
          break;

          default :
            stateClass = '';
          break;
        }

        thermostatMarkup = thermostatMarkup + templateThermostat.split('{{SUB_DEVICE_STATE}}').join(stateClass);
        thermostatMarkup = thermostatMarkup.split('{{SUB_DEVICE_NAME}}').join(device.label);
        thermostatMarkup = thermostatMarkup.split('{{SUB_DEVICE_MODE}}').join(device.state);
        thermostatMarkup = thermostatMarkup.split('{{SUB_DEVICE_TEMP}}').join(Math.round(device.temp) + '&deg;');
        thermostatMarkup = thermostatMarkup.split('{{SUB_DEVICE_TARGET}}').join(Math.round(device.target) + '&deg;');
        thermostatMarkup = thermostatMarkup.split('{{SUB_DEVICE_HUMIDITY}}').join(Math.round(device.humidity) + '%');
      }

      for(i in value.protect) {
        stateClass = '';
        device     = value.protect[i];

        if(device.smoke !== 'ok') {
          stateClass = stateClass + 'smoke ';
        }

        if(device.co !== 'ok') {
          stateClass = stateClass + 'co ';
        }

        if(device.battery !== 'ok') {
          stateClass = stateClass + 'batt ';
        }

        if(stateClass) {
          stateClass = stateClass + 'device-active';
        }

        protectMarkup = protectMarkup + templateProtect.split('{{SUB_DEVICE_STATE}}').join(stateClass);
        protectMarkup = protectMarkup.split('{{SUB_DEVICE_NAME}}').join(device.label);
        protectMarkup = protectMarkup.split('{{SUB_DEVICE_SMOKE}}').join(device.smoke);
        protectMarkup = protectMarkup.split('{{SUB_DEVICE_CO}}').join(device.co);
        protectMarkup = protectMarkup.split('{{SUB_DEVICE_BATT}}').join(device.battery);
      }

      if(thermostatMarkup) {
        thermostatMarkup = templateGroup.replace('{{SUB_DEVICE_LIST}}', thermostatMarkup);
        thermostatMarkup = thermostatMarkup.replace('{{SUB_DEVICE_CLASS}}', '');
        thermostatMarkup = thermostatMarkup.replace('{{SUB_DEVICE_NAME}}', 'Thermostat');
      }

      if(protectMarkup) {
        protectMarkup = templateGroup.replace('{{SUB_DEVICE_LIST}}', protectMarkup);
        protectMarkup = protectMarkup.replace('{{SUB_DEVICE_CLASS}}', ' text-device-status');
        protectMarkup = protectMarkup.replace('{{SUB_DEVICE_NAME}}', 'Protect');
      }
    }

    markup = markup.replace('{{NEST_DYNAMIC}}', thermostatMarkup + protectMarkup);

    return markup;
  };
})(typeof exports === 'undefined' ? this.Switchboard.parsers : exports);
