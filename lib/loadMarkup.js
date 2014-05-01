/*jslint white: true */
/*global module, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Load markup required for interface, doing basic template
 *               substitutions as necessary.
 * @requires fs
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140430,

    loadMarkup : function(template, controllers, response) {
      var fs           = require('fs'),
          markup       = template.split('{{THEME}}').join(controllers.config.theme),
          navTemplate  = fs.readFileSync(__dirname + '/../templates/fragments/navigation.tpl').toString(),
          deviceMarkup = '',
          headerMarkup = '',
          device;

      markup = markup.split('{{DEVICE}}').join(controllers.config.default);

      for(device in controllers) {
        if((typeof controllers[device] === 'object') && (device !== 'config') && (controllers[device].markup) && (controllers[device].config.disabledMarkup !== true)) {
          headerMarkup = headerMarkup + navTemplate.split('{{DEVICE_ID}}').join(controllers[device].config.deviceId);
          headerMarkup = headerMarkup.split('{{DEVICE_TITLE}}').join(controllers[device].config.title);

          if(typeof controllers[device].controller.onload === 'function') {
            controllers[device].markup = controllers[device].controller.onload(controllers[device]);
          }

          deviceMarkup = deviceMarkup + controllers[device].markup.split('{{DEVICE_ID}}').join(controllers[device].config.deviceId);
        }
      }

      markup = markup.split('{{NAVIGATION}}').join(headerMarkup);
      markup = markup.split('{{DEVICE_INTERFACES}}').join(deviceMarkup);

      return markup;
    },

    postloadMarkup : function() {
    }
  };
}());