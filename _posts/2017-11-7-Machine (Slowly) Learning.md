---
layout: post
title: Machine (Slowly) Learning
tags: [home automation, machine learning]
---

Is this thing on?

When I first started adding machine learning to SwitchBoard, I had the expectation that it'd start revealing some interesting usage patterns.  That it'd start taking over a bit and let me stop focusing on how I interacted with my house.  It seemed natural to think that if it had a reasonable sized data set that it'd be able to take the user out of the equation at least somewhat.

I was right.  And...well, I was also wrong.  So far, the end result has been pretty underwhelming.  Early on, I did not consider time or day variables.  Any action would be mapped to all similar actions.  To add some more fidelity to those results, I created sub-categories that events would be categorized by.  There would be four time variables: dawn, morning, afternoon and evening.  There would also be two day variables: weekday and weekend.  This is all well and good.  My behaviors change drastically between weekend evenings and, say, weekday mornings.  What I had naively not expected was how insanely high this set the bar on how much useful data one would need to collect before a reasonable level of confidence could surmise some useful responses.  We went from one bucket full of random events into `4 x 2 = 8` buckets of events.  Some of these will be more full than others (I'm far more active in the afternoon than, say, dawn).  Because of this, I've been tweaking my confidence (how certain are we that, given the existing data, you want an intended action to be carried out?) and threshold numbers (how many events like this need to be logged before we should even consider acting on them?) down considerably to try and find where that happy level of usefulness is.

Then there's the issue of redundant scripts.  My house has learned that I like to have my hall light on after I arrive home.  But I already have written a script to enforce this - since I want it to do this before any learned behavior.  Why wait for 100 iterations when it's something you automatically know will be desired 100% of the time?  So scriptable events still have their place - and they take over a fair bit of the work that machine learning otherwise would eventually handle.

And then there's the issue of redundant commands.  My house knows that when the motion sensor goes off during the day that my office light is on 95% of the time - so it should turn it on for me.  However, since the light is on 95% of the time, there's a low likelihood that there's anything to do at all.  Code has been written to prevent initiating an intent if the desired value is already the current state.  So it's completely ignored.  So the machine learning reinforces existing behaviors and doesn't leave a lot for it to do.  It silently dismisses an accurate but redundant intent.

To further reduce any disagreements between a user and the machine learning script, any device that has had their state change within a given period will not be acted upon by any machine learning intent.  If you enter a room, switch on a light, then trigger an action that may want that light turned off, it may be fair to assume that we should ignore that implied intent since your action was presumably explicit.

Things had been so quiet that I had to start adding logging data to my instance of SwitchBoard.  Watching the log as events fired, I could see it accurately reporting that either not enough data had been collected (something I can adjust numbers for and wait for more data to be collected), the confidence in that action was not high enough (which I can adjust - to a limit) or the target device already matched the intent.

I still see huge potential in machine learning in this space.  My setup is, admittedly, fairly simple - and I still have only collected about a month of useful data.  I'll be interested to see where things go once I collect more data, add in more functionality and find confidence and threshold values that make sense.  As this plays out, I intend to keep this blog updated.
