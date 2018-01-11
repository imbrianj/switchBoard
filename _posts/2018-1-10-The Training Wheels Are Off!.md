---
layout: post
title: The Training Wheels Are Off!
tags: [general, device, machine learning, home automation, gerty]
---

I had [posted before](https://imbrianj.github.io/switchBoard/Machine-(Slowly)-Learning/) about the Machine Learning incorporated into SwitchBoard.  At that time, I was still collecting data and wasn't able to fully test every part of the functionality.  I now have that data.

I've been making improvements to the Machine Learning - slight tweaks to how events are recorded and changes to the logic in how different events are considered.

One change to database records was the use of milliseconds instead of seconds.  While this will inflate data storage a bit, it makes a common baseline that can more intuitively be used throughout the codebase as this is natively acquired via `new Date.getTime()`.  If you have a bunch of recorded events and would like to update it to the new format, let me know and I can post a script I used.  It'll just run through all recorded time values and multiply them by 1000.  Worth noting: there is no current loss of functionality if you do not migrate.  Most all of the time records are done for features that have not yet been implemented.

Once the major bugs had been ironed out, I found the actions taken by SwitchBoard to be few, but not incorrect.  It has potential to be helpful, but I am still not convinced it will grow to be anything more than a novelty.  I will continue to tweak the parameters and build packages once I find something that's as usable as possible.

Some interesting observations I've seen are actions taken that were unexpected.  I was notified that "Because of subdevice-state-temp-Office-68, I'm 83% sure you want the Living Room Switch off".  While I didn't even notice that the Living Room Switch was turned off (meaning it was valuable in saving that electricity) - it was an unexpected relationship that the office temperature was 68&deg; and it thought that was related to the Living Room Switch at all - it is likelier chalked up to dumb luck than any profound insights gained.  Regardless, it's interesting to see it behave - and if it ever does misbehave, it's simple enough to correct it.  By simply countering whatever action it had committed within the (configurable) one minute grace period, it will automatically reinforce the desired behaviors.

I've added a ton more logging data, so you should be able to at least get an idea of why certain actions are or are not taken.  You may see messages in the log like:

```
AI: Ignoring Living Room Lamp since it recently changed state.
AI: Already set, but 97% confident Closet Lamp should be off.
AI: Only 66% confident Humidifier should be off.
```

This illustrates some of the five special conditions that the machine learning can derive:

1. It's a desired action.  Execute on it.
2. It's a desired action.  But the current state matches the desired state, so there's nothing to be done.  Ignore it.
3. It may or may not be a desired action - the device has undergone a change within a certain amount of (configurable) time.  Ignore it.  If you and your house have a disagreement as to what is a desirable state of any devices, this is the tie-breaker.  If you say "I want this lamp off", SwitchBoard cannot immediately disagree and turn it back on.
4. It is not a desired action as the confidence level has not surpassed the configurable threshold.  Ignore it.
5. It's a read-only device (such as a motion sensor, temperature sensor) - so no action can be done to the device.  Ignore it.

This solution is, admittedly, very simplistic.  It's a simple hash table of single events, mapped to many device states.  For a real breakthrough, I think compound conditions will need to be done.  If a motion sensor goes off AND my presence sensor is not active, the outcome could be very different than if I were home.  I'm trying to keep things simple for now, allowing me to change things quickly and not being overly committed into something overwhelming.
