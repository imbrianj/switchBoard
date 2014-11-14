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
    version : 20140113,

    /**
     * Finds all markup for a given client.  It will automatically include any
     * .tpl file within the templates/ directory with the same typeClass name.
     * It will also include any template fragments you've defined in your
     * controller.
     */
    loadTemplates : function(controllers) {
      var translate = require(__dirname + '/translate'),
          markup    = {},
          typeClass = '',
          i,
          j;

      for(i in controllers) {
        if(i !== 'config') {
          typeClass = controllers[i].config.typeClass;

          markup[typeClass] = { typeClass : typeClass, markup : controllers[i].markup };

          if(controllers[i].fragments) {
            markup[typeClass].fragments = controllers[i].fragments;
          }
        }
      }

      return markup;
    },

    /**
     * Loads markup and replaces general tokens.  Anything beyond a basic
     * controller may also require a parser.
     */
    loadMarkup : function(template, controllers, response) {
      var fs               = require('fs'),
          deviceState      = require(__dirname + '/deviceState'),
          translate        = require(__dirname + '/translate'),
          currentState     = {},
          markup           = template.split('{{THEME}}').join(controllers.config.theme),
          navTemplate      = fs.readFileSync(__dirname + '/../templates/fragments/navigation.tpl').toString(),
          controllerMarkup = '',
          deviceMarkup     = '',
          headerMarkup     = '',
          selectedClass    = '',
          deviceId         = '',
          fragments,
          device;

      for(device in controllers) {
        if((typeof controllers[device] === 'object') && (device !== 'config') && (controllers[device].markup) && (controllers[device].config.disabledMarkup !== true)) {
          deviceId      = controllers[device].config.deviceId;
          currentState  = deviceState.getDeviceState(deviceId);
          headerMarkup  = headerMarkup + navTemplate.split('{{DEVICE_ID}}').join(deviceId);
          headerMarkup  = headerMarkup.split('{{DEVICE_TITLE}}').join(controllers[device].config.title);
          selectedClass = '';

          /* Some controllers may require some special init work */
          if((typeof controllers[device].controller === 'object') && (typeof controllers[device].controller.onload === 'function')) {
            controllerMarkup = controllers[device].controller.onload(controllers[device]);
          }

          /* Many may have template fragments that will need to be included */
          else if((typeof controllers[device].controller === 'object') && (typeof controllers[device].parser === 'object')) {
            fragments = null;

            if(typeof controllers[device].fragments === 'object') {
              fragments = controllers[device].fragments;
            }

            controllerMarkup = controllers[device].parser[controllers[device].config.typeClass](device, controllers[device].markup, currentState.state, currentState.value, fragments, controllers.config.language);
          }

          /* Basic controllers just need one markup template. */
          else {
            controllerMarkup = controllers[device].markup;
          }

          deviceMarkup = deviceMarkup + controllerMarkup.split('{{DEVICE_ID}}').join(deviceId);
          deviceMarkup = deviceMarkup.split('{{DEVICE_TYPE}}').join(controllers[device].config.typeClass);

          if((device === controllers.config.default) || (controllers.config.theme.indexOf('dashboard') !== -1)) {
            selectedClass = ' selected';
            deviceMarkup = deviceMarkup.split('{{LAZY_LOAD_IMAGE}}').join('src');
          }

          else {
            deviceMarkup = deviceMarkup.split('{{LAZY_LOAD_IMAGE}}').join('data-src');
          }

          if((currentState) && (currentState.state) && (currentState.state === 'ok')) {
            deviceMarkup = deviceMarkup.split('{{DEVICE_STATE}}').join(' device-on');
            deviceMarkup = deviceMarkup.split('{{DEVICE_ACTIVE}}').join(translate.translate('{{i18n_ACTIVE}}', 'container', controllers.config.language));
          }

          else {
            deviceMarkup = deviceMarkup.split('{{DEVICE_STATE}}').join(' device-off');
            deviceMarkup = deviceMarkup.split('{{DEVICE_ACTIVE}}').join(translate.translate('{{i18n_INACTIVE}}', 'container', controllers.config.language));
          }

          headerMarkup = headerMarkup.split('{{DEVICE_SELECTED}}').join(selectedClass);
          deviceMarkup = deviceMarkup.split('{{DEVICE_SELECTED}}').join(selectedClass);
        }
      }

      markup = translate.translate(markup, 'container', controllers.config.language);
      markup = markup.split('{{NAVIGATION}}').join(headerMarkup);
      markup = markup.split('{{DEVICE_INTERFACES}}').join(deviceMarkup);

      return markup;
    }
  };
}());
