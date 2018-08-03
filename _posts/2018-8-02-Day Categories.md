---
layout: post
title: Day Categories
tags: [general, device, machine learning, home automation, gerty]
---

I've been making a lot of use from the machine learning aspects of SwitchBoard lately.  It's been pretty handy (and sometimes borderline spooky) when a light turns on the second you think you want it on, without any explicit interactions at all.  While the good outweigh the bad actions by a fair margin, there have been a few notable "oh, that's not good" moments.  Specifically when someone is asleep and a light turns on because Sunday is a weekend, I stay up late on weekends, and it's 11:30pm...a work night.  Not good.

Clearly, I needed to add some additional buckets of data to sort events into so that it's clear that my Friday and Saturday nights, where I stay up late, are different than Sunday nights, where I go to bed at a reasonable hour.  Or what about those that work schedules that have their days off on days other than weekends?  I've just committed code to go from simple weekday/weekend time categories to one for each day of the week.

All good, right?  Well, there are some drawbacks.  One big caveat is that, if you were using the machine learning up till now, you'll have to rename your cache/db/processed.json file and restart SwitchBoard to let it generate the new processed file - which can take quite a while (on a Pi, maybe measured in hours depending on the amount of data).  I have about 10 months of data being processed.  The resulting file has roughly tripled in size.  As this file is stored in memory, you can expect about ~20MB of additional memory to be consumed if you consider my usage a yardstick.  Beyond this, since there are more discrete time categories in which events may be logged, you'll need up to 5x more data logged before actions will be reliably learned.  I may tweak the default config settings to be a bit more loose as it begins to learn, allowing people to see actions sooner, even if they're maybe not nearly as accurate as we'd like.

This is just an experiment to see if the costs outweigh the benefits.  I expect this to be a positive change, given the accuracy and memory footprint.  The time to learn has increased a bunch, but I think the long-term benefits are pretty good.  While I would like to use both - broader categories for the early days of learning and the more granular as it begins to learn more about your patterns, I think a clean solution that doesn't unnecessarily consume too much memory probably isn't worth the effort.

Once I think I've found the sweet-spot for the config defaults, I'll roll out npm package 0.3.0.
