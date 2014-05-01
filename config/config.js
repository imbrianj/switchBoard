/*jslint white: true */
/*global exports */

exports.config = {
  config : {
    serverPort  : '8080',
    serverIp    : '192.168.1.145',
    serverMac   : '00:00:00:00:00:00',
    theme       : 'dark',
    default     : 'samsung',
    macroPause  : 1000,
    pollMinutes : 15
  },

  samsung : {
    typeClass : 'samsung',
    title     : 'Samsung SmartTV',
    deviceIp  : '192.168.1.1',
    disabled  : true
  },

  // Here, I have another device of the same type.  Just give it a unique name.
  samsungLivingRoom : {
    typeClass : 'samsung',
    title     : 'Living Room TV',
    deviceIp  : '192.168.1.2',
    disabled  : true
  },

  roku : {
    typeClass : 'roku',
    title     : 'Roku',
    deviceIp  : '192.168.1.3',
    disabled  : true
  },

  /*
   * PS3 support is supplied by Gimx and is available on Windows and Linux
   * only.  Refer to the README for information on setup.
   */
  ps3 : {
    typeClass : 'ps3',
    title     : 'PS3',
    // Bluetooth mac address of PS3
    // This is *NOT* the TCP network mac address
    deviceMac : '00:00:00:00:00:00',
    deviceIp  : '192.168.1.4',
    disabled  : true
  },

  panasonic : {
    typeClass : 'panasonic',
    title     : 'Panasonic',
    deviceIp  : '192.168.1.5',
    disabled  : true
  },

  /*
   * This device is incomplete.  If you have one to test on, please let me
   * know!
   */
  lg : {
    typeClass : 'lg',
    title     : 'LG TV',
    deviceIp  : '192.168.1.6',
    pairKey   : '123456',
    disabled  : true
  },

  /*
   * Speech uses the "espeak" package on Linux, BSD and SunOS. For OSX, it uses
   * the built-in "say" command.  Windows is not supported.
   */
  speech : {
    typeClass     : 'speech',
    title         : 'Speech',
    voice         : 'female',
    disableMarkup : true,
    disabled      : true
  },

  /*
   * Both stocks and weather are courtesy of Yahoo.
   */
  stocks : {
    typeClass : 'stocks',
    title     : 'Stocks',
    stocks    : ['YHOO', 'AAPL', 'GOOG', 'TSLA'],
    // Not to be considered investment advice, but this shows how you can set
    // stock prices to be notified of.
    limits    : { YHOO : { buy : 30,  sell : 40 },
                  TSLA : { buy : 150, sell : 250 } },
    // Means by which you should be notified (if the controllers for each are
    // properly configured).
    notify    : ['pushover', 'twilio', 'speech'],
    disabled  : true
  },

  weather : {
    typeClass : 'weather',
    title     : 'Weather',
    zip       : 98121,
    disabled  : true
  },

  /*
   * This is insecure.  Your Foscam username and password will be sent in
   * plain-text and can be viewable within the source of the rendered
   * controller template.
   * Procede with caution.
   */
  foscam : {
    typeClass : 'foscam',
    title     : 'Foscam',
    deviceIp  : '192.168.1.7',
    username  : 'user',
    password  : 'password',
    disabled  : true
  },

  /*
   * MP3 uses the "mpg123" package on Linux, BSD and SunOS. For OSX, it uses
   * the built-in "afplay" command.  Windows is not supported.
   */
  mp3 : {
    typeClass : 'mp3',
    title     : 'MP3',
    disabled  : true
  },

  /*
   * SMS uses the twilio service that you must register for and populate your
   * own twilioSid, twilioToken and twilioPhone values with.  Registration is
   * free, however each message will be prefixed with a notice from Twilio:
   * https://www.twilio.com/try-twilio
   *
   * Find your your twilioSid and twilioToken values here:
   * https://www.twilio.com/user/account
   *
   * Find your your twilioPhone (phone number at Twilio) here:
   * https://www.twilio.com/user/account/phone-numbers/incoming
   */
  sms : {
    typeClass     : 'sms',
    title         : 'SMS',
    /* Your phone number to send texts to by default */
    phone         : '1234567890',
    twilioSid     : 'somethingSecret',
    twilioToken   : 'somethingSecret',
    /* Your assigned Twilio phone number */
    twilioPhone   : '0987654321',
    disableMarkup : true,
    disabled      : true
  },

  /*
   * Pushover is a neat IFTTT integrated push notification service.  Learn more
   * at https://pushover.net
   *
   * Find your your Pushover userKey:
   * https://pushover.net
   *
   * Generate your Pushover token here:
   * https://pushover.net/apps/build
   */
  pushover : {
    typeClass      : 'pushover',
    title          : 'Pushover',
    userKey        : 'somethingSecret',
    token          : 'somethingSecret',
    disabledMarkup : false,
    disabled       : true
  },

  /*
   * SmartThings is a home automation system that integrates IP controlled,
   * Zigbee and Z-wave devices.  They allow OAuth control of their API.  Learn
   * more at http://smartthings.com
   *
   * To use their OAuth API, you'll need to have an account on their site and
   * create the OAuth endpoint SmartApp:
   * https://graph.api.smartthings.com/ide/app/create
   * Name: Universal Controller OAuth Endpoint
   * Description: Universal Controller OAuth Endpoint
   * Click "Enable OAuth in Smart App" and copy the "OAuth Client ID" and
   * "OAuth Client Secret" to the fields below.
   * Click "Create" to be presented with the SmartThings IDE.  Simply paste the
   * sourcecode from their OAuth reference material:
   * https://gist.github.com/aurman/9813279
   * Click "Save", then "Publish" in the upper right.
   *
   * On initial startup of the Universal Controller with this configuration,
   * you'll be propted in the command line for a URL to generate the security
   * token used.  Simply visit the URL, grant the permissions you desire and
   * click "Authorize".
   */
  smartthings : {
    typeClass      : 'smartthings',
    title          : 'SmartThings',
    clientId       : 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    clientSecret   : 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    disabledMarkup : false,
    disabled       : true
  }
};