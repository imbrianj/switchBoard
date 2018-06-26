---
layout: post
title: Current Status
tags: [general, dependencies]
---

I haven't posted anything for a while, so thought I'd give a quick update.  A lot of the latest changes are pretty limited to just bug fixes and updating of dependencies.  Much of my time is now spent trying to get the machine learning parameters tweaked so they are the most effective and minimizing inconvenient actions.  So far, I've been pretty happy with how things are working - but trying to teach new behaviors takes a bit more time than I'd like.  Otherwise, I've just been trying to address any of the little bugs that crop up.

I tag explicit versions for all dependencies so I'm able to see what affect each upgrade has.  I've recently upgraded `grunt` from 1.0.2 to 1.0.3.  With that upgrade, some of it's dependencies apparently no longer work with very old version of Node.js.  As such, official support has been dropped for Node.js 0.12 and below as well as io.js.  This shouldn't really bother most anyone as these are quite old - but, if for whatever reason, you do need to run on a very old instance, you may still find luck with `npm install --production` that should cut out much of the overhead and dependencies with no day-to-day impact.  You just won't be able to run tasks or tests locally.

I have begun work on Lutron support, but I haven't found the time to finish it up.  I've been able to read device state, but have had some difficulties in figuring out how to write to devices (ie: I can see a dimmer switch is at 50%, but I'm unable to set it to 75%).

Things I have in some state of development (with no promises of completion) are Lutron, asking simple questions ("do I need an umbrella?", "who is home?", "when is sunrise?", etc) and continuing bug fixes and minor tweaks.
