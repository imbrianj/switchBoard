/*jslint white: true */
/*global State, module, require, console */

/**
 * @author brian@bevey.org
 * @fileoverview Manage device state for clients.
 */

module.exports = (function () {
  'use strict';

  return {
    version : 20140510,

    newState : function(deviceName, controller) {
      var date = new Date(),
          time = date.getTime();

      State[deviceName] = { markup : '', state : {}, updated : time };

      if(controller.controller) {
        State[deviceName].controller = { inputs : controller.controller.inputs, keymap : controller.controller.keymap };
      }

      else {
        State[deviceName].controller = false;
      }

      State[deviceName].markup = controller.markup;
    },

    updateState : function(deviceName, config) {
      var date = new Date(),
          time = date.getTime();

      config.state = config.state || 'err';
      config.value = config.value || State[deviceName].value || false;

      State[deviceName].state   = config.state;
      State[deviceName].value   = config.value;
      State[deviceName].updated = time;
    }
  };
}());