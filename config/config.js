/*jslint white: true */
/*global exports */

exports.config = {
  config : {
    serverPort   : 8080,
    serverIp     : '192.168.1.145',
    serverMac    : '00:00:00:00:00:00',
    appCaching   : true,
    delegate     : ['gerty'],
    theme        : 'dark',
    language     : 'en',
    default      : 'welcome',
    macroPause   : 1500,
    pollMinutes  : 5,
    pollSeconds  : 15,
    localTimeout : 1000
  },

  // Be sure to mark the "disabled" to true to remove the welcome message.
  welcome : {
    typeClass : 'welcome',
    title     : 'Welcome!',
    disabled  : false,
  },

  samsung : {
    typeClass : 'samsung',
    title     : 'Samsung SmartTV',
    deviceIp  : '192.168.1.1',
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
    typeClass   : 'ps3',
    title       : 'PS3',
    // Bluetooth mac address of PS3
    // This is *NOT* the TCP network mac address
    deviceMac   : '00:00:00:00:00:00',
    // Gimx requires starting up a server and port.  You can set it to something
    // specific if you need, but this should be fine.
    serviceIp   : '127.0.0.1',
    servicePort : 8181,
    disabled    : true
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
   * This device is incomplete.  If you have one to test on, please let me
   * know!
   */
  pioneer : {
    typeClass : 'pioneer',
    title     : 'Pioneer Amp',
    deviceIp  : '192.168.1.6',
    disabled  : true
  },

  /*
   * This device is incomplete.  If you have one to test on, please let me
   * know!
   */
  denon : {
    typeClass : 'denon',
    title     : 'Denon Receiver',
    deviceIp  : '192.168.1.6',
    disabled  : true
  },

  /*
   * Speech uses the "espeak" package on Linux, BSD and SunOS. For OSX, it uses
   * the built-in "say" command.  Windows is not supported.
   */
  speech : {
    typeClass      : 'speech',
    title          : 'Speech',
    voice          : 'male',
    apps           : { 'Send' : { id : 'sendSpeech' } },
    disabledMarkup : false,
    disabled       : true
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
    apps      : { 'Notify' : { id            : 'announceStocks',
                               limits        : { YHOO : { buy : 30,  sell : 55 },
                                                 TSLA : { buy : 200, sell : 350 } },
                               controllerIds : ['pushover', 'speech', 'mp3'] } },
    disabled  : true
  },

  weather : {
    typeClass : 'weather',
    title     : 'Weather',
    // Zip isn't available everywhere - and is imprecise, but is very easy to
    // recall and generally offers "good enough" precision.
    zip       : 98121,
    // WOEID can be more specific to a zip - so this will be used if available.
    // It's also available in places that don't have Zip codes.
    // Find your location's WOEID from: http://woeid.factormystic.net/
    woeid     : 12798963,
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
    apps      : { 'Announce' : { id            : 'announceFoscam',
                                 controllerIds : ['speech'] } },
    disabled  : true
  },

  /*
   * Most states have a DOT site with available traffic cams.  Drop in the
   * actual image URL and title for each that you're interested in.  Some images
   * will already include some sort of cache-busting suffix - be sure to omit
   * that.  SwitchBoard will automatically append a unique cache bust param for
   * every request.
   *
   * You can use this site to look up any local webcams to use:
   * http://www.leonardsworlds.com/traffic/traffic_camera_directory.htm
   * Simply right click on any standard .jpg image and "copy image URL".
   */
  traffic : {
    typeClass : 'traffic',
    title     : 'Traffic Cams',
    cameras   : [{ title : 'I-5 &amp; Denny',           image : 'http://images.wsdot.wa.gov/nw/005vc16645.jpg' },
                 { title : 'I-5 &amp; Pine',            image : 'http://images.wsdot.wa.gov/nw/005vc16607.jpg' },
                 { title : 'I-5 &amp; Mercer',          image : 'http://images.wsdot.wa.gov/nw/005vc16702.jpg' },
                 { title : 'I-5 &amp; Northgate',       image : 'http://images.wsdot.wa.gov/nw/005vc17277.jpg' },
                 { title : 'I-5 &amp; Roanoke',         image : 'http://images.wsdot.wa.gov/nw/005vc16802.jpg' },
                 { title : 'I-5 &amp; Yesler',          image : 'http://images.wsdot.wa.gov/nw/005vc16508.jpg' },
                 { title : '99 &amp; S King',           image : 'http://images.wsdot.wa.gov/nw/099vc03072.jpg' },
                 { title : 'Elliot &amp; Broad',        image : 'http://www.seattle.gov/trafficcams/images/Elliott_Broad.jpg' },
                 { title : 'Stewart, Yale &amp; Denny', image : 'http://www.seattle.gov/trafficcams/images/Yale_Denny.jpg' },
                 { title : '15th &amp; Emerson',        image : 'http://www.seattle.gov/trafficcams/images/15W_Emerson.jpg' }],
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
    typeClass      : 'sms',
    title          : 'SMS',
    // Your phone number to send texts to by default
    phone          : '1234567890',
    twilioSid      : 'somethingSecret',
    twilioToken    : 'somethingSecret',
    // Your assigned Twilio phone number
    twilioPhone    : '0987654321',
    disabledMarkup : true,
    disabled       : true
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
    typeClass : 'pushover',
    title     : 'Pushover',
    userKey   : 'somethingSecret',
    token     : 'somethingSecret',
    disabled  : true
  },

  /*
   * SmartThings is a home automation system that integrates IP controlled,
   * Zigbee and Z-wave devices.  They allow OAuth control of their API.  Learn
   * more at http://smartthings.com
   *
   * To use their OAuth API, you'll need to have an account on their site and
   * create the OAuth endpoint SmartApp:
   * https://graph.api.smartthings.com/ide/app/create
   * Name: SwitchBoard OAuth Endpoint
   * Description: SwitchBoard OAuth Endpoint
   * Click "Enable OAuth in Smart App" and copy the "OAuth Client ID" and
   * "OAuth Client Secret" to the fields below.
   * Click "Create" to be presented with the SmartThings IDE.  Simply paste the
   * sourcecode from the companion app:
   * https://github.com/imbrianj/oauth_controller/blob/master/oauth_controller.groovy
   * Click "Save", then "Publish" in the upper right.
   *
   * On initial startup of SwitchBoard with this configuration, you'll be
   * propted in the command line for a URL to generate the security token used.
   * Simply visit the URL, grant the permissions you desire and click
   * "Authorize".
   */
  smartthings : {
    typeClass      : 'smartthings',
    title          : 'SmartThings',
    clientId       : 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    clientSecret   : 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    // You may group your devices together for display by using the group name
    // you'd like shown as the object name.  Devices within that group should
    // be the same name as you give them in SmartThings.
    groups         : { 'Bedroom'           : ['Bedroom Lamps', 'Bedroom Switch'],
                       'Office'            : ['Office Switch'],
                       'Hallway'           : ['Hall Light', 'Front Door'],
                       'Living Room'       : ['Living Room Lamp', 'Chandelier'],
                       'Kitchen'           : ['Kitchen Light', 'Dining Lights'] },
    apps           : { 'Announce'          : { id            : 'announcePresence',
                                               presence      : ['Brian', 'Goblin'],
                                               controllerIds : ['speech'],
                                               disabled      : true },
                       'Announce Moisture' : { id            : 'announceMoisture',
                                               controllerIds : [],
                                               disabled      : true },
                       'Mode Change'       : { id            : 'smartthingsModeChange',
                                               controllerIds : [],
                                               Away          : 'nest=Away;foscam=Preset1,Sleep,Sleep,Alarm_On',
                                               Night         : 'nest=Home;foscam=Alarm_Off,Preset3',
                                               Home          : 'nest=Home;foscam=Alarm_Off,Preset3',
                                               disabled      : true }
                     },
    className      : { Goblin : 'fa-female' },
    disabledMarkup : false,
    disabled       : true
  },

  nest : {
    typeClass : 'nest',
    title     : 'Nest',
    username  : 'user@example.com',
    password  : 'password',
    apps      : { 'Window Open'   : { id            : 'windowOpen',
                                      thermostats   : ['Living Room'],
                                      controllerIds : ['smartthings'],
                                      contact       : ['Balcony Door', 'Office Window', 'Bedroom Window', 'Dining Room Window', 'Living Room Window'] },
                  'Protect Alarm' : { id            : 'announceNest',
                                      controllerIds : ['pushover', 'sms', 'speech'] }
                },
    disabled  : true
  },

  switchBoardCI : {
    typeClass      : 'travis',
    title          : 'Travis',
    travisOwner    : 'imbrianj',
    travisRepo     : 'switchBoard',
    apps           : { 'Announce' : { id : 'announceTravis' } },
    disabledMarkup : true,
    disabled       : true
  },

  /*
   * You must first enable control of XBMC via HTTP.
   *
   * Go to: "Settings" > "Services" > "Web Server"
   * Activate "Allow control of XBMC via HTTP"
   */
  xbmc : {
    typeClass  : 'xbmc',
    title      : 'XBMC',
    deviceIp   : '192.168.1.8',
    devicePort : 8080,
    disabled   : true
  },

  /*
   * Use your Raspberry Pi GPIO pins to control lighting and devices via 434Mhz
   * RF.  See http://xkonni.github.io/raspberry-remote/ for more details.
   */
  raspberryRemote : {
    typeClass  : 'raspberryRemote',
    title      : 'Raspberry Remote',
    system     : 11111,
    subdevices : { 'Lights' : 1,
                   'TV'     : 2,
                   'LED'    : 3,
                   'HDD'    : 4,
                   'Power'  : 5 },
    className  : { 'TV'     : 'fa-desktop' },
    disabled   : true
  },

  wemo : {
    typeClass  : 'wemo',
    title      : 'Wemo',
    subdevices : { 'Desk Lamp' : '192.168.1.9',
                   'Fan'       : '192.168.1.10' },
    // You may group your devices together for display by using the group name
    // you'd like shown as the object name.  Devices within that group should
    // be the same name as you give them in as subdevices above.
    groups     : { 'Office'    : ['Desk Lamp', 'Fan'] },
    className  : { 'Fan'       : 'fa-asterisk' },
    disabled   : true
  },

  gerty : {
    typeClass   : 'gerty',
    title       : 'Gerty',
    personality : 80,
    apps        : { 'Gerty' : { id            : 'gerty',
                                macros        : { 'Watch A Movie' : 'ps3=PowerOn,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,Circle,sleep,sleep,Left;samsung=sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,HDMI4,sleep,DOWN,sleep,ENTER,sleep,sleep,sleep,sleep,ENTER',
                                                  'Goodnight'     : 'smartthings=subdevice-mode-Night',
                                                  'Goodbye'       : 'smartthings=subdevice-mode-Away;nest=Away',
                                                  'Welcome Home'  : 'smartthings=subdevice-mode-Home;nest=Home' },
                                controllerIds : ['samsung', 'roku', 'ps3', 'panasonic', 'lg', 'pioneer', 'denon', 'speech', 'stocks', 'weather', 'foscam', 'mp3', 'sms', 'pushover', 'smartthings', 'nest', 'switchBoardCI', 'xbmc', 'raspberryRemote', 'wemo'] } },
    disabled    : true
  }
};
