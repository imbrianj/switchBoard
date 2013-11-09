Universal Controller
---
Universal Controller is a node.js based application intended to run on a device within a local network - preferrably a dedicated server (such as a Raspberry Pi).  It allows all web capable devices within that same network to issue commands to any other configured device.  You may use your phone, tablet, desktop or laptop browser to interact with any controllable device - or issue simple GET commands programmatically.

Although the code is intended to be flexible enough to control a number of different devices, the focus was on:
 * Samsung SmartTVs - those that have Smart Hub and are manufactured in 2011+ should be capable.
 * Roku
 * PS3 - This device has no web-capabilities in terms of control, so you'll need to configure your server with a supported bluetooth dongle and manually set the bluetooth mac address to match a paired PS3 controller.

Setup
---
Download the source, edit js/config.js to reflect your node server IP, desired port to hit when you visit the remote and web mac address of the server (used for authenticating against Samsung TVs).  If you don't have a specific device, just comment out or remove the configuration for it.  If you do have a device you'd like to control, just populate the given fields - they should all be pretty obvious in their use.  Run node app.js then visit your node page.  Run a command from the remote and Allow access on your TV.

Credit
---
Thank you to the people that sorted out how to write to the Samsung TVs and paving the way for me to port this to node: http://forum.samygo.tv/viewtopic.php?f=12&t=1792
Also thanks to purecss.io and fontawesome.io for their assets.

Thank you to Matlo from GIMX for his huge help in getting the PS3 control working.  You should definitely check out his project and donate so he can get a PS4 and add support for that device as well. http://blog.gimx.fr/

Contact
---
If you have questions, comments or want to complain, email me at brian@bevey.org

FAQ
---
Q. Why aren't you using a seed-based JS library / referencing CSS from a CDN?
A. I want to make sure this works without any Internet access.  You need local LAN access, but nothing should be over the Internet.

Q. What devices are supported?
A. Right now: Samsung Smart TVs (2011 onward), Roku and PS3 (with some manual configuration).

Q. How can I configure my PS3?
A.
 * You'll need a supported Bluetooth dongle: http://gimx.fr/wiki/index.php?title=Bluetooth_dongle
 * Install GIMX version 1.11+ (earlier versions won't work): https://code.google.com/p/diyps3controller/downloads/list
 * Spoof an already paired PS3 controller: http://gimx.fr/wiki/index.php?title=Command_line#Linux_.2B_bluetooth
 * That's it!

Q. What's next?
A.
 * Bug fixes, polish.
 * Better reporting of device state (on, off).
 * Themes.
 * Get multi-device macros.
 * Integrate into SmartThings so I can program a macro to turn down the lights, turn on a movie.
 * Add support for PS4 (?)
 * Bug fixes, polish.

Q. How secure is this?
A. Not very.  It's assumed that any device that's on your network is deemed white-listed.  This probably shouldn't be used on a large network with people you don't trust to screw with your TV.