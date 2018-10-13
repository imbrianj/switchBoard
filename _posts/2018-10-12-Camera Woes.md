---
layout: post
title: Camera Woes
tags: [general, device, home automation]
---

The other week, the Foscam I'd been using for a number of years blew up.  It had an audible "pop" as something inside decided to give up.  I went on the hunt for a camera I could replace it with and found it to be pretty difficult.  Most are now using h.264 since it has much better quality than mjpeg - but it comes at the cost of compatibility.  For web stuff, mjpeg is pretty tough to beat, as long as you don't care too too much about the quality - so I figured that was what I was aiming for.  Foscam - and their new company Amcrest - both have switched over entirely to h.264.  So that's not a great option for this use-case.

I've opted to buy a couple D-Link DCS-5222L HD cameras.  They have very similar specs to the old Foscam, but the software seems more refined.  I have some basic controllers set up to pan / tilt / go to preset locations but haven't hooked up streaming, DVR or anything else yet.

They have their own integration problems, though.  Chrome has removed the ability to embed Basic Auth assets.  This means that I cannot directly reference the D-Link camera feed to the browser in the SwitchBoard interface.  As I can get the Basic Auth from node, I'm intending to pipe that output to a locale endpoint on the SwitchBoard instance.  We'll see if that works and what the performance impact will be.  The interface already lazy loads and unloads dynamic images - so if you're not viewing the image, it should automatically cease streaming.

If you're shopping for a camera, I'd hold off on a recommendation from me here, but these seem promising.  I just wish they allowed the authentication to be sent via GET params.  Even if done optionally, it'd widen the usefulness for when run on a secured network.  If the piping works efficiently enough, it's just as well - it'll help conceal credentials to the interface.  While that isn't a value-add for me, maybe it is for someone else.

I also intend to start picking at Lutron integration again - but no promises on delivering something usable.
