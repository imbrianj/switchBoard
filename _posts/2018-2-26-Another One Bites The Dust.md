---
layout: post
title: Another One Bites The Dust
tags: [general, dependencies, security]
---

I'll be honest.  I've got a touch of paranoia.  With everyone with their newfangled Google Alexas and whatnot, I just want to go back to a simple home automation like my forebears built with their bare hands.  With that, I've lately been spending more time trying to minimize outside exposure.  This comes in a few areas: creating devices that don't require APIs so I can, for example, ween off SmartThings.  Although SmartThings is a great product for what it is, I think it's fair to say that if you're compiling node.js on your Pi in pursuit of a home automation system - it might not be exactly what you're looking for.

![Very few remaining dependencies.](/switchBoard/images/dependencies/dependencies.png "Very few remaining dependencies")

Secondly, I'm trying to reduce dependencies.  Some, near as I can tell, are pretty unavoidable.  If you install your modules with `npm i --production`, you'll install only two immediate dependencies, with a total of ten total dependencies.  As node.js does not natively allow XML parsing, [xml2js](https://www.npmjs.com/package/xml2js) is used for RSS / Atom feeds and Roku support.  [Websocket](https://www.npmjs.com/package/websocket) is used for...well, connecting via websockets.

I had been using [request](https://www.npmjs.com/package/request) but removed it as it wasn't a huge burden to bake in that functionality, it had a lot of dependencies at 57 and had a (very minor) security issue with a dependency that took long enough to address, it was easier for me to just axe the whole thing.

SwitchBoard is written to be simple.  As my use-case isn't terribly advanced, it's often easy enough to just write my own little bits of code to get around having a relatively oversized dependency.  While this wouldn't fly if I were being paid to do this work; as a hobby, I find it more interesting this way.  This is in no way suggesting that my own code is more secure or better than those that it depends on - but at least this way, if issues are found, I'm able to address the code myself.  Like grandpa used to do.
