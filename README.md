Universal Controller
---
Universal Controller is a node.js based application intended to run on a device within a local network - preferrably a dedicated server (such as a Raspberry Pi).  It allows all web capable devices within that same network to issue commands to any other configured device.  You may use your phone, tablet, desktop or laptop browser to interact with any controllable device - or issue simple GET commands programmatically.

Video demonstration:

[![Demonstration of the Universal Controller](http://img.youtube.com/vi/6zJVRXMuuE4/0.jpg)](https://www.youtube.com/watch?v=6zJVRXMuuE4)

And a screenshot of it from an Android phone:
https://pbs.twimg.com/media/BnIqaMXCEAI5d-0.jpg

Or you may browse through a static version:
http://imbrianj.github.io/universalController/

Setup
---
###Easy
- ```npm install -g git+https://github.com/imbrianj/universalController.git```
- Add a config file anywhere on the device you want to run the app on. See the [default](config/config.js) file for examples
- Run ```universal-controller -c yournewconfigfile``` and profit

###Advanced
Download the source, edit js/config.js to reflect your node server IP, desired port to hit when you visit the remote and web mac address of the server (used for authenticating against Samsung TVs).  If you don't have a specific device, just comment out or remove the configuration for it.  If you do have a device you'd like to control, just populate the given fields - they should all be pretty obvious in their use.  Run node app.js then visit your node page.  Run a command from the remote and Allow access on your TV.

Credit
---
Thank you to the people that sorted out how to write to the Samsung TVs and paving the way for me to port this to node: http://forum.samygo.tv/viewtopic.php?f=12&t=1792

Thank you to Matlo from GIMX for his huge help in getting the PS3 control working.  You should definitely check out his project and donate so he can get a PS4 and add support for that device as well. http://blog.gimx.fr/

Thank you to the group that documented the Panasonic interface that I've ported to node:
http://cocoontech.com/forums/topic/21266-panasonic-viera-plasma-ip-control/page-2

Thank you to everyone that helped shed some light on LG develpment:
http://forum.loxone.com/enen/software/4876-lg-tv-http-control.html#post32692

Also thanks to purecss.io and fontawesome.io for their assets.

Contact
---
If you have questions, comments or want to complain, email me at brian@bevey.org

FAQ
---
- Q. Why aren't you using a seed-based JS library / referencing CSS from a CDN?

  A. I want to make sure this works without any Internet access.  You need local LAN access, but nothing critical should be over the Internet.  Some services (stocks and weather) obviously require access, but they are not core to the functionality of the app.

- Q. How can I configure my PS3?

  A.
   * You'll need a supported Bluetooth dongle: http://gimx.fr/wiki/index.php?title=Bluetooth_dongle
   * Install GIMX version 1.12+ (earlier versions won't work): https://code.google.com/p/diyps3controller/downloads/list
   * Spoof an already paired PS3 controller: http://gimx.fr/wiki/index.php?title=Command_line#Linux_.2B_bluetooth
   * That's it!

- Q. How secure is this?

  A. Not very.  It's assumed that any device that's on your network is deemed white-listed.  This probably shouldn't be used on a large network with people you don't trust to screw with your TV.