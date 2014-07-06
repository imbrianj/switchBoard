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
 * @fileoverview Load controller files and populates them with markup if
 *               available.  Runs init scripts against controllers if
 *               available.
 * @requires fs
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140619,

    loadControllerFile : function(controllerConfig, deviceId, config) {
      var fs          = require('fs'),
          deviceState = require(__dirname + '/deviceState'),
          Device      = function() {},
          controller  = new Device();

      if(fs.existsSync(__dirname + '/../controllers/' + controllerConfig.typeClass + '.js')) {
        controller.controller = require(__dirname + '/../controllers/' + controllerConfig.typeClass);
        controller.config = controllerConfig;
        console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Loaded ' + controller.config.typeClass + ' controller');
      }

      else {
        controller.config = controllerConfig;
        console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Loaded without a controller for ' + controller.config.typeClass);
      }

      if(fs.existsSync(__dirname + '/../templates/' + controllerConfig.typeClass + '.tpl')) {
        controller.markup = fs.readFileSync(__dirname + '/../templates/' + controllerConfig.typeClass + '.tpl').toString();
        console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Loaded markup template for ' + controller.config.typeClass);
      }

      if(fs.existsSync(__dirname + '/../events/' + controllerConfig.typeClass + '.js')) {
        controller.event = require(__dirname + '/../events/' + controllerConfig.typeClass);
        console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Loaded events for ' + controller.config.typeClass);
      }

      controller = this.initController(controller, config);

      deviceState.updateState(deviceId, controllerConfig.typeClass, {});

      return controller;
    },

    loadController : function(devices) {
      var schedule    = require('./schedule'),
          deviceId,
          lastGood    = '',
          controllers = { 'config' : devices.config };

      for(deviceId in devices) {
        if((typeof devices[deviceId] === 'object')  &&
           (devices[deviceId].disabled !== true) &&
           (deviceId !== 'config')) {
          devices[deviceId].deviceId = deviceId;

          controllers[deviceId] = this.loadControllerFile(devices[deviceId], deviceId, controllers.config);

          if(controllers[deviceId].hasOwnProperty('markup')) {
            lastGood = deviceId;
          }
        }
      }

      if(!controllers.hasOwnProperty(controllers.config.default)) {
        console.log('\x1b[31m=====================================================================\x1b[0m');

        if(controllers.hasOwnProperty(lastGood)) {
          console.log('WARNING: You\'ve specified an invalid controller as your default view!');
          console.log('WARNING: Using ' + lastGood + ' as default device!');

          controllers.config.default = lastGood;
        }

        else {
          console.log('WARNING: You have no valid controllers configured!');
          console.log('WARNING: Server refusing to start till you fix your config!');

          controllers = null;
        }

        console.log('\x1b[31m=====================================================================\x1b[0m');
      }

      if(controllers) {
        schedule.scheduleInit(controllers);
      }

      return controllers;
    },

    initController : function(controller, config) {
      var newController = controller;

      if((typeof controller.controller === 'object') && (typeof controller.controller.init === 'function')) {
        newController = controller.controller.init(controller, config) || controller;
        console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Init ran for ' + controller.config.typeClass);
      }

      return newController;
    }
  };
}());
