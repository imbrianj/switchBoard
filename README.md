[![Chat on IRC](https://img.shields.io/badge/irc-%23%23switchboard-blue.svg)](https://webchat.freenode.net/?channels=#%23switchboard)
[![Build Status](https://secure.travis-ci.org/imbrianj/switchBoard.png)](https://travis-ci.org/imbrianj/switchBoard)
[![Dependencies Status](https://david-dm.org/imbrianj/switchboard.svg)](https://david-dm.org/imbrianj/switchboard#info=dependencies)
[![Dev Dependencies Status](https://david-dm.org/imbrianj/switchboard/dev-status.svg)](https://david-dm.org/imbrianj/switchboard#info=devDependencies)
[![npm version](https://badge.fury.io/js/switchboard-automation.svg)](https://badge.fury.io/js/switchboard-automation)
[![Known Vulnerabilities](https://snyk.io/test/npm/switchboard-automation/badge.svg)](https://snyk.io/test/npm/switchboard-automation)

SwitchBoard
---
SwitchBoard is a node.js based application intended to run on a device within a local network - preferably a dedicated server (such as a Raspberry Pi).  It allows all web capable devices within that same network to issue commands to any other configured device.  You may use your phone, tablet, desktop or laptop browser to interact with any controllable device - or issue simple GET commands programmatically.  It's able to (optionally) log actions for machine learning to determine usage patterns and automate some tasks.

Follow along development in the [SwitchBoard blog](https://imbrianj.github.io/switchBoard/).

Video demonstration:

[![Demonstration of SwitchBoard](https://img.youtube.com/vi/Ni_YgL4hcgI/0.jpg)](https://www.youtube.com/watch?v=Ni_YgL4hcgI)

Or you may browse through a [static version](https://imbrianj.github.io/switchBoard/demo/).

Setup
---
### Easy
- You'll need to install node.js.  You can grab it from the [Node.js website](https://nodejs.org/download/)
- `npm install -g git+https://github.com/imbrianj/switchBoard.git`
- Add a config file anywhere on the device you want to run the app on. See the [default](config/config.js) file for examples
- Run `switchBoard -c yournewconfigfile`
- Open your favorite browser on any device within your wireless network, and point it to the IP and port of the device hosting switchBoard (default is 8080). E.g. `http://192.168.2.13:8080/` (Remember to bookmark)
- Profit

### Advanced
Download the source, edit config/config.js to reflect your node server IP, desired port to hit when you visit the remote and web mac address of the server (used for authenticating against Samsung TVs).  If you don't have a specific device, just comment out or remove the configuration for it.  If you do have a device you'd like to control, just populate the given fields - they should all be pretty obvious in their use.  Run node app.js then visit your node page.  Run a command from the remote and Allow access on your TV.

Supported Devices/Services
---

| Name                 | Status      | Notes                                                                             |
|----------------------|-------------|-----------------------------------------------------------------------------------|
| ActiveBuilding       | Stable      | Checks for arrived packages to be picked up from your concierge                   |
| Air Quality          | Testing     | Checks local air quality values from OpenAQ.org                                   |
| Belkin Wemo          | Stable      |                                                                                   |
| Chromecast           | Testing     | Limited functionality.  Determines if TV is on and allows sending of YouTube IDs  |
| Client MP3           | Stable      | Sends an mp3 playback command to all Websocket connected clients                  |
| Client Notify        | Stable      | Sends a Desktop Notification to all Websocket connected clients                   |
| Client Screen Saver  | Development | For use with OLED display fixtures - blacks out screen when not in use            |
| Client Speech        | Stable      | Sends text to be speech synthesized to all Websocket connected clients            |
| Client Vibrate       | Stable      | Sends a command to vibrate all Websocket connected clients (phones, tablets, etc) |
| Debug                | Stable      | Display basic system information (memory, cpu, uptime)                            |
| Denon                | Stable      | New controller and still in testing                                               |
| Foscam               | Stable      | Works with FI8910W (if you have another version that this does not work with, let me know and I can add support).  Arm, Disarm, Go to presets, etc. *INSECURE* Exposes camera credentials to users |
| Gerty                | Stable      | A simple interface for all devices that reacts to natural inputs                  |
| GitHub               | Testing     | Poll for commits to a given repository.  For Switchboard, can tell you if you should update |
| have i been pwned?   | Testing     | Query haveibeenpwned.com to see if your username has been part of a data breach   |
| LG TVs               | Development | Still need work on authentication                                                 |
| Location             | Stable      | Uses [switchboard-phpServer](https://github.com/imbrianj/switchboard-phpServer) and [Tasker](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm) to track your GPS position
| MonoPrice 3d Printer | Testing     | Probably works with other brands and models, but tested on Mini Select v2         |
| MP3                  | Stable      | Works on *nix with mpg123 or OSX with afplay. Win not supported                   |
| Nest                 | Stable      | Works with Nest thermostat and Protect smoke / CO detectors                       |
| Panasonic            | Stable      | Text input and basic controls                                                     |
| PowerView            | Stable      | Hunter Douglas PowerView blinds control                                           |
| Pioneer              | Testing     | Reportedly works, but unable to test                                              |
| PS3                  | Stable      | Uses GIMX to emulate PS3 controller ([see below](https://github.com/imbrianj/switchBoard#faq)). OSX not supported  |
| Pushover             | Stable      | Requires purchased app and token / user key                                       |
| Raspberry Remote     | Stable      | Uses [Raspberry Remote](https://xkonni.github.io/raspberry-remote/) to control lighting. Only Linux is supported |
| Roku                 | Stable      | Launch apps directly, text input and basic controls                               |
| RSS                  | Stable      | Simple RSS and Atom reader                                                        |
| Samsung SmartTV      | Stable      | Text input and basic controls                                                     |
| SmartThings          | Stable      | Control devices and monitor real-time states. Requires [companion app](https://github.com/imbrianj/oauth_controller/blob/master/oauth_controller.groovy) |
| SMS                  | Stable      | Uses Twilio. Requires ID and token                                                |
| Speech               | Stable      | Uses espeak for *nix, say on OSX.  Win not supported                              |
| Sports               | Stable      | Pull sports scores from ESPN (please don't hammer this endpoint)                  |
| Stocks               | Stable      | Uses Yahoo Finance                                                                |
| Traffic Cams         | Stable      | View multiple traffic webcams                                                     |
| Travis CI            | Stable      |                                                                                   |
| Twitter              | Development | Present mentions of your Twitter handle                                           |
| Weather              | Stable      | Uses Yahoo Weather                                                                |
| Website              | Stable      | Simple controller to load an external site as an iframe                           |
| XBMC                 | Stable      | Basic controls work                                                               |

### How to Contribute

I'm always looking to add devices and services.  Even if you're not a developer, you can help by testing, doing documentation, translating or even just expressing interest in something to help guide the effort.  Join [##switchboard on irc.freenode.net](https://webchat.freenode.net/?channels=#%23switchboard) If you'd like to reach out.  If you work for a device manufacturer - let me know if I can beg, borrow or steal a device from you to integrate!

### Controlling your PS3 -- General instructions

  Overview: You'll need to have your SwitchBoard device (computer, raspberry pi, etc.) *pretend* to be a PS3 controller (aka Sixaxis Controller) that communicates with the PS3 via Bluetooth.
   * You'll need a supported Bluetooth dongle that plugs into your device and communicates with the console (the CSR bluecore4-rom is recommended): https://gimx.fr/wiki/index.php?title=Bluetooth_dongle
   * [Install GIMX](https://github.com/matlo/GIMX/releases) version 2.0x+ (earlier versions won't work).
   * Refer to the [detailed instruction for spoofing your Bluetooth dongle's MAC address](https://gimx.fr/wiki/index.php?title=Command_line#Linux_.2B_bluetooth_.2B_PS3).
   * :point_up: Tips:
     * The above instructions assume you have plugged your Sixaxis into your PS3, pressed the controller's PS button to pair it, unplugged the controller from the PS3, and pluged back into your SwitchBoard device.
     * Keep note of the Bluetooth addresses of both your PS3 controller (aka Current Bluetooth Device Address, or sixaxis_bt_address) and PS3 console (aka Current Bluetooth master, or ps3_bt_address).  You'll need to add the PS3 Bluetooth address in your config/config.js file and you'll need the controller address to copy over to your dongle

### Controlling your PS3 -- via a Raspberry Pi set up as a persistent server
- `cd switchBoard && npm update && sudo apt-get update && sudo apt-get --yes dist-upgrade && sudo apt-get clean all && sudo updatedb && reboot` # Make sure your Raspberry Pi is up to date
- You'll need a supported Bluetooth dongle that plugs into your device and communicates with the console (the CSR bluecore4-rom is recommended): https://gimx.fr/wiki/index.php?title=Bluetooth_dongle
- `wget https://github.com/matlo/GIMX/releases/download/v3.2/gimx_3.2-1_armhf.deb && sudo dpkg -i gimx_3.2-1_armhf.deb` # install gimx
- Plug your PS3 controller (aka Sixaxis) into your PS3, press the controller's PS button to pair it.  Then, unplug the controller from the PS3 and plug into your Raspberry Pi.
- `sixaddr`
- Should result in:
`Current Bluetooth master: 90:34:FC:F7:75:E3` # your PS3's Bluetooth address, set this to be MAC address of your ps3 within config/config.js, remember to enable the device as well
- ... And `Current Bluetooth Device Address: 04:98:F3:0C:FA:6B` # save for later, you can disconnect the PS3 controller now
- `hciconfig -a` # With your dongle plugged in, this should reveal the active dongle.
- Take note of a line that looks like this, with the rest of the metadata representing your dongle: `hci0: Type: BR/EDR  Bus: USB Etc.`
- `bdaddr -r -i hci0` # Use the integer (in our case 0) from the hci0 output above, in this command, to set the MAC address of your dongle to that of the Sixaxis you saved earlier.
- Your Raspberry's dongle will now pretend to be the Sixaxis controller.
- `switchBoard -c config/config.js` # power up your controller, hit the Raspberry Pi via your browser
- You should now see the PS3 tab, click on it, click on the power button (equivalent to the PS3's start button), and profit.
- Reference: [Installing on a Raspberry Pi](https://gimx.fr/wiki/index.php?title=RPi) (retrieved on 9.10.2014)

### More Device Installation Info

For details about each device's specific requirements for installation, refer to the well commented [config.js](config/config.js) for any given device.

Credit
---
Thank you to [Matlo from GIMX](https://blog.gimx.fr/) for his huge help in getting the PS3 control working.  If you use the PS3 functionality and enjoy it, consider a donation to his project.

Nearly every controller was inspired by hard work from others.  Trolling forums and seeing people's proof of concept code made many of them possible.  For each controller file, a relevant link to the given forum/blog/post/article/page is available in a comment at the top.

MP3 sounds were taken from [freesound.org](https://freesound.org/).  Specific attributions for each file are in the [attribution.txt](mp3/attribution.txt).

Also thanks to purecss.io and fontawesome.io for their assets.

Contact
---
If you have questions, comments or want to complain, email me at brian@bevey.org

If you require more immediate assistance, you can join [##switchboard on irc.freenode.net](https://webchat.freenode.net/?channels=#%23switchboard)

FAQ
---
- Q. Why aren't you using a seed-based JS library / referencing CSS from a CDN?

  A. I want to make sure this works without any Internet access.  You need local LAN access, but nothing critical should be over the Internet.  Some services (stocks and weather) obviously require access, but they are not core to the functionality of the app.

- Q. What is that dot in the top right?

  A. The dot indicates your connection state.  If you see it, congrats!  You're able to grab real-time info from SwitchBoard.  Your browser will attempt to connect via WebSockets for real-time updates.

  If your browser does not support WebSockets, it'll attempt to set up standard XHR polling.  If your browser doesn't support that, you can still issue commands, but will need to manually refresh your browser for updates.

  The colors indicate:

   * Red - Disconnected - and attempting to reconnect - or waiting to reconnect
   * Gray - Attempting to connect - or waiting to connect
   * Blue - Connected
   * No indicator - Either your browser doesn't support WebSockets, XHR or something bad happened.
   * Gray and Blue - XHR polling leaves the icon as gray, then will briefly flashes blue when it's grabbed the latest data.

- Q. How secure is this?

  A. Depends.  It's assumed that any device that's on your network is deemed white-listed.  This probably shouldn't be used on a large network with people you don't trust to screw with your TV. My goal is to provide the most security by keeping external connections to a minimum.  See "Q. Why aren't you using a seed-based JS library / referencing CSS from a CDN?"

- Q. Why don't you use SmartThings or another third party system to do all this integration?

  A. Most other systems are cloud-based.  This means that if you wanted to change your thermostat, you'd have to send a request to SmartThings, then it'd send a request to Nest.  I wanted to reduce that lag - but I also wanted to gain more control.  By having SwitchBoard do the integration, we can keep things local and we can do actions those cloud-based solutions cannot.  Want to poll every 5 seconds?  You'd be a jerk - but you can.  Additionally, I wanted to support hardware that isn't supported on other systems.  The Pi is capable of any TCP commands (Rest or Sockets) - but can also interface with Bluetooth, GPIO and any native Unix command.  This ability allows the PS3, text-to-speech and MP3 capabilities.

- Q. Does SwitchBoard have a REST API?

  A. Kind of.  For simplicity, everything is going through GET.  Allowing a browser to simply hit a URL has it's advantages - but if there's interest in adhering to the true spirit of REST, I can change to the correct PUT, POST, DELETE commands where appropriate.

- Q. How can I access this if I'm away from my home?

  A. I would strongly advise you to not just punch a hole in your firewall.  If your router supports VPN connections, it's a very safe option to configure your phone to connect to that before using SwitchBoard remotely.  If that's not possible or not convenient, you may use [ngrok](https://ngrok.com/) to easily access SwitchBoard (at no cost) with no additional configuration.  If you choose ngrok, be sure to [configure a password!](https://ngrok.com/usage#auth)
