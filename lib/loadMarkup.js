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
 * @fileoverview Load markup required for interface, doing basic template
 *               substitutions as necessary.
 * @requires fs
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140626,

    loadTemplates : function(controllers) {
      var fs     = require('fs'),
          markup = {},
          i;

      for(i in controllers) {
        if(i !== 'config') {
          markup[i] = { typeClass : controllers[i].config.deviceId, markup : controllers[i].markup };

          switch(controllers[i].config.typeClass) {
            case 'roku' :
              markup[i].fragments = { list : fs.readFileSync(__dirname + '/../templates/fragments/roku.tpl').toString(), };
            break;

            case 'stocks' :
              markup[i].fragments = { list : fs.readFileSync(__dirname + '/../templates/fragments/stocks.tpl').toString(), };
            break;

            case 'smartthings' :
              markup[i].fragments = { group  : fs.readFileSync(__dirname + '/../templates/fragments/smartthingsGroups.tpl').toString(),
                                      lock   : fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListLock.tpl').toString(),
                                      switch : fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListSwitch.tpl').toString() };
            break;
          }
        }
      }

      return markup;
    },

    loadMarkup : function(template, controllers, response) {
      var fs               = require('fs'),
          markup           = template.split('{{THEME}}').join(controllers.config.theme),
          navTemplate      = fs.readFileSync(__dirname + '/../templates/fragments/navigation.tpl').toString(),
          controllerMarkup = '',
          deviceMarkup     = '',
          headerMarkup     = '',
          selectedClass    = '',
          device;

      for(device in controllers) {
        if((typeof controllers[device] === 'object') && (device !== 'config') && (controllers[device].markup) && (controllers[device].config.disabledMarkup !== true)) {
          headerMarkup  = headerMarkup + navTemplate.split('{{DEVICE_ID}}').join(controllers[device].config.deviceId);
          headerMarkup  = headerMarkup.split('{{DEVICE_TITLE}}').join(controllers[device].config.title);
          selectedClass = '';

          if((typeof controllers[device].controller === 'object') && (typeof controllers[device].controller.onload === 'function')) {
            controllerMarkup = controllers[device].controller.onload(controllers[device]);
          }

          else {
            controllerMarkup = controllers[device].markup;
          }

          deviceMarkup = deviceMarkup + controllerMarkup.split('{{DEVICE_ID}}').join(controllers[device].config.deviceId);
          deviceMarkup = deviceMarkup.split('{{DEVICE_TYPE}}').join(controllers[device].config.typeClass);

          if(device === controllers.config.default) {
            selectedClass = ' selected';
            deviceMarkup = deviceMarkup.split('{{LAZY_LOAD_IMAGE}}').join('src');
          }

          else {
            deviceMarkup = deviceMarkup.split('{{LAZY_LOAD_IMAGE}}').join('data-src');
          }

          headerMarkup = headerMarkup.split('{{DEVICE_SELECTED}}').join(selectedClass);
          deviceMarkup = deviceMarkup.split('{{DEVICE_SELECTED}}').join(selectedClass);
        }
      }

      markup = markup.split('{{NAVIGATION}}').join(headerMarkup);
      markup = markup.split('{{DEVICE_INTERFACES}}').join(deviceMarkup);

      return markup;
    }
  };
}());
