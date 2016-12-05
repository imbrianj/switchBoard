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
 * @fileoverview Manages and executes configured apps.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20161204,

    /**
     * Accept a set (or subset) of controllers and an array of controller IDs
     * ane return an object mapping only controller ID to controller typeclass.
     */
    filterControllers : function (device, controllers, controllerIds) {
      var filteredControllers = { config : controllers.config },
          i;

      filteredControllers[device] = controllers[device];

      if ((controllerIds) && (controllers)) {
        for (i = 0; i < controllerIds.length; i += 1) {
          if (typeof controllers[controllerIds[i]] === 'object') {
            filteredControllers[controllerIds[i]] = { config : { typeClass : controllers[controllerIds[i]].config.typeClass,
                                                                 title     : controllers[controllerIds[i]].config.title } };
          }

          else {
            console.log('\x1b[31m' + controllers[device].config.title + '\x1b[0m: ' + controllerIds[i] + ' ignored - is it configured and enabled?');
          }
        }
      }

      return filteredControllers;
    },

    /**
     * Accept the device name, issued command, returned values (if applicable)
     * and set (or subset) of controllers that will be filtered down and passed
     * along to any associated apps.
     */
    execute : function (device, command, values, controllers, appParams) {
      var controller          = controllers[device],
          filteredControllers = {},
          appName,
          appId,
          delegate,
          i;

      if ((controller) && (typeof controller.config.apps === 'object')) {
        for (appName in controller.config.apps) {
          if (controller.config.apps.hasOwnProperty(appName)) {
            appId = controller.config.apps[appName].id;

            if (controller.apps[appId]) {
              filteredControllers = this.filterControllers(device, controllers, controller.config.apps[appName].controllerIds);

              if (typeof controllers[device].apps[appId][appId] === 'function') {
                console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Executing app ' + appName);

                controllers[device].apps[appId][appId](device, command, filteredControllers, values, controller.config.apps[appName], appParams);
              }

              else {
                console.log('\x1b[31m' + controller.config.title + '\x1b[0m: Failed to execute app ' + appName);
              }
            }
          }
        }
      }

      if (controllers.config.delegate) {
        for (i = 0; i < controllers.config.delegate.length; i += 1) {
          delegate = controllers.config.delegate[i];

          if (controllers[delegate]) {
            if (delegate !== device) {
              for (appName in controllers[delegate].config.apps) {
                if (controllers[delegate].config.apps.hasOwnProperty(appName)) {
                  filteredControllers = this.filterControllers(delegate, controllers, controllers[delegate].config.apps[appName].controllerIds);

                  if (typeof controllers[delegate].apps[controllers[delegate].config.apps[appName].id][controllers[delegate].config.apps[appName].id] === 'function') {
                    controllers[delegate].apps[controllers[delegate].config.apps[appName].id][controllers[delegate].config.apps[appName].id](device, command, filteredControllers, values, controllers[delegate].config.apps[appName], appParams);
                  }
                }
              }
            }
          }
        }
      }
    },

    /**
     * Accept the device name, issued command and set (or subset) of controllers
     * that will be filtered down and passed along to any associated apps.
     * These apps are executed BEFORE any given command.
     *
     * If any apps return TRUE, the command execution will be interrupted.
     * This allows apps to conditionally execute or completely replace commands
     * based on any given criteria.
     */
    conditionalExecute : function (device, command, controllers) {
      var controller          = controllers[device],
          filteredControllers = {},
          execute             = true,
          appName,
          appId;

      if ((controller) && (typeof controller.config.conditionalApps === 'object')) {
        for (appName in controller.config.conditionalApps) {
          if (controller.config.conditionalApps.hasOwnProperty(appName)) {
            appId = controller.config.conditionalApps[appName].id;

            if (controller.conditionalApps[appId]) {
              filteredControllers = this.filterControllers(device, controllers, controller.config.conditionalApps[appName].controllerIds);

              if (typeof controllers[device].conditionalApps[appId][appId] === 'function') {
                console.log('\x1b[32m' + controller.config.title + '\x1b[0m: Executing conditional app ' + appName);

                execute = controllers[device].conditionalApps[appId][appId](device, command, filteredControllers, controller.config.conditionalApps[appName]) === false ? false : true;
              }

              else {
                console.log('\x1b[31m' + controller.config.title + '\x1b[0m: Failed to execute conditional app ' + appName);
              }
            }
          }
        }
      }

      return execute;
    }
  };
}());
