---
layout: post
title: Enabling Voice Commands On Android
tags: [general, howto, home automation, gerty, voice, android]
---

I'm not a big fan of "always on" smart speakers such as Google Home, Alexa, etc.  To me, it's just too creepy to have a speaker closely tied to the Internet, built by companies with a vested interest in knowing more about you that's always on and listening.  If you're paranoid like me, here are some steps to get on-demand (ie: requiring a button press) voice recognition on your smart phone that will work with SwitchBoard.

1. You'll need [Tasker for Android](https://play.google.com/store/apps/details?id=net.dinglisch.android.taskerm).
2. Open Tasker and go to the "Tasks" tab.
3. Click the "+" in the bottom right to create a new task.  Enter "Voice" (or something) as the name.
4. Inside the "Voice" task, click the "+" to create a new `Action`.
<span class="images">
  [![List of all Action Categories](/switchBoard/images/voice/selectAction.png "List of all Action Categories")](/switchBoard/images/voice/selectAction.png)
</span>
5. Click `Input`, then `Get Voice`.  You can leave the settings for `Get Voice` default.
<span class="images">
  [![Creating a new "Get Voice" Action](/switchBoard/images/voice/inputActions.png "Creating a new "Get Voice" Action")](/switchBoard/images/voice/inputActions.png)
  [![My settings for Get Voice Action](/switchBoard/images/voice/voiceConfig.png "My settings for Get Voice Action")](/switchBoard/images/voice/voiceConfig.png)
</span>
6. Go back to the "Voice" task and click the "+" again to create another new `Action`.
7. This time, click `Net`, then `HTTP Get`.
<span class="images">
  [![Creating a new "HTTP GET" Action](/switchBoard/images/voice/networkActions.png "Creating a new "HTTP GET" Action")](/switchBoard/images/voice/networkActions.png)
</span>
8. Inside the settings for the network action, specify your `Server:Port`.
9. For the `Path`, enter: `?gerty=text-%VOICE`.  Note, if you've changed Gerty's deviceId from the default in SwitchBoard, change that here to match.
<span class="images">
  [![My settings for HTTP GET Action](/switchBoard/images/voice/networkConfig.png "My settings for HTTP GET Action")](/switchBoard/images/voice/networkConfig.png)
</span>
10. In the main "Voice" task page, you'll see an icon in the bottom center.  Clicking this allows you to associate an icon.  I had chosen `Material` and searched `Voice`.
<span class="images">
  [![Searching for "Voice" within the Material icon list](/switchBoard/images/voice/iconChooser.png "Searching for "Voice" within the Material icon list")](/switchBoard/images/voice/iconChooser.png)
  [![View of completed Task](/switchBoard/images/voice/taskView.png "View of completed Task")](/switchBoard/images/voice/taskView.png)
</span>
11. Back at the home screen of your phone, long press on an empty space.  When the menu pops up, selected `Widgets`.  Scroll down to `Tasker` and hold the `Task` icon and drag it to your home screen.
12. In the `Task Selection`, choose your new "Voice" task.

You should now have an icon on your home screen allowing you to quickly fire voice commands to SwitchBoard.

<span class="images">
  [![Example of using Get Voice from a desktop icon](/switchBoard/images/voice/voiceInput.png "Example of using Get Voice from a desktop icon")](/switchBoard/images/voice/voiceInput.png)
</span>
