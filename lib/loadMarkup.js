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

    /**
     * Finds all markup for a given client.  It will automatically include any
     * .tpl file within the templates/ directory with the same typeClass name.
     * However, if you wish to include a template fragment to be handled by a
     * parser, it must be registered here.
     */
    loadTemplates : function(controllers) {
      var fs        = require('fs'),
          markup    = {},
          typeClass = '',
          i;

      for(i in controllers) {
        if(i !== 'config') {
          typeClass = controllers[i].config.typeClass;

          markup[typeClass] = { typeClass : typeClass, markup : controllers[i].markup };

          switch(typeClass) {
            case 'roku' :
              markup[typeClass].fragments = { list : fs.readFileSync(__dirname + '/../templates/fragments/roku.tpl').toString() };
            break;

            case 'stocks' :
              markup[typeClass].fragments = { list : fs.readFileSync(__dirname + '/../templates/fragments/stocks.tpl').toString() };
            break;

            case 'weather' :
              markup[typeClass].fragments = { forecast : fs.readFileSync(__dirname + '/../templates/fragments/weather.tpl').toString() };
            break;

            case 'travis' :
              markup[typeClass].fragments = { build : fs.readFileSync(__dirname + '/../templates/fragments/travis.tpl').toString() };
            break;

            case 'nest' :
              markup[typeClass].fragments = { group      : fs.readFileSync(__dirname + '/../templates/fragments/nestGroups.tpl').toString(),
                                              thermostat : fs.readFileSync(__dirname + '/../templates/fragments/nestThermostat.tpl').toString(),
                                              protect    : fs.readFileSync(__dirname + '/../templates/fragments/nestProtect.tpl').toString() };
            break;

            case 'smartthings' :
              markup[typeClass].fragments = { group    : fs.readFileSync(__dirname + '/../templates/fragments/smartthingsGroups.tpl').toString(),
                                              lock     : fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListLock.tpl').toString(),
                                              switch   : fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListSwitch.tpl').toString(),
                                              contact  : fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListContact.tpl').toString(),
                                              water    : fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListWater.tpl').toString(),
                                              motion   : fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListMotion.tpl').toString(),
                                              presence : fs.readFileSync(__dirname + '/../templates/fragments/smartthingsListPresence.tpl').toString() };
            break;
          }
        }
      }

      return markup;
    },

    /**
     * Loads markup and replaces general tokens.  Anything beyond a basic
     * controller may also require a parser, which is handled in the specific
     * controller's onload() method.
     */
    loadMarkup : function(template, controllers, response) {
      var fs               = require('fs'),
          deviceState      = require(__dirname + '/deviceState'),
          currentState     = {},
          markup           = template.split('{{THEME}}').join(controllers.config.theme),
          navTemplate      = fs.readFileSync(__dirname + '/../templates/fragments/navigation.tpl').toString(),
          controllerMarkup = '',
          deviceMarkup     = '',
          headerMarkup     = '',
          selectedClass    = '',
          deviceId         = '',
          device;

      for(device in controllers) {
        if((typeof controllers[device] === 'object') && (device !== 'config') && (controllers[device].markup) && (controllers[device].config.disabledMarkup !== true)) {
          deviceId      = controllers[device].config.deviceId;
          currentState  = deviceState.getDeviceState(deviceId);
          headerMarkup  = headerMarkup + navTemplate.split('{{DEVICE_ID}}').join(deviceId);
          headerMarkup  = headerMarkup.split('{{DEVICE_TITLE}}').join(controllers[device].config.title);
          selectedClass = '';

          if((typeof controllers[device].controller === 'object') && (typeof controllers[device].controller.onload === 'function')) {
            controllerMarkup = controllers[device].controller.onload(controllers[device]);
          }

          else {
            controllerMarkup = controllers[device].markup;
          }

          deviceMarkup = deviceMarkup + controllerMarkup.split('{{DEVICE_ID}}').join(deviceId);
          deviceMarkup = deviceMarkup.split('{{DEVICE_TYPE}}').join(controllers[device].config.typeClass);

          if(device === controllers.config.default) {
            selectedClass = ' selected';
            deviceMarkup = deviceMarkup.split('{{LAZY_LOAD_IMAGE}}').join('src');
          }

          else {
            deviceMarkup = deviceMarkup.split('{{LAZY_LOAD_IMAGE}}').join('data-src');
          }

          if((currentState) && (currentState.state) && (currentState.state === 'ok')) {
            deviceMarkup = deviceMarkup.split('{{DEVICE_STATE}}').join(' device-on');
          }

          else {
            deviceMarkup = deviceMarkup.split('{{DEVICE_STATE}}').join(' device-off');
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
