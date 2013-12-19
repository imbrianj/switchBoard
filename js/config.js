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
    'typeClass' : 'samsung',
    'title'     : 'Samsung SmartTv',
    'deviceIp'  : '192.168.1.1',
    'disabed'   : false
  },

  roku : {
    'typeClass' : 'roku',
    'title'     : 'Roku',
    'deviceIp'  : '192.168.1.2',
    'disabled'  : false
  },

  ps3 : {
    'typeClass' : 'ps3',
    'title'     : 'PS3',
    // Bluetooth mac address of PS3
    // This is *NOT* the TCP network mac address
    'deviceMac' : '00:00:00:00:00:00',
    'deviceIp'  : '192.168.1.3',
    'disabled'  : false
  },

  panasonic : {
    'typeClass' : 'panasonic',
    'title'     : 'Panasonic',
    'deviceIp'  : '192.168.1.4',
    'disabled'  : true
  },

  lg : {
    'typeClass' : 'lg',
    'title'     : 'LG TV',
    'deviceIp'  : '192.168.1.5',
    'disabled'  : true
  },

  // Placeholder...for now
  macro : {
    'typeClass' : 'macro',
    'title'     : 'Macros',
    'disabled'  : true
  }
};