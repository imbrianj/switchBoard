/*jslint white: true */
/*global exports */

var exports = exports || {};

exports.config = {
  'serverPort' : '8080',
  'serverIp'   : '192.168.1.150',
  'serverMac'  : '00:00:00:00:00:00',
  'theme'      : 'dark',
  'default'    : 'samsung',

  samsung : {
    'title'    : 'Samsung SmartTv',
    'prefix'   : 'samsung',
    'deviceIp' : '192.168.1.1'
  },

  roku : {
    'title'    : 'Roku',
    'prefix'   : 'roku',
    'deviceIp' : '192.168.1.2'
  },

  ps3 : {
    'title'     : 'PS3',
    'prefix'    : 'ps3',
    // Bluetooth mac address of PS3
    // This is *NOT* the TCP network mac address
    'deviceMac' : '00:00:00:00:00:00'
  },

  panasonic : {
    'title'    : 'Panasonic',
    'prefix'   : 'panasonic',
    'deviceIp' : '192.168.1.3'
  },

  // Placeholder...for now
  macro : {
    'title'  : 'Macros',
    'prefix' : 'macro'
  }
};