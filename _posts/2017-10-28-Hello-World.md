---
layout: post
title: Hello World
tags: [general, device, machine learning, home automation, gerty]
---

There was some interest in following development progress.  This is the first step in setting that up.

The latest work done to SwitchBoard has been the addition of some simple Machine Learning which has garnered some interest.  The more you use the system, it's able to start determining patterns of use, conditional on the state of current devices, time of day and whether it's a weekday / weekend.  As one area of focus has always been to support slower machines, with the target install location to be on a Raspberry Pi, there had to be some concessions made to the granularity of specific data points.  For this reason, the time conditions are broken into four 6-hour categories: "Dawn", "Morning", "Afternoon" and "Evening".  Day types are simply bucketed into "Weekday" and "Weekend"  One limitation in this is that if you hit a switch at, say, 11:59am, any explicit pattern found in the afternoon will be ignored.  As this is all based on averages, I suspect the end result will be of no real consequence; thus, a reasonable compromise.

For now, SwitchBoard tries to draw together these actions but will currently only notify you of it's intent via the Gery chat log.  Soon, a flag will be added so it may act on these intentions if they fall beyond a specific threshold.  I've been waiting to add this ability to initiate action until I've built confidence in knowing that it won't misbehave.

The Gery chat log is an area where SwitchBoard is able to communicate to users in an unobtrusive way.  Gerty is a "bot" that derives it's emotional state based on environmental criteria - is everyone home?  Is it sunny?  Is the TV on?  All these can combine to derive an emoji that is displayed and randomly fire animated events to keep things interesting.  Clicking the emoji will - on supported systems - start a voice recognition instance.  Any speech or written text will be read and implied intent will try to be derived.  "Turn on the living room lamp and hall light" will result in those given subdevices to change both states to "on".  Likewise, it's able to use this same chat log to let you know if someone was at your front door, if you received a package, when the sun goes down or any number of other "kinda useful" things that you'd like to have a timestamped log of.  I'll write later about some more specifics of Gerty, what he's capable of, where he came from and where I hope to integrate into him next.
