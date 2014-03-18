/*jslint white: true */
/*global loadController, module, String, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Load controller files and populates them with markup if
 *               available.  Runs init scripts against controllers if
 *               available.
 * @requires fs
 */

var loadController = module.exports = (function () {
  'use strict';

  return {
    version : 20140313,

    loadControllerFile : function(controllerConfig, deviceName) {
      var fs = require('fs'),
          controller = {};

      if(fs.existsSync(__dirname + '/../controllers/' + controllerConfig.typeClass + 'Controller.js')) {
        controller.controller = require(__dirname + '/../controllers/' + controllerConfig.typeClass + 'Controller');
        controller.config = controllerConfig;
        console.log(controller.config.title + ': Loaded ' + controller.config.typeClass + ' controller');
        loadController.initController(controller);
      }

      else {
        controller.config = controllerConfig;
        console.log(controller.config.title + ': Loaded without a controller for ' + controller.config.typeClass);
      }

      if(fs.existsSync(__dirname + '/../templates/' + controllerConfig.typeClass + '.tpl')) {
        controller.markup = fs.readFileSync(__dirname + '/../templates/' + controllerConfig.typeClass + '.tpl').toString();
        console.log(controller.config.title + ': Loaded markup template for ' + controller.config.typeClass);
      }

      return controller;
    },

    loadController : function(devices) {
      var deviceName,
          controllers = { 'config' : devices.config };

      for(deviceName in devices) {
        if((typeof devices[deviceName] === 'object')  &&
           (devices[deviceName].disabled !== true) &&
           (deviceName !== 'config')) {
          devices[deviceName].deviceId = deviceName;

          controllers[deviceName] = loadController.loadControllerFile(devices[deviceName], deviceName);
        }
      }

      return controllers;
    },

    initController : function(controller) {
      if(controller.controller.init !== undefined) {
        controller.controller.init(controller);
        console.log(controller.config.title + ': Init ran for ' + controller.config.typeClass);
      }
    }
  };
}());