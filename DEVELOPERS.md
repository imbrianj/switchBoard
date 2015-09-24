Developer Documentation
---
###Anatomy of a controller

Each controller type is defined by many different components:
 - Inside the ```config/config.js``` you'll see the basic configuration options for any given device.  This may include standard options such as:
   - ```typeClass``` - Defines the namespace of the device.  Your controller, templates, parsers files will all have to use this same namespace.
   - ```disabled``` - Defines if the module is to be ignored.  Defaults to "false".
   - ```disabledMarkup``` - Defines if the module should be loaded, but not rendered.  Useful for controllers that will be used for fired events, but not direct interaction (such as SMS).  Defaults to "false".
   - ```title``` - What you'd like this device controller to appear as in your navigation.
 - Further, other options may be defined here that are required for use by the device controller.  This can include any number of things, such as API keys, IP addresses, login credentials for various services or devices.  Be aware that some care was taken to obfuscate your entered credentials, but they can be easily grabbed from anyone with access to your installed instance of SwitchBoard.
 - Inside the ```controllers``` directory, you may create a file with the same name as you defined as your ```typeClass``` in the config above.  Within this file, the ```send()``` method will be executed for any command sent to this device.  Other functions may include:
   - ```init()``` - Run when the server is first started up.
   - ```onload()``` - Run when a user connects.
   - ```state()``` - Can optionally be set to find a given device's state by the schedule poller.
 - Most controllers will want to display markup.  You may create a template file called ```template.tpl``` in your device's subdirectory.  For any template fragments, they can be stored in the ```devices/[YOUR DEVICE NAME]/fragments/``` and referenced from your controller's ```fragments``` method.  Since you specify the filename to be used manually, you can name them whatever you want - but prefix the name with your typeClass (such as "nestGroups.tpl").
 - To glue together the templates and fragments to your living controller, you'll create a file with the same typeClass name set in your config and name it ```parser.js``` in your device directory.  This will be used both on the client and server side to render markup based on changes to the global State object.

Within the actual code, you'll often see a variable called ```controller```.  This is a chunk of the wider ```controllers``` object, but sent to each device controller in order to sandbox what that device can do at the lowest levels (where it doesn't make sense for you to interact with other devices).  Within the ```controller``` object, you'll often see ```controller.config``` - which largely contains the configuration options that define that specific instance of the controller.  This sets the configuration options of a given IP that goes to a specific television, for example.  For more generic device control elements, such as ```keymap```, valid ```inputs``` and any of the methods for the device to act on will live in the ```controller.device``` object.

The ```State``` object is kept updated with the most current state of the world for every device.  It's exposed to the frontend clients and is meant to be free of any credentials or potentially private information (such as passwords or anything aside from "this device is alive" or "the light is on" kind of information).  This object should only be accessed via the getter/setter in ```deviceState.js```.
