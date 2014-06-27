#Installing Generic Demo on Heroku
Generic Demo is a webapp that runs on a very minimal Node server.

As such, you could run on it on any platform that supports NodeJS.
These instructions explain how to deploy Generic Demo on the Heroku platform.

##Requirements
In order for you to deploy your own instance of the Generic Demo app
on Heroku you are going to need:

* **Git** You will need a recent version of [Git](http://git-scm.com)
on your system. You probably have one already
* **NodeJS** You will need a recent version of [NodeJS](http://nodejs.org)
on your system. If you don't have one already, just download and 
install the latest installable for your system as provided on the NodeJS website.
* **A Heroku account**: If you don't have one already, you will need to create one
by following [these instructions](https://id.heroku.com/signup)
* **The Heroku toolbelt**: The Heroku toolbelt needs to be installed on
your local system. You can install it by following [these instructions](https://toolbelt.heroku.com/)
* **An SSH key** in your local system, that is registered with your Heroku
account. Follow [these instructions](https://devcenter.heroku.com/articles/keys)

##Installing the code on your system
* Unzip the provided `generic.zip` file on a folder in your file system.
* Open the terminal/command line tool of your choice and `cd` into
the Generic Demo folder
* Initiate your git repo and commit your initial commit:

        git init
        git add .
        git commit -m 'Initial commit'

* Run `heroku create <whatevernameyouchoose>` from that folder.
* Add the heroku remote to your git

        git remote add heroku-whatevernameyouchose git@heroku.com:whatevernameyouchose.git

* Push your repo to Heroku:

        git push heroku-whatevernameyouchose master

If everything goes fine, you'll end up having a URL where your copy
of the Generic Demo has been deployed.

However, in order to be able to setup the portal with the different objects
that you need to interact with, you will need to run a javascript script
that should be provided to you soon.

#ScanThng.js: The ScanThng Client Library
**ScanThng.js** allows your application to leverage EVRYTHNG's Scanthng Service by submitting
QR codes, barcodes or previously registered images from objects and, thus, enable it 
to react to the identification provided by the service in any way you like.


##Adding ScanThng.js to your webapp
To add **ScanThng.js** to your site, you can just use our CDN to serve the file by using a
script tag like this:

    <script src='https://s3.amazonaws.com/scanthngjs-dev/scanThng_0.5.0.js'></script>

Alternatively, you can download the library from [the same URL](https://s3.amazonaws.com/scanthngjs-dev/scanThng_0.5.0.js)
and serve it from your own server.

##Dependencies

**ScanThng.js** doesn't depend on any external library. However, if your application
uses any library that makes use of the `$` global variable, it is recommended that
you load it **before** loading **ScanThng.js**, to prevent **ScanThng.js** from hijacking
the `$` var for internal purposes.

##Basic usage
Triggering an identification action is a two-step process. First of all, 
you need to create an instance of the **ScanThng** object like this:

    var scan = new ScanThng();

And then you need to call the `identify` method on the instance you just created.

    scan.identify();

If the user's platform supports **ScanThng.js** functionality, calling the `identify` method will 
trigger the identification process with ScanThng's default parameters.
Otherwise, the method will fail silently and harmlessly as it is effectively a noop.

You can detect whether the current user's platform supports **ScanThng.js** functionality, 
by checking the **ScanThng.js**'s `isScanThngSupported` boolean property. 

As an nice addition, in case **ScanThng.js** is not supported, 
the `identify` method will return the string `Your browser doesn't support ScanThng`.
Otherwise, if the configuration is ok but no API KEY has been specifiedthe return value will be the configuration.

##Options
**ScanThng.js** supports the following configuration options:

###config.scanType
Type: `String` Default: `QRCODE`

Indicate the type of image that the user is supposed to be scanning. Accepts a string with any of the
following values: `QRCODE`, `1DBARCODE` or `OBJPICT`. `OBJPICT` is the option to indicate for 
scanning product labels. Of course, `QRCODE` and `1DBARCODE` are for qrcodes and barcodes 
respectively.

###config.redirect
Type: `Boolean` Default: `true`

Indicates whether the application is supposed to be automatically redirected to the URL
associated with the scanned object, in case there is one.

###config.bw
Type: `Boolean` Default: `true`

Indicates whether the application is supposed to send a black and white version of the scanned
image for identification.

###config.startCb
Type: `Function` Default: `function( data ){ console.log( data ); }`

A callback function that will be invoked as soon as the identification process starts, that is,
as soon as the scanned image is confirmed by the user.

###config.successCb
Type: `Function` Default: `function( data ){ console.log( data ); }`

A callback function that will be invoked if the identification process ends up with a positive
match and `config.redirect` is set to false.

###config.errorCb
Type: `Function` Default: `function( data ){ console.log( data ); }`

A callback function that will be invoked if anything fails in the identification process.

###config.apiKey
Type: `String` Default: `` (empty string)

Must be a string containing a valid API KEY as provided by EVRYTHNG for your application.

###config.spinner
Type: `Object` Default: `{ auto: false }`

The configuration for the embedded spinner. Currently, this object only supports the `auto`
boolean property, which indicates that whether the embedded spinner should be automatically 
shown at the beginning of the identification process and stopped at the end.

##Setting the configuration
###Persistent configuration
**ScanThng.js** configuration needs to be set-up for every instance of the `ScanThng`
object. The easiest way to setup this configuration is by
passing an object to the constructor function, like this:

        var scan = new ScanThng({scanType: '1DBARCODE', successCb: function( data ){ alert( data ); } });

As you can guess from the example, there is no need to specify all the available parameters in the 
configuration object. Unspecified parameters default to **ScanThng.js**'s default configuration.

A **ScanThng** instance configuration can always be changed by invoking the `config` method.

        scan.config({scanType: 'OBJPICT', redirect: false});

The `config` method accepts the exact same object format as the constructor function and
works in the exact same way, changing the configuration of the **ScanThng** instance.

The `config` method returns the current configuration, as a configuration object. Thus,
you can use it like this:

        var myconf = scan.config(); // myconf will receive the current config configuration

This exact configuration will be used for for every call to the `identify` method, unless
an specific one-off configuration object is passed to the `identify` method as a
paremeter.

###One-off configuration
The `identify` method accepts a configuration object as a parameter, too.

When the `identify` method receives a configuration object, the options in that object
will override any other options with the same name for the **ScanThng** instance. However,
this will only have effect for the current invokation of the `identify` method.

        var scan = new ScanThng({scanType: '1DBARCODE', redirect: false});

        scan.identify()                         // expected scan type is barcode, redirect is false
        scan.identify({scanType: 'OBJPICT')     // expected scan type is arbitrary picture, redirect is still false
        scan.identify()                         // expected scanType is again barcode, redirect is still false

###Callbacks
The `errorCb` and `successCb` callbacks will receive a parameter which is
ScanThng Service's response.

The `startCb` receives an object with the current configuration as its only parameter.

###Limitations
As a basic security mechanism, browsers don't allow an input file action to be started
without any interaction from the user. This means that any call to the `identify` method
needs to be triggered, at some point in your code, by a user action and not in a 
completely programmatic way.

###Spinner
**ScanThng.js** includes the wonderful [spin.js|http://fgnass.github.io/spin.js/] library.
That makes it possible for you to add spinners to your webapp very easily without having
to look for any other solutions.

There are currently two ways you can add a spinner to your application workflow.

The first one is by setting the `config.spinner.auto` option to true. As explained,
this will make a spinner appear as soon as an image is selected for identification,
and will be hidden as soon as the identification process ends. Currently, there is 
no way to customize this automatic spinner.

The second one, and more powerful, is by leveraging the fact the ScanThng exposes
the `Spinner` object available as global variable. Thus, you can use all the power of
[spin.js|http://fgnass.github.io/spin.js/] in combination with **ScanThng.js** or
on its own for any other purposes in your webapp.

