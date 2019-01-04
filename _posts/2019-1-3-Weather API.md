---
layout: post
title: Weather API
tags: [general, device, api, weather, home automation]
---

I've been happily using the Yahoo Weather API for quite a while now.  Yahoo has been pretty unreliable for long-term use.  I suppose this should be a lesson to those that depend on third party APIs anywhere.  Several years ago, Yahoo shut down their Stocks API - which I had integrated into SwitchBoard for quite a while.  They've now shut down the last API of theirs that I was actively using: their Weather API.

The API was shut down on January 3rd, 2019.  Since I don't actively monitor their docs or portal, I didn't realize it was being retired till SwitchBoard showed that the API was inactive.  Looking at their new documentation, it simply says it's been shut down and that one must submit a request for a new API token via email.  Odd that they don't just do this through a form input, but whatever.

I wrote up a really brief email: I'll be using for a personal project, I expect to hit the API every 3 - 5 minutes, yadda yadda.  A bot replies immediately with a link for more instructions (why weren't they just made available in the first place?).  [The instructions](https://developer.yahoo.com/weather/) have a few simple steps, but I'm not sure it matters right now - the [very first step](https://developer.yahoo.com/apps/create/) is to generate a token, but it only generates an internal server error.

So I'll wait a bit, see if they can fix that.  Otherwise, I'll probably move over to [Dark Sky API](https://darksky.net/dev)  I liked that (and the Stocks) API because it didn't require any crazy hoops to jump through, had a pretty clean output and were free for low volume, personal projects.  I still haven't found anything good for stocks, yet.  If anyone has suggestions for a suitable replacement, let me know.
