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
 * @fileoverview After a command to operate a Nest thermostat, check SmartThings
 *               to see if any windows are open.  If so, do not allow the
 *               thermostat start
 */

 module.exports = (function () {
   'use strict';

   return {
     version : 20180922,

     translate : function (token, lang) {
       var translate = require(__dirname + '/../../lib/translate');

       return translate.translate('{{i18n_' + token + '}}', 'smartthings', lang);
     },

     formatMessage : function (contact, thermostat, state, lang) {
       var sharedUtil  = require(__dirname + '/../../lib/sharedUtil').util,
           windows     = '',
           thermostats = '',
           type        = '',
           message     = '';

       windows     = sharedUtil.arrayList(contact, 'smartthings', lang);
       thermostats = sharedUtil.arrayList(thermostat, 'nest', lang);
       type        = this.translate(state === 'heat' ? 'HEAT' : 'AIR_CONDITION', lang);
       message     = this.translate('HVAC_ABORT', lang);
       message     = message.split('{{WINDOW}}').join(windows);
       message     = message.split('{{HVAC}}').join(thermostat);
       message     = message.split('{{COMMAND}}').join(type);

       return message;
     },

     nestWindowOpen : function (deviceId, command, controllers, config) {
       var notify           = require(__dirname + '/../../lib/notify'),
           deviceState      = require(__dirname + '/../../lib/deviceState'),
           commandParts     = command.split('-'),
           commandSubdevice = '',
           commandType      = '',
           checkState,
           message          = '',
           status;

       if ((commandParts.length === 4) && (command.indexOf('subdevice-mode-' === 0))) {
         commandSubdevice = commandParts[2];
         commandType = commandParts[3];
       }

       checkState = function () {
         var currDevice,
             currentDevice = {},
             status        = { thermostat : [], contact : [] },
             subdeviceId,
             subdevice;

         for (currDevice in controllers) {
           if (controllers[currDevice].config) {
             switch (controllers[currDevice].config.typeClass) {
               case 'nest' :
                 currentDevice = deviceState.getDeviceState(currDevice);

                 if (currentDevice.value) {
                   for (subdeviceId in currentDevice.value.devices) {
                     if (currentDevice.value.devices.hasOwnProperty(subdeviceId)) {
                       subdevice = currentDevice.value.devices[subdeviceId];

                       if ((config.thermostat.indexOf(subdevice.label) !== -1) && (subdevice.type === 'thermostat') && (subdevice.label === commandSubdevice) && (currentDevice.state !== 'err')) {
                         status.thermostat.push(subdevice.label);
                       }
                     }
                   }
                 }
               break;

               // Look through SmartThings for any open contacts.
               case 'smartthings' :
                 currentDevice = deviceState.getDeviceState(currDevice);

                 if (currentDevice.value) {
                   for (subdeviceId in currentDevice.value.devices) {
                     if (currentDevice.value.devices.hasOwnProperty(subdeviceId)) {
                       subdevice = currentDevice.value.devices[subdeviceId];

                       if ((config.contact.indexOf(subdevice.label) !== -1) && (subdevice.type === 'contact') && (subdevice.state === 'on')) {
                         status.contact.push(subdevice.label);
                       }
                     }
                   }
                 }
               break;
             }
           }
         }

         return status;
       };

       // We only care if it's a command to turn a thermostat on.  Never
       // restrict turning it off.
       if ((commandType === 'heat') || (commandType === 'cool')) {
         status = checkState();

         if ((status.thermostat.length) && (status.contact.length)) {
           message = this.formatMessage(status.contact, status.thermostat, status.thermostat[0].state, controllers.config.language);
           notify.notify(message, controllers, deviceId);

           return false;
         }
       }
     }
   };
 }());
