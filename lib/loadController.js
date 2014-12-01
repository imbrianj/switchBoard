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
    version : 20141130,

    /**
     * Finds all relevant files for a given controller and loads them up.
     */
    loadControllerFile : function(controllerConfig, deviceId, config) {
      var fs           = require('fs'),
          translate    = require(__dirname + '/translate'),
          Device       = function() {},
          controller   = new Device(),
          i,
          j;

      if(fs.existsSync(__dirname + '/../controllers/' + controllerConfig.typeClass + '.js')) {
        controller.controller = require(__dirname + '/../controllers/' + controllerConfig.typeClass);
        controller.config = controllerConfig;
        console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Loaded ' + controller.config.typeClass + ' controller');

        if(typeof controller.controller.state === 'function') {
          controller.controller.inputs.push('state');
          console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Loaded state function');
        }
      }

      else {
        controller.config = controllerConfig;
        console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Loaded without a controller for ' + controller.config.typeClass);
      }

      if(fs.existsSync(__dirname + '/../templates/' + controllerConfig.typeClass + '.tpl')) {
        controller.markup = fs.readFileSync(__dirname + '/../templates/' + controllerConfig.typeClass + '.tpl').toString();
        controller.markup = translate.translate(controller.markup, controllerConfig.typeClass, config.language);
        console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Loaded markup template for ' + controller.config.typeClass);
      }

      if((controller.controller) && (typeof controller.controller.fragments === 'function')) {
        controller.fragments = controller.controller.fragments();

        for(i in controller.fragments) {
          controller.fragments[i] = translate.translate(controller.fragments[i], controllerConfig.typeClass, config.language);
        }

        console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Loaded template fragments for ' + controller.config.typeClass);
      }

      if(fs.existsSync(__dirname + '/../parsers/' + controllerConfig.typeClass + '.js')) {
        controller.parser = require(__dirname + '/../parsers/' + controllerConfig.typeClass);
        console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Loaded parser for ' + controller.config.typeClass);
      }

      if(!controllerConfig.disablePolling) {
        if(fs.existsSync(__dirname + '/../pollers/' + controllerConfig.typeClass + '.js')) {
          controller.poll = require(__dirname + '/../pollers/' + controllerConfig.typeClass).poll;
          console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Loaded poller for ' + controller.config.typeClass);
        }
      }

      if(controllerConfig.apps) {
        controller.apps = {};

        for(j in controllerConfig.apps) {
          if(fs.existsSync(__dirname + '/../apps/' + controllerConfig.apps[j].id + '.js')) {
            controller.apps[controllerConfig.apps[j].id] = require(__dirname + '/../apps/' + controllerConfig.apps[j].id + '.js')[controllerConfig.apps[j].id];
            console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Loaded ' + j + ' app');
          }

          else {
            console.log('\x1b[31m' + controller.config.title + '\x1b[0m: Failed to load ' + j + ' app');
          }
        }
      }

      return controller;
    },

    /**
     * Takes in your devices list and begins creating a controllers object.
     * If no valid controller is found - or if there are any issues, it'll try
     * to catch it now and alert you in console.
     *
     * If you have valid controllers, it'll initialize them and set state.
     */
    loadController : function(devices) {
      var schedule     = require(__dirname + '/schedule'),
          runCommand   = require(__dirname + '/runCommand'),
          deviceState  = require(__dirname + '/deviceState'),
          currentState,
          deviceId,
          lastGood     = '',
          controllers  = { 'config' : devices.config },
          initialState = {};

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
          console.log('\x1b[31mWARNING\x1b[0m: You\'ve specified an invalid controller as your default view!');
          console.log('\x1b[31mWARNING\x1b[0m: Using ' + lastGood + ' as default device!');

          controllers.config.default = lastGood;
        }

        else {
          console.log('\x1b[31mWARNING\x1b[0m: You have no valid controllers configured!');
          console.log('\x1b[31mWARNING\x1b[0m: Server refusing to start till you fix your config!');

          controllers = null;
        }

        console.log('\x1b[31m=====================================================================\x1b[0m');
      }

      if(controllers) {
        // We run this now so that any issued commands have the basic controller
        // to use.
        runCommand.init(controllers);

        for(deviceId in controllers) {
          if(deviceId !== 'config') {
            controllers[deviceId] = this.initController(controllers[deviceId], controllers.config);
            currentState          = deviceState.getDeviceState(deviceId);

            if(currentState) {
              if(currentState.state) {
                initialState.state = currentState.state;
              }

              if(currentState.value) {
                initialState.value = currentState.value;
              }
            }

            deviceState.updateState(deviceId, controllers[deviceId].config.typeClass, initialState);
          }
        }

        schedule.scheduleInit(controllers);
      }

      // We run this again to update the controllers with any changes that may
      // have occurred during the controller init.
      runCommand.init(controllers);

      return controllers;
    },

    /**
     * If you have a valid controller and that controller has an init method,
     * we'll try to fire it off.  If the init method returns an altered
     * controller (as some require making an API call to initialize), we'll then
     * take those changes.  Otherwise, we'll keep using the controller as-is.
     */
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
