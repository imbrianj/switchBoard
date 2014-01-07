/*jslint white: true */
/*global exports */

exports.config = {
  'serverPort' : '8080',
  'serverIp'   : '192.168.1.150',
  'serverMac'  : '00:00:00:00:00:00',
  'theme'      : 'dark',
  'default'    : 'samsung',

  samsung : {
    'typeClass' : 'samsung',
    'title'     : 'Samsung SmartTV',
    'deviceIp'  : '192.168.1.1',
    'disabled'  : false
  },

  // Here, I have another device of the same type.  Just give it a unique name.
  samsungLivingRoom : {
    'typeClass' : 'samsung',
    'title'     : 'Living Room TV',
    'deviceIp'  : '192.168.1.2',
    'disabled'  : true,
  },

  roku : {
    'typeClass' : 'roku',
    'title'     : 'Roku',
    'deviceIp'  : '192.168.1.3',
    'disabled'  : false
  },

  ps3 : {
    'typeClass' : 'ps3',
    'title'     : 'PS3',
    // Bluetooth mac address of PS3
    // This is *NOT* the TCP network mac address
    'deviceMac' : '00:00:00:00:00:00',
    'deviceIp'  : '192.168.1.4',
    'disabled'  : false
  },

  panasonic : {
    'typeClass' : 'panasonic',
    'title'     : 'Panasonic',
    'deviceIp'  : '192.168.1.5',
    'disabled'  : true
  },

  lg : {
    'typeClass' : 'lg',
    'title'     : 'LG TV',
    'deviceIp'  : '192.168.1.6',
    'disabled'  : true
  },

  // Placeholder...for now
  macro : {
    'typeClass' : 'macro',
    'title'     : 'Macros',
    'disabled'  : true
  }
};