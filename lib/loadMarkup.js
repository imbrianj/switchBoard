/*jslint white: true */
/*global App, module, require, console */

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
      var fs            = require('fs'),
          markup        = template.split('{{THEME}}').join(controllers.config.theme),
          navTemplate   = fs.readFileSync(__dirname + '/../templates/fragments/navigation.tpl').toString(),
          deviceMarkup  = '',
          headerMarkup  = '',
          selectedClass = '',
          device;

      for(device in controllers) {
        if((typeof controllers[device] === 'object') && (device !== 'config') && (controllers[device].markup) && (controllers[device].config.disabledMarkup !== true)) {
          headerMarkup  = headerMarkup + navTemplate.split('{{DEVICE_ID}}').join(controllers[device].config.deviceId);
          headerMarkup  = headerMarkup.split('{{DEVICE_TITLE}}').join(controllers[device].config.title);
          selectedClass = '';

          if(device === controllers.config.default) {
            selectedClass = ' selected';
          }

          headerMarkup = headerMarkup.split('{{DEVICE_SELECTED}}').join(selectedClass);

          if(typeof controllers[device].controller.onload === 'function') {
            controllers[device].markup = controllers[device].controller.onload(controllers[device]);
          }

          deviceMarkup = deviceMarkup + controllers[device].markup.split('{{DEVICE_ID}}').join(controllers[device].config.deviceId);
          deviceMarkup = deviceMarkup.split('{{DEVICE_SELECTED}}').join(selectedClass);
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