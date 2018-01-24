---
layout: post
title: Machine Learning Home Automation Update
tags: [general, device, machine learning, home automation, gerty]
---

I'd recently [taken the training wheels off](https://imbrianj.github.io/switchBoard/The-Training-Wheels-Are-Off!/) my machine learning home automation system.  For quite a while, it was quietly collecting data and logging when it thought it had high enough confidence to actually take action.  Since that time, I've made some changes to the way things are executed - but they've all been relatively small changes.  I've also made some observations I thought might be worth sharing.

At first, actions would be logged in the Gerty dialog, but I might not notice them right away, making correcting the action more difficult.  If Gerty triggers an action, you have one minute to correct that action before it then takes the new state as the desired state.  If it does something you do not like, you have a minute to correct it, allowing it to learn what is preferred.  Ignoring it, the action will be reinforced.  I've since added a bike bell sound, so I hear a chime when it takes action.  This is configurable, but I've found it helpful while I'm still learning what it wants to be doing.  Just a quick "hey, I just did something!"

A few interesting anecdotes:

 * I woke up late at night and went to the kitchen to grab a drink of water.  The light turned on automatically for me.  I could have done without it, but - hey, thanks!
 * Late at night, I was getting ready for bed and the bedroom lights turned off.  I would have hit the switch a minute later, but - sure, I'll call it good now.
 * Several times, when I was staying up later than usual watching TV, the lights would start turning off.  You're right - I should probably finish the episode tomorrow.
 * When I enter my office, depending on the day and time, the light typically turns on by itself.
 * A few other instances of "huh...I guess that's nice".

These all sound positive - and most are.  At worst, they're typically of neutral appeal (sure, the light turned off - that's fine.  I'll leave it off).  There have been a few instances where the triggered behavior was not as desired.  I have a light in my dining room I don't typically use - so when I was actually using it, it would want to turn off every 30 minutes (the event cooldown time).  I've upped this to 60 minutes and I've found it to be decent.  I would say that roughly 5% of the actions it takes are undesirable.  On a typical day, it executes 5 - 10 actions on it's own.  This could be increased at the cost of accuracy, but I'm still trying to find the sweet spot.

A large number of the action triggers are simple temperature measurements.  From there, it finds interesting relationships.  It's discovered that my office light is nearly always on when my laundry room is 70&deg;.  When these actions happen, they're usually not bad.  These temperature measurements are probably far more useful based on how the events are categorized.  Each event that's learned is bucketed into either a weekday or weekend.  From there, it's subcategorized into a time block (dawn, morning, afternoon, evening).  If an event is triggered in the evening, it will not add any weight to those considered for the morning.  These temperature readings are likely finding the overall averages "during the weekday, in the mornings - this light is usually off." - as opposed to considering what the temperature actually is.  Certainly the temperature itself is a factor in the equation, but I suspect it plays only a minor part.  One could add more granularity by subdividing these categories further - but it would come at the cost of either having to collect vastly more data (since each bucket must hit a threshold of events before being deemed reliable).  I think the current categories are probably fine - but I may revisit this in the future, as I have more data collected.

All in all, I've found the machine learning actions to be interesting.  Not super useful, but certainly a fun novelty to play with.  That being said, I've been happy with it and intend to continue experimenting.
