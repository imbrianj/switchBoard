---
layout: post
title: So, What About Privacy?
tags: [general, home automation, privacy]
---

A big reason I build SwitchBoard is so I can do things the way I think they should be done.  I like having my data be within my walls as much as possible.  For external APIs, you often have little choice in rely on those outside data points, but if they're varied, you at least lessen your exposure.  My personal setup consumes a decent number of APIs and no single one has any real useful bits - they're tied together and the logic to act upon them remains within my network.  Maybe I'm paranoid, but that seems like a good default starting place when building something that deals with so much personal information.

### So, what is SwitchBoard doing about privacy?

For one, I have no clue how many people use it.  I may be the only one.  For my development decisions, this seems like the safest assumption as it gives me the most leeway to build it how I think it should be built.  I don't use any tracking metrics aside from those that are unavoidable (Github Insights, NPM downloads, etc).  This blog doesn't use Google Analytics.  Tracking creeps me out.

It would be really helpful if I had functionality that, when an instance of SwitchBoard is installed, it would send data to me letting me know it was installed and with which devices, so I could focus efforts.  But that would go against a big part of why I started the project.  So I don't.  If there's a crash, it's not reported to me.  I depend on people reporting issues to me.  It's possible that, in the future, I may create an *opt-in* special pseudo-device to allow users to send me some usage data, but it't not currently planned.

SwitchBoard, how I have it configured, logs a whole lot of data.  To aid in the machine learning, it builds up an index of patterns it can then act upon.  These are all A) completely optional and opt-in and B) held entirely locally.  Nothing is shared with the cloud or external parties that you have not opted into during the configuration process.  This also means that any "seed" files - like those that were popular with JS frameworks are a no-go.

There are very few dependencies that are required to run SwitchBoard.  This mitigates unnecessary complication (in my opinion), exposure to external code vulnerabilities and keep SwitchBoard more aligned with the isolated anti-walled garden.  It's generic JavaScript - use it as you please.

Security and privacy have a fair bit of overlap.  Any APIs that support it, use SSL.  No credentials are sent to clients (except for Foscam - which is, unfortunately, required).

### What is SwitchBoard not doing about privacy?

A huge part of the built in security depends on SwitchBoard being within a trusted network.  You should not poke holes in your firewall to expose SwitchBoard as that will circumvent that security it depends on.  If you are not within a trusted network, you open yourself up to allowing anyone within that network to have control of your devices.  For most home automation systems - where a single domicile is paired with a single home network - this seemed like a reasonable assumption to make.  If, however, this does not suit your needs, reach out and I can see about other possible solutions.

Credentials are stored unencrypted on the server.  Those credentials are never shared to clients and only accessible via shell / ftp / local access - and via the device's encrypted HTTPS commands.  While not ideal, it removes considerable overhead and complication that I personally feel is not of any real benefit to most users.  If you fear that someone may have access to your files on the server on which SwitchBoard is running, your config file will have passwords and personal information and will be at risk.

With the assumption of the "single domicile is paired with a single home network" and automation system, there is no password protection or internal obfuscation.  I have not personally found the use case in which a person may be trusted to be on your network but should not be trusted to, say, adjust the thermostat or turn off lights.  If user settings or even generic password are something people are interested in, I can also look into that.

In the end, it is your data and you should have a say in how it's transmitted, kept and stored.  You also deserve a candid and plain-text description of how your data is used and what risks it might be at.  If storage or transmission of personal data is not critical to the function of the product, it should be seen as a liability and avoided at all cost.  When it comes to machine learning of personal behaviors and the granularity in which it's able to be tracked, this sentiment is only heightened.
