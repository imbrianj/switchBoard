exports.config = {
  // This file configures SwitchBoard to include any of your services, devices,
  // options and apps.  This file should be considered sensitive and unique to
  // your setup.
  //
  // NOTE: DO NOT EXPOSE CREDENTIALS TO A PUBLIC PLACE - LIKE GITHUB.
  config : {
    serverPort   : 8080,
    serverIp     : '192.168.1.145',
    serverMac    : '00:00:00:00:00:00',
    appCaching   : true,
    delegate     : ['gerty'],
    theme        : 'dark',
    celsius      : false,
    language     : 'en',
    region       : 'us',
    default      : 'welcome',
    macroPause   : 1500,
    pollMinutes  : 15,
    pollSeconds  : 30,
    localTimeout : 5000,
    // Your SSL key and SCR will be generated for you.  If you want to use one
    // you've manually created, drop "ssl.key" and "ssl.csr" into /cache/.
    //
    // If you're using self-signed certs, be aware that appCaching may not work
    // in all (or any) browsers.
    // Even with ssl enabled, a non-ssl endpoint will be created to support
    // SmartThings.  You may disable non-ssl by setting the `serverPort` to
    // false.
    ssl          : {
      country    : 'US',
      state      : 'Washington',
      city       : 'Seattle',
      org        : 'SwitchBoard',
      name       : 'SwitchBoard',
      serverPort : 8181,
      disabled   : false
    },
    ai           : {
      // AI will only work if you mark eventLogging to true.  It defaults to
      // false as it may store uniquely identifiable information into
      // cache/db/ directory.
      // Setting this to true acknowledges that SwitchBoard will be overtly
      // logging actions and device states and storing them locally.
      eventLogging         : false,
      // When you trigger an action, SwitchBoard will wait this many seconds
      // before logging the state of the world.  This delay enforces causality.
      // If you enter a room and it logs the state immediately - you haven't had
      // the opportunity to teach it that you want the light on.
      eventLogDelaySeconds : 60,
      // Some scripts or apps may already fire an action with the desired
      // changes.  This lets you wait just a bit to see if other methods are
      // firing before we attempt any AI executions.
      executeDelaySeconds  : 1,
      // If you get into an argument with your house as to the desired state of
      // a device, this allows you to win that argument.  If a device has
      // changed state within this many minutes, it will not take any action,
      // regardless of it's confidence level.
      eventCooldownMinutes : 60,
      // Only take actions once we've built up some number of previous actions
      // use as predictors.  Lower this number if you want to see more actions,
      // increase it to see fewer.
      // Hint: the higher the number, the more accurate (but fewer) actions will
      // take place.
      minimumThreshold     : 15,
      // Percentage confidence before an action will take place.  By default,
      // only take action if we're 85% or more certain it's a desired behavior.
      // Hint: the higher the number, the more accurate (but fewer) actions will
      // take place.
      confidence           : 85,
      // Specify an array of subdevice names that should be excluded from
      // machine learning actions.  For example - if you want to keep your
      // thermostat from being controlled, you can add the name of it here.
      ignoreList           : ['Living Room'],
      // With trainingWheels on, Gerty will notify you of intent.  Set this to
      // false and he will take action.
      trainingWheels       : true,
      // Requires mp3 controller to be configured.
      chime                : true,
      // You can disable AI but still enable event logging.
      disable              : true
    }
  },

  /*
   * Be sure to mark the "disabled" to true to remove the welcome message.
   */
  welcome : {
    typeClass : 'welcome',
    title     : 'Welcome!',
    disabled  : false
  },

  /*
   * The name of the screensaver should remain "screenSaver" to work properly.
   */
  screenSaver : {
    typeClass : 'clientScreenSaver',
    title     : 'Screen Saver',
    timeout   : 60,
    disabled  : true
  },

  clientMp3 : {
    typeClass      : 'clientMp3',
    title          : 'Client MP3',
    disabled       : false,
    disabledMarkup : true
  },

  clientNotify : {
    typeClass      : 'clientNotify',
    title          : 'Desktop Notification',
    disabled       : false,
    disabledMarkup : true
  },

  clientSpeech : {
    typeClass      : 'clientSpeech',
    title          : 'Client Speech',
    voice          : 'male',
    disabled       : false,
    disabledMarkup : true
  },

  clientVibrate : {
    typeClass      : 'clientVibrate',
    title          : 'Client Vibrate',
    disabled       : false,
    disabledMarkup : true
  },

  tcl : {
    typeClass : 'tcl',
    title     : 'TCL SmartTV',
    deviceIp  : '192.168.1.9',
    power     : 60,
    disabled  : true
  },

  samsung : {
    typeClass : 'samsung',
    title     : 'Samsung SmartTV',
    deviceIp  : '192.168.1.1',
    power     : 60,
    disabled  : true
  },

  roku : {
    typeClass : 'roku',
    title     : 'Roku',
    deviceIp  : '192.168.1.3',
    power     : 5,
    disabled  : true
  },

  chromecast : {
    typeClass : 'chromecast',
    title     : 'Chromecast',
    deviceIp  : '192.168.1.11',
    power     : 1,
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
    power       : 230,
    disabled    : true
  },

  panasonic : {
    typeClass : 'panasonic',
    title     : 'Panasonic',
    deviceIp  : '192.168.1.5',
    power     : 60,
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
    power     : 60,
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
    power     : 60,
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
    power     : 60,
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
    // If you have issues with speech playing, try using aplay by setting this
    // value to true.
    aplay          : true,
    disabledMarkup : true,
    disabled       : true
  },

  /*
   * Weather kindly provided for free by Dark Sky.
   *
   * You will need to provide your own Secret Key, but it's easy and free:
   *  - Visit https://darksky.net/dev/register and create an account.  You will
   *    need to validate the email address.
   *  - Once created, visit https://darksky.net/dev/account and copy your
   *    "Secret Key", which will be inputed as your "token" here.
   *  - You will also need to provid your latitude and longitudinal coordinates
   *    for the location you'd like to have weather reports for.  You can find
   *    this on Google Maps by right-clicking and selecting "What's here?".  At
   *    the bottom of the screen, you should see your chosen coordinates.
   */
  weather : {
    typeClass : 'weather',
    title     : 'Weather',
    token     : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    latitude  : 47.62,
    longitude : -122.32,
    apps      : { 'Sun Phase' : { id            : 'sunPhase',
                                  macros        : { 'sunset' : 'smartthings=subdevice-mode-Night' },
                                  dayMode       : 'Home',
                                  // I personally don't like Night mode to
                                  // trigger automatically, so I stick with
                                  // Home.
                                  nightMode     : 'Home',
                                  controllerIds : ['smartthings', 'clientNotify', 'gerty'] } },
    disabled  : true
  },

  /*
   * Although their website makes searching for specific locations difficult,
   * you can look for a location you're interested here:
   * https://openaq.org/#/locations?countries=US
   */
  airQuality : {
    typeClass : 'airQuality',
    title     : 'Air Quality',
    location  : 'Seattle-10th %26 Welle',
    apps      : { 'Air Quality Announce' : { id            : 'announceAirQuality',
                                             macros        : { pm25 : 'smartthings=subdevice-Air Filter-on' },
                                             controllerIds : ['clientNotify', 'gerty'] } },
    disabled  : true
  },

  /*
   * Hits a custom API hooked to a remote Raspberry Pi with the Pimoroni Enviro+
   * hat to measure air quality.
   * https://github.com/imbrianj/switchboard-enviroPythonServer/tree/master
   */
  enviro : {
    typeClass : 'enviro',
    title     : 'Office Air',
    deviceIp  : '192.168.1.44',
    port      : 8008,
    disabled  : true
  },

  /*
   * Requires a GQ brand geiger counter configured to use the configuration of
   * a companion endpoint: https://github.com/imbrianj/switchboard-phpServer
   */
  geiger : {
    typeClass : 'geiger',
    title     : 'Geiger',
    host      : 'example.com',
    port      : 80,
    path      : '/index.php',
    username  : 'geiger',
    password  : '1234567890',
    maxCount  : 10,
    apps      : { 'Geiger Announce' : { id            : 'announceGeiger',
                                        controllerIds : ['clientNotify', 'gerty'] } },
    disabled  : true
  },

  /*
   * Controls Neato botvacs.
   */
  neato : {
    typeClass : 'neato',
    title     : 'Catbot',
    username  : 'test@example.com',
    password  : '1234567890',
    eco       : false,
    extraCare : true,
    nogo      : true,
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
    maxCount  : 20,
    apps      : { 'Announce'      : { id            : 'announceFoscam',
                                      controllerIds : ['speech', 'clientSpeech', 'clientNotify', 'gerty'] },
                  'Foscam Change' : { id            : 'foscamChange' },
                  'Foscam DVR'    : { id            : 'foscamDvr',
                                      // Gif thumbnails are expensive to build -
                                      // enable only on a fast system
                                      thumbnail     : false,
                                      // Delay for file check
                                      delay         : 300,
                                      videoLength   : 600,
                                      // Measured in MB
                                      byteLimit     : 20480 } },
    power     : 6,
    disabled  : true
  },

  /*
   * D-Link IP Camera
   * Your camera's "Video Profile 1" will be used for preview display in-browser
   * and the "Video Profile 2" will be used for (optional) DVR recording.
   *
   * Set up the correct channels by:
   *  - Go to [camera IP]/setup.htm
   *  - Select "Audio and Video"
   *  - For "Video Profile 1", select "JPEG" and optionally a desired resolution
   *     (preferrably 800x448) and quality (Good)
   *  - For "Video Profile 2", select "H.264" and optionally a desired
   *     resoution (preferrably 800x448) and quality (Excellent)
   */
  dLinkCamera : {
    typeClass : 'dLinkCamera',
    title     : 'D-Link Camera',
    deviceIp  : '192.168.1.12',
    username  : 'admin',
    password  : 'password',
    maxCount  : 20,
    apps      : { 'Announce'            : { id            : 'announceDLinkCamera',
                                            controllerIds : ['speech', 'clientSpeech', 'clientNotify', 'gerty'] },
                  'DLink Camera Change' : { id            : 'dLinkCameraChange' },
                  'DLink Camera DVR'    : { id            : 'dLinkCameraDvr',
                                            // Gif thumbnails are expensive to build -
                                            // enable only on a fast system
                                            thumbnail     : false,
                                            // Delay for file check
                                            delay         : 300,
                                            videoLength   : 600,
                                            // Measured in MB
                                            byteLimit     : 10240 } },
    power     : 6,
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
   * https://www.leonardsworlds.com/traffic/traffic_camera_directory.htm
   * Simply right click on any standard .jpg image and "copy image URL".
   */
  traffic : {
    typeClass : 'traffic',
    title     : 'Traffic Cams',
    cameras   : [{ title : '5th &amp; Pine',             image : 'https://www.seattle.gov/trafficcams/images/5_Pine_EW.jpg' },
                 { title : '6th &amp; Lenora',           image : 'https://www.seattle.gov/trafficcams/images/6_Lenora_NS.jpg' },
                 { title : '1st &amp; Broad',            image : 'https://www.seattle.gov/trafficcams/images/1_Broad_NS.jpg' },
                 { title : '9th &amp; Mercer',           image : 'https://www.seattle.gov/trafficcams/images/9_N_Mercer_EW.jpg' },
                 { title : 'Fairview &amp; Mercer',      image : 'https://www.seattle.gov/trafficcams/images/Fairview_Mercer_EW.jpg' },
                 { title : 'I-5 &amp; Denny',            image : 'https://images.wsdot.wa.gov/nw/005vc16645.jpg' },
                 { title : 'I-5 &amp; Pine',             image : 'https://images.wsdot.wa.gov/nw/005vc16607.jpg' },
                 { title : 'I-5 &amp; Mercer',           image : 'https://images.wsdot.wa.gov/nw/005vc16702.jpg' },
                 { title : 'I-5 &amp; Northgate',        image : 'https://images.wsdot.wa.gov/nw/005vc17277.jpg' },
                 { title : 'I-5 &amp; Roanoke',          image : 'https://images.wsdot.wa.gov/nw/005vc16802.jpg' },
                 { title : 'I-5 &amp; Yesler',           image : 'https://images.wsdot.wa.gov/nw/005vc16508.jpg' },
                 { title : '99 &amp; Atlantic',          image : 'https://images.wsdot.wa.gov/nw/099vc03015.jpg' },
                 { title : 'Tunnel North Portal',        image : 'https://images.wsdot.wa.gov/nw/099vc03271.jpg' },
                 { title : 'Tunnel Northbound',          image : 'https://images.wsdot.wa.gov/nw/099vc03098.jpg' },
                 { title : 'Tunnel Southbound',          image : 'https://images.wsdot.wa.gov/nw/099vc03188.jpg' }],
    disabled  : true
  },

  /*
   * View state of your Ocotprint status - tool temps, job progress.
   * You will need your API key found under Settings -> API -> API Key.
   */
  octoprint : {
    typeClass : 'octoprint',
    title     : '3d Printer',
    // 'transform' style applied to preview image in case you need to flip it.
    styles    : 'rotate(180deg)',
    deviceIp  : 'octopi.local',
    key       : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    apps      : { 'Announce' : { id            : 'announce3dPrinter',
                                 controllerIds : ['speech', 'clientSpeech', 'clientNotify', 'gerty'] } },
    power     : 35,
    disabled  : true
  },

  /*
   * View state of your MonoPrice Mini Select (or similar) 3d printer.
   * I've found it easiest to set up my printer via GCode:
   * https://mpselectmini.com/wifi/g-code_file
   */
  monoPrice3dPrinter : {
    typeClass : 'monoPrice3dPrinter',
    title     : '3d Printer',
    deviceIp  : '192.168.1.22',
    apps      : { 'Announce' : { id            : 'announce3dPrinter',
                                 controllerIds : ['speech', 'clientSpeech', 'clientNotify', 'gerty'] } },
    power     : 35,
    disabled  : true
  },

  /*
   * Simple device type to include a website in an iframe.
   * Visit this link to find the specific Waze params that work for you:
   * https://support.google.com/waze/partners/answer/6287370
   */
  website : {
    typeClass : 'website',
    title     : 'Waze',
    source    : 'https://embed.waze.com/iframe?zoom=14&lat=47.6205819&lon=-122.3493387',
    disabled  : true
  },

  /*
   * Configure Tasker on Android to ping your location while driving to a PHP
   * endpoint: https://github.com/imbrianj/switchboard-phpServer
   */
  location : {
    typeClass : 'location',
    title     : 'Location',
    host      : 'example.com',
    port      : 80,
    path      : '/location/',
    username  : 'username',
    password  : 'password',
    maxCount  : 15,
    disabled  : true
  },

  /*
   * MP3 uses the "mpg123" package on Linux, BSD and SunOS. For OSX, it uses
   * the built-in "afplay" command.  Windows is not supported.
   */
  mp3 : {
    typeClass      : 'mp3',
    title          : 'MP3',
    disabledMarkup : true,
    disabled       : true
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
   * more at https://smartthings.com
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
   * https://raw.githubusercontent.com/imbrianj/oauth_controller/master/oauth_controller.groovy
   * Click "Save", then "Publish" in the upper right.
   *
   * On initial startup of SwitchBoard with this configuration, you'll be
   * prompted in the command line for a URL to generate the security token used.
   * Simply visit the URL, grant the permissions you desire and click
   * "Authorize".
   */
  smartthings : {
    typeClass       : 'smartthings',
    title           : 'SmartThings',
    clientId        : 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    clientSecret    : 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    // You may group your devices together for display by using the group name
    // you'd like shown as the object name.  Devices within that group should
    // be the same name as you give them in SmartThings.
    groups          : { 'Bedroom'           : ['Bedroom Lamps', 'Bedroom Switch', 'Bedroom Window'],
                        'Office'            : ['Office Switch'],
                        'Hallway'           : ['Hall Light', 'Front Door'],
                        'Living Room'       : ['Living Room Lamp', 'Chandelier'],
                        'Kitchen'           : ['Kitchen Light', 'Dining Lights'] },
    /*
    apps            : { 'Announce'          : { id            : 'announcePresence',
                                                presence      : ['Brian', 'Goblin'],
                                                controllerIds : ['speech', 'cientSpeech', 'clientNotify', 'gerty'],
                                                disabled      : true },
                        'Announce Moisture' : { id            : 'announceMoisture',
                                                controllerIds : ['speech', 'clientNotify', 'clientSpeech', 'gerty'],
                                                disabled      : true },
                        'Window Open'       : { id            : 'windowOpen',
                                                contact       : ['Bedroom Window'],
                                                thermostat    : ['Living Room'],
                                                controllerIds : ['nest', 'pushover', 'speech', 'gerty'],
                                                disabled      : true },
                        'Mode Change'       : { id            : 'smartthingsModeChange',
                                                controllerIds : ['clientNotify', 'gerty'],
                                                Away          : 'nest=Away;foscam=Preset1,Sleep,Sleep,Alarm_On',
                                                Night         : 'nest=Home;foscam=Alarm_Off,Preset3',
                                                Home          : 'nest=Home;foscam=Alarm_Off,Preset3',
                                                disabled      : true },
                        'Door Knock'        : { id            : 'doorKnock',
                                                contact       : 'Front Door',
                                                vibrate       : 'Front Door',
                                                delay         : 5,
                                                controllerIds : ['pushover', 'sms', 'speech', 'mp3', 'clientSpeech', 'clientNotify', 'clientMp3', 'gerty'],
                                                disabled      : true },
                        'Presence Mode'     : { id            : 'presenceMode',
                                                presence      : ['Brian', 'Goblin'],
                                                delay         : 10,
                                                dayMode       : 'Home',
                                                // I personally don't like Night
                                                // mode to trigger
                                                // automatically, so I stick
                                                // with Home.
                                                nightMode     : 'Home',
                                                controllerIds : ['weather', 'clientNotify', 'gerty'] },
                        'Hall Light Home'   : { id            : 'hallLightHome',
                                                presence      : ['Brian', 'Goblin'],
                                                contact       : ['Front Door'],
                                                action        : ['Hall Light'],
                                                delay         : 15,
                                                macros        : '' },
                        'Home Watch'        : { id            : 'homeWatch',
                                                contact       : ['Front Door'],
                                                motion        : ['Living Room Motion'],
                                                camera        : { 'Office Motion': 'officeCam' },
                                                secureModes   : ['Away'],
                                                delay         : 15,
                                                controllerIds : ['foscam', 'pushover', 'sms', 'clientSpeech', 'clientNotify', 'gerty'] },
                        'Dog Walk Reminder' : { id            : 'dogWalkReminder',
                                                dogName       : 'Fido',
                                                delayMinutes  : 600,
                                                controllerIds : ['pushover', 'clientSpeech', 'speech', 'clientNotify', 'gerty'] }
                      },
    conditionalApps : { 'Air Filter When Smoggy' : { id            : 'airFilterWhenSmoggy',
                                                     filter        : 'Air Filter',
                                                     controllerIds : ['smartthings', 'airQuality'] } },
    */
    className      : { Goblin : 'fa-female' },
    power          : { 'Bedroom Lamps'    : 18,
                       'Office Switch'    : 15,
                       'Hall Light'       : 240,
                       'Living Room Lamp' : 15,
                       'Chandelier'       : 80,
                       'Credenza'         : 60,
                       'Kitchen Light'    : 30,
                       'Dining Lights'    : 19 },
    disabledMarkup : false,
    disabled       : true
  },

  nest : {
    typeClass       : 'nest',
    title           : 'Nest',
    username        : 'user@example.com',
    password        : 'password',
    apps            : { 'Nest Change'   : { id            : 'nestChange' },
    /*
                        'Window Open'   : { id            : 'windowOpen',
                                            thermostats   : ['Living Room'],
                                            contact       : ['Balcony Door', 'Office Window', 'Bedroom Window', 'Dining Room Window', 'Living Room Window'],
                                            controllerIds : ['smartthings', 'pushover', 'speech', 'clientSpeech', 'clientNotify', 'gerty'] },
                        'Protect Alarm' : { id            : 'announceNest',
                                            macros        : 'smartthings=subdevice-Hall+Light-on',
                                            controllerIds : ['pushover', 'sms', 'speech', 'clientSpeech', 'clientNotify', 'gerty'] }
    */
                      },
    /*
    conditionalApps : { 'Window Open' : { id              : 'nestWindowOpen',
                                          thermostats     : ['Living Room'],
                                          contact         : ['Balcony Door', 'Office Window', 'Bedroom Window', 'Dining Room Window', 'Living Room Window'],
                                          controllerIds   : ['smartthings', 'speech', 'clientSpeech', 'clientNotify', 'gerty'] }
                      },
    */
    disabled        : true
  },

  powerView : {
    typeClass       : 'powerView',
    title           : 'Blinds',
    deviceIp        : '192.168.1.108',
    order           : ['Dining Room 1', 'Dining Room 2', 'Balcony', 'Living Room 1', 'Living Room 2', 'Office', 'Bedroom'],
    scenes          : [{ 'All Up'  : { icon : 'arrow-up',   devices : { 'Dining Room 1' : 100, 'Dining Room 2' : 100, 'Balcony' : 100, 'Living Room 1' : 100, 'Living Room 2' : 100, 'Office' : 100, 'Bedroom' : 100 } } },
                       { 'All Down': { icon : 'arrow-down', devices : { 'Dining Room 1' : 0, 'Dining Room 2' : 0, 'Balcony' : 0, 'Living Room 1' : 0, 'Living Room 2' : 0, 'Office' : 0, 'Bedroom' : 0 } } },
                       { 'TV'      : { icon : 'gamepad',    devices : { 'Balcony' : 0, 'Living Room 2' : 0 } } }],
    conditionalApps : { 'Window Check' : { id            : 'blindsWindowOpen',
                                           windows       : [{ blind : 'Dining Room 1', contact : 'Dining Room Window', limit : 81 },
                                                            { blind : 'Living Room 2', contact : 'Living Room Window', limit : 81 },
                                                            { blind : 'Office',        contact : 'Office Window',      limit : 81 },
                                                            { blind : 'Bedroom',       contact : 'Bedroom Window',     limit : 81 }],
                                           controllerIds : ['smartthings', 'speech', 'clientSpeech', 'clientNotify', 'gerty'] }
                      },
    disabled        : true
  },

  switchBoardCI : {
    typeClass      : 'travis',
    title          : 'Travis',
    travisOwner    : 'imbrianj',
    travisRepo     : 'switchBoard',
    apps           : { 'Announce' : { id            : 'announceTravis',
                                      controllerIds : ['clientNotify', 'clientSpeech', 'speech', 'gerty'] } },
    disabledMarkup : false,
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
    power      : 4,
    disabled   : true
  },

  /*
   * Use your Raspberry Pi GPIO pins to control lighting and devices via 434Mhz
   * RF.  See https://xkonni.github.io/raspberry-remote/ for more details.
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
    power      : { 'Lights' : 60,
                   'TV'     : 60,
                   'LED'    : 15,
                   'HDD'    : 15,
                   'Power'  : 60 },
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

  /*
   * ActiveBuilding is a condo community portal.  We can poll their leaderboard
   * display to find out if you have any packages to be picked up.
   *
   * You will need to find the "appId" and "communityId" associated with your
   * unit.  Ask your concierge or building manager for more information.
   */
  activeBuilding : {
    typeClass   : 'activeBuilding',
    title       : 'Packages',
    appId       : '12345',
    communityId : '1234',
    unitNumber  : '123',
    apps        : { 'Announce' : { id            : 'announceActiveBuilding',
                                   controllerIds : ['speech', 'clientSpeech', 'clientNotify', 'gerty'] } },
    disabled    : true
  },

  /*
   * Simple RSS and Atom reader.
   */
  rss : {
    typeClass   : 'rss',
    title       : 'Blog',
    host        : 'imbrianj.github.io',
    port        : 443,
    path        : '/switchBoard/feed.xml',
    maxCount    : 10,
    apps        : { 'Announce' : { id            : 'announceRss',
                                   controllerIds : ['speech', 'clientSpeech', 'clientNotify', 'gerty'] } },
    disabled    : true
  },

  /*
   * Same reader can be used to pull in news.
   */
  news : {
    typeClass : 'rss',
    title     : 'News',
    host      : 'news.google.com',
    port      : 443,
    path      : '/atom?cf=all&pz=1&hl=en-US&gl=US&ceid=US:en',
    maxCount  : 10,
    apps      : { 'Announce Trending' : { id            : 'announceTrendingNews',
                                          blacklist     : ['New', 'News', 'A', 'An', 'The'],
                                          threshold     : 12,
                                          delay         : 480,
                                          controllerIds : ['clientNotify', 'gerty'] } },
    disabled  : true
  },

  sports : {
    typeClass : 'sports',
    title     : 'Sports',
    disabled  : true
  },

  /*
   * Read GitHub commits.  If checking against SwitchBoard, can alert you to
   * changes integrated into master and suggest an update.
   */
  github : {
    typeClass    : 'github',
    title        : 'GitHub',
    owner        : 'imbrianj',
    repo         : 'switchboard',
    // checkVersion will only work against the main SwitchBoard repo.
    checkVersion : true,
    apps         : { 'Announce' : { id            : 'announceGithub',
                                    controllerIds : ['speech', 'clientSpeech', 'clientNotify', 'gerty'] } },
    disabled     : true
  },

  /*
   * Polls haveibeenpwned.com for the given username's inclusion in any hacked
   * sites, so that you may pro-actively secure your data.
   */
  haveibeenpwned : {
    typeClass : 'haveibeenpwned',
    title     : 'Pwned',
    username  : 'brian@bevey.org',
    disabled  : true
  },

  /*
   * Subscribe to a feed of tweets mentioning a given user or subscribe to a
   * given user's feed.
   * To get your required keys and tokens, you'll need to visit:
   * https://apps.twitter.com/
   * Click "Create New App"
   * Enter whatever you'd like for "Name" and "Description".
   * Enter "https://github.com/imbrianj/switchBoard" for "Website"
   * Leave "Callback URL" empty
   * "Yes, I agree" to the terms - and click "Create your Twitter application"
   *
   * Once you have your application created, click the "Keys and Access Tokens"
   * tab.  This will take you to a page with your "Consumer Key", "Consumer
   * Secret", "Access Token" and "Access Token Secret".  Take these values and
   * populate them below.
   */
  twitter : {
    typeClass        : 'twitter',
    title            : 'Twitter',
    consumerKey      : 'xxxxxxxxxxxxxxxxxxxxxx',
    accessToken      : 'xxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    consumerSecret   : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    oauthTokenSecret : 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    // Can be either "user" to subscribe to a feed or "mentions" to subscribe to
    // any mentions of the provided username.
    feedType         : 'user',
    screenName       : 'imbrianj',
    // If any users listed under "senders" Tweets @ your user, it well send the
    // text body of the tweet to all configured controllers.  If Gerty is
    // included, it will attempt to execute macros and commands.
    apps             : { 'Twitter Command' : { id            : 'twitterCommand',
                                               senders       : ['imbrianj'],
                                               controllerIds : ['gerty', 'clientNotify', 'speech', 'clientSpeech', 'pushover'],
                                               disabled      : true } },
    disabledMarkup   : true,
    disabled         : true
  },

  piHole : {
    typeClass : 'piHole',
    title     : 'Pi-Hole',
    host      : 'switchboard',
    disabled  : true
  },

  gerty : {
    typeClass      : 'gerty',
    title          : 'Gerty',
    // Number of comments to remain visible in Gerty's chat log.
    maxCount       : 250,
    // The higher the number, the more likely he is to change emojis and act
    // out.
    personality    : 80,
    // Gerty will only act on inputted text that addresses him based on his
    // given name.  This should be true if you intend to use the inputted text
    // log as a simple chat app regularly.
    address        : false,
    // Gerty will try to act on any inputted text - but will not reply to the
    // negative of any command it does not understand.  This should be true if
    // you intend to use the inputted text log as a simple chat app some of the
    // time.
    ignoreNegative : true,
    // Sometimes, words are transcribed incorrectly.  Since I'm 100% certain
    // I'll never say something like "bedroom lambs", I can list some words or
    // phrases that will carry some actual meaning.
    corrections    : { 'bedroom lambs' : 'bedroom lamps',
                       'office which'  : 'office switch',
                       'hall life'     : 'hall light',
                       'kitchen life'  : 'kitchen light',
                       'dining life'   : 'dining light' },
    names          : { '192.168.1.1'   : 'Brian\'s Phone',
                       '192.168.1.2'   : 'Brian\'s Computer' },
    apps           : { 'Gerty' : { id            : 'gerty',
                                   macros        : { 'Watch A Movie' : 'powerView=text-TV;ps3=PowerOn;samsung=sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,sleep,HDMI4,sleep,RIGHT,sleep,RIGHT,sleep,RIGHT,sleep,RIGHT,sleep,RIGHT,sleep,DOWN,sleep,ENTER,sleep,RETURN,sleep,sleep,sleep,LEFT',
                                                     'Goodnight'     : 'smartthings=subdevice-mode-Night',
                                                     'Good Night'    : 'smartthings=subdevice-mode-Night',
                                                     'Goodbye'       : 'smartthings=subdevice-mode-Away;nest=Away',
                                                     'Good Bye'      : 'smartthings=subdevice-mode-Away;nest=Away',
                                                     'I\'m Back'     : 'smartthings=subdevice-mode-Home;nest=Home',
                                                     'Welcome Home'  : 'smartthings=subdevice-mode-Home;nest=Home' },
                                   controllerIds : ['samsung', 'roku', 'ps3', 'panasonic', 'lg', 'pioneer', 'denon', 'speech', 'weather', 'foscam', 'mp3', 'sms', 'pushover', 'smartthings', 'powerView', 'neato', 'nest', 'switchBoardCI', 'xbmc', 'raspberryRemote', 'wemo', 'activeBuilding', 'clientMp3', 'clientNotify', 'clientSpeech'] } },
    disabled       : true
  },

  /*
   * Prints out basic debug info (uptime, memory usage, cpu load).
   */
  debug : {
    typeClass : 'debug',
    title     : 'Debug',
    disabled  : true
  }
};
