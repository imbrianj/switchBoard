/*jslint white: true */
/*global module, require, console */

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
    version : 20140430,

    loadControllerFile : function(controllerConfig, deviceName, config) {
      var fs = require('fs'),
          controller = {};

      if(fs.existsSync(__dirname + '/../controllers/' + controllerConfig.typeClass + '.js')) {
        controller.controller = require(__dirname + '/../controllers/' + controllerConfig.typeClass);
        controller.config = controllerConfig;
        console.log(controller.config.title + ': Loaded ' + controller.config.typeClass + ' controller');
        this.initController(controller, config);
      }

      else {
        controller.config = controllerConfig;
        console.log(controller.config.title + ': Loaded without a controller for ' + controller.config.typeClass);
      }

      if(fs.existsSync(__dirname + '/../templates/' + controllerConfig.typeClass + '.tpl')) {
        controller.markup = fs.readFileSync(__dirname + '/../templates/' + controllerConfig.typeClass + '.tpl').toString();
        console.log(controller.config.title + ': Loaded markup template for ' + controller.config.typeClass);
      }

      if(fs.existsSync(__dirname + '/../events/' + controllerConfig.typeClass + '.js')) {
        controller.event = require(__dirname + '/../events/' + controllerConfig.typeClass);
        console.log(controller.config.title + ': Loaded events for ' + controller.config.typeClass);
      }

      return controller;
    },

    loadController : function(devices) {
      var schedule    = require('./schedule'),
          deviceName,
          lastGood    = '',
          controllers = { 'config' : devices.config };

      for(deviceName in devices) {
        if((typeof devices[deviceName] === 'object')  &&
           (devices[deviceName].disabled !== true) &&
           (deviceName !== 'config')) {
          devices[deviceName].deviceId = deviceName;

          controllers[deviceName] = this.loadControllerFile(devices[deviceName], deviceName, controllers.config);

          if(controllers[deviceName].hasOwnProperty('markup')) {
            lastGood = deviceName;
          }
        }
      }

      if(!controllers.hasOwnProperty(controllers.config.default)) {
        console.log('=====================================================================');

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

        console.log('=====================================================================');
      }

      else {
        schedule.scheduleInit(controllers);
      }

      return controllers;
    },

    initController : function(controller, config) {
      if(controller.controller.init !== undefined) {
        controller.controller.init(controller, config);
        console.log(controller.config.title + ': Init ran for ' + controller.config.typeClass);
      }
    }
  };
}());