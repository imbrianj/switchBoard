---
layout: post
title: A Look At Things To Come
tags: [general, home automation]
---

I've been trying to keep updating SwitchBoard with features and bug fixes.  There are a few things that seem logical to add that I've avoided - and there are a few that seem illogical that I have prioritized higher.  I thought I'd share a bit of what I have on my current "todo list" - and a few items that I probably will not be working on soon (and why).

### Things High On My List

Twitter.  I've integrated a simple Twitter client into SwitchBoard, but it's proven to be pretty unreliable.  About 30% of the time, the response from the server will come back with an error.  I hadn't had the time or motivation to address this, but I want to move it from "Development" to "Testing" in the near future.  The use-case for this is that you could tweet your house and have it take action based on who sent it (a whitelist of who it will listen to).  Commands will likely be plain-text, similar to what Gerty accepts - including macros.  "Turn on the porch light and the hall light."  "I'm coming home." - these and similar commands could be a convenient way to issue commands from outside your local network.

Service Workers.  Although they likely won't be very functional, as SSL (discussed later) is required - I want to at least have the functionality built in the off-chance I can find a *reasonable* solution to the ongoing SSL woes.

Interactive Chat.  You can currently tell Gerty what you want, but you cannot query for simple data.  I've started some very basic work for useful bidirectional communication here.  Asking questions like "Who is home?", "What's the weather like?", "Do I need a jacket?", "What's going on?" should yield at least some reasonable responses.

Screensaver.  At one time, I had envisioned mounting an Android phone or tablet to my wall to issue house commands.  With OLED screens, a purely black display would be effectively be turning that screen "off".  I had started - but not finished - work on a client side screensaver that, after a timeout period of inactivity, would turn the screen black.  Tapping the screen would immediately reveal the normal interface.  This should be simple and hope to finish it soon.  I just lacked the motivation since other tasks took priority and I had no immediate use for this.  I'll also have to consider those that want the screensaver for some clients but not others (client toggle'able?).

### Things Not So High On My List

Samsung TVs.  They've updated their protocol so my device controller will not work with newer models.  There's a [lengthy ongoing issue](https://github.com/imbrianj/switchBoard/issues/55) that goes into greater detail for those interested.  TL;DR: It's a tough problem that smarter people are working on - and I do not have access to the device.

LG TVs.  I'd made some progress on this early on, but never got around the authentication.  The system itself is well documented, but requires just a bit of troubleshooting.  I don't have access to the device which makes this testing difficult.  If anyone has interest in helping here, I'm happy to prioritize it.  Until then, I imagine it'll stay in "Development".

SSL.  I've already gone into great detail about the [issues with SSL on an Internet](https://imbrianj.github.io/switchBoard/Developing-on-a-Moving-Target/) so I won't rehash those bad memories.  While it's totally doable to set up an internal certificate authority, it's not exactly scalable for an "out of the box" system.  While I have expectation that those using SwitchBoard can edit some simple JSON files, I think setting up a cert authority is a step too far.  If I have time and patience, I'll look into maybe documenting the easiest method to get things working.  Being that each platform may be different, it could be of limited use.
