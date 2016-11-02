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
 * @fileoverview If the specified device has a state change, announce via any
 *               configured method.
 * @note This is specific to a device state, not a subdevice or value.  This
 *       will alert you if your TV, PS3 or stereo are on - but cannot tell you
 *       if your air conditioner is on (as that is a value setting).
 */

 module.exports = (function () {
   'use strict';

   var State = {};

   return {
     version : 20161101,

     translate : function (token, lang) {
       var translate = require(__dirname + '/../lib/translate');

       return translate.translate('{{i18n_' + token + '}}', 'common', lang);
     },

     announceStateChange : function (deviceId, command, controllers, values) {
       var stateTitle  = '',
           notify,
           deviceTitle = controllers[deviceId].config.title,
           lang        = controllers.config.language,
           message     = '';

       if ((values) && (values.state)) {
         stateTitle = values.state === 'ok' ? 'ON' : 'OFF';

         if (State[deviceTitle] !== stateTitle) {
           if ((State[deviceTitle]) && (stateTitle)) {
             notify  = require(__dirname + '/../lib/notify');

             message = this.translate('STATE_CHANGE', lang);
             message = message.split('{{DEVICE}}').join(deviceTitle);
             message = message.split('{{STATE}}').join(this.translate(stateTitle, lang));

             notify.notify(message, controllers, deviceId);
           }

           State[deviceTitle] = stateTitle;
         }
       }
     }
   };
 }());
