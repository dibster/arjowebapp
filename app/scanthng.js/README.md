#scanthng.js: The ScanThng Client Library
**scanthng.js** allows your application to leverage EVRYTHNG's Scanthng Service by submitting
QR codes, barcodes or previously registered images from objects and, thus, enable it
to react to the identification provided by the service in any way you like.


##Adding scanthng.js to your webapp

To add **scanthng.js** to your site, you can just use our CDN to serve the file by using a
script tag like this:

    <script src='//d10ka0m22z5ju5.cloudfront.net/toolkit/scanthng/scanthng-0.6.4.js'></script>

Alternatively, you can download the library from
[the same URL](//d10ka0m22z5ju5.cloudfront.net/toolkit/scanthng/scanthng-0.6.4.js)
and serve it from your own server.

Whatever version you are using, you can always find the latest version of scanthng.js at:

    d10ka0m22z5ju5.cloudfront.net/toolkit/scanthng/scanthng.js

But please be aware that we may introduce backwards incompatible changes into the
library now and then. So we do suggest that you use a numbered version of
**scanthng.js** in the production version of your apps.


##Dependencies

**scanthng.js** doesn't depend on any external library. However, if your application
uses any library that makes use of the `$` global variable, it is recommended that
you load it **before** loading **scanthng.js**, to prevent **scanthng.js** from hijacking
the `$` var for internal purposes.

##Basic usage
Triggering an identification action is a two-step process. First of all,
you need to create an instance of the **ScanThng** object like this:

    var scan = new ScanThng();

And then you need to call the `identify` method on the instance you just created.

    scan.identify();

If the user's platform supports **scanthng.js** functionality, calling the `identify` method will
trigger the identification process with ScanThng's default parameters.
Otherwise, the method will fail silently and harmlessly as it is effectively a noop.

You can detect whether the current user's platform supports **scanthng.js** functionality,
by checking the **scanthng.js**'s `isScanThngSupported` boolean property.

As an nice addition, in case **scanthng.js** is not supported,
the `identify` method will return the string `Your browser doesn't support ScanThng`.
Otherwise, if the configuration is ok but no API KEY has been specifiedthe return value will be the configuration.

##Options
**scanthng.js** supports the following configuration options:

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

###config.inBrowserQRdecoding
Type: `Boolean` Default: `false`

Indicates whether the application is supposed to use the its own ability for decoding
QRcodes (via javascript, thus 'in browser'). The default `false` value indicates
that the image that presumably contains a picture of a QR code will be sent
to the ScanThng Service for identification.

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

###config.serviceUrl
Type: `String` Default: `https://api.evrythng.com`

The hostname for the ScanThng Service. The default value points to the in-production
version of the service.


##Setting the configuration
###Persistent configuration
**scanthng.js** configuration needs to be set-up for every instance of the `ScanThng`
object. The easiest way to setup this configuration is by
passing an object to the constructor function, like this:

        var scan = new ScanThng({scanType: '1DBARCODE', successCb: function( data ){ alert( data ); } });

As you can guess from the example, there is no need to specify all the available parameters in the
configuration object. Unspecified parameters default to **scanthng.js**'s default configuration.

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
**scanthng.js** includes the wonderful [spin.js](http://fgnass.github.io/spin.js/) library.
That makes it possible for you to add spinners to your webapp very easily without having
to look for any other solutions.

There are currently two ways you can add a spinner to your application workflow.

The first one is by setting the `config.spinner.auto` option to true. As explained,
this will make a spinner appear as soon as an image is selected for identification,
and will be hidden as soon as the identification process ends. Currently, there is
no way to customize this automatic spinner.

The second one, and more powerful, is by leveraging the fact the ScanThng exposes
the `Spinner` object available as global variable. Thus, you can use all the power of
[spin.js](http://fgnass.github.io/spin.js/) in combination with **scanthng.js** or
on its own for any other purposes in your webapp.

#Developing scanthng.js
##Grunt workflow
To develop `scanthng.js` you need to have `node`, `npm`,
`bower` and [Grunt](http://gruntjs.com).

You can install `bower` by executing:

    npm install -g bower


After you have cloned this repo, make sure the `grunt-cli` utility
is installed in your system as a global node-module. You can
install by issuing:

    npm install grunt-cli -g

Before you start coding, make sure you run: `npm install`  from the root folder
of your local copy of this repo to ensure you have all the necessary packages
for the different development tasks.

**Please notice** that every time you want to run a grunt command, you must do it
from the terminal and, specifically, from the root folder of your local copy
of this repository.

Also notice that if you need to deploy your changes, either to the production or
to the testing S3 buckets, you will need to have the necessary AWS keys set up
properly (See [Preparing for Deployment](#preparing-for-deployment) ).

##JSHint
[JSHint](http://jshint.com) is a tool for detecting syntax errors and potential problems
in your javascript files.

The rules that are applied to this particular project are written in the `.jshintrc`
file, which is in the root folder of this repo.

You can run `grunt jshint` at any moment to verify that all your javascript
files pass the syntax check.

##Testing
The current test suite requires the use of an additional library:
[Jasmine](http://jasmine.github.io) that should have been installed
for you when you ran `npm install`.

You can run the full test suite against the current codebase by
executing:

    grunt jasmine

You can also create a task that watches your javascript files (source files
and test files) and runs the full test suite every time any of those
files changes. To do that just run:

    grunt watch:jstest

##Building
The `build` grunt task will create a new build of the library by executing
the following subtasks in the proper order:

* jshint
* jasmine
* concat (this concatenates the different source files)
* copy (makes a copy of the concatenaded file with no version in the filename)
* uglify (makes minified copies of both concatenated files)

Currently, the files that source files that form `scanthng.js`
are:
    - scanthng.js (our own code)

and the following 3rd-party libraries:
    - spin.js
    - jsqrcode.js
    - megapix-image.js
    - zepto.js (custom version)

As an additional step, The `concat` and `uglify` tasks add the necessary
banners at the beginning of their output files.

To invoke this whole build process you can execute:

    grunt build

Or simply:

    grunt

###Creating quick and dirty documentation
You can create some convenient html files that show your code comments
side-by-side to your code by issuing:

    grunt docco

The resulting web pages will be saved in the `docs` folder.

##Deploying
###Preparing for deployment
To be able to deploy either to production or to the testing
environments, you need to have the `AWS_ACCESS_KEY_ID` and
`AWS_SECRET_KEY` environment variables properly set up.

Alternatively you can have a file named `aws-keys.json`
with this content:

    {
        "AWSAccessKeyId": "aaaaaaaaaaaaaaaaaaaa",
        "AWSSecretKey": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    }

Of course, you need to replace these fake keys with your own ones.
You need to ask the ops person, as every developer needs to
have **their own keys**.

After that, you are ready for deployment.


###Deploying to production
To release `scanthng.js` to production you should:

1) Make sure you don't have any uncommited files.
2) Update the version number in `package.json`
3) Edit CHANGELOG.md to reflect the changes that have
been introduced in the release
4) Run `grunt deploy`

`grunt deploy` will build the library by actually calling `grunt build` and
if everything is fine it will attempt to do the following:

* `git tag` the current state of the repo with the package version
that is indicated in the `package.json` file.
* Update this very README.md file to mention the released version
* Upload all the compiled files to the correct S3 bucket, from where
they will be copied to the CDN (Cloudfront).
* `git push --tags` to push your latest commits to GitHub alongside
the generated tag.
* `git push` to push all pending commits to master

Make sure you change the version number in the `package.json` file
before deploying.

Currently, there are 2 files being deployed:

    scanthng.js
    scanthng-0.6.4.js

Where the version number is taken from `package.json`.

###Deploying a nightly version
While in development, you can build and deploy `scanthng-nightly.js`
to a demo S3 bucket for testing.

For doing that, just execute:

    grunt deploynightly

After that, grunt will attempt to go through the same building
process as for the production deployment, but it will attempt to deploy
two files named:

* scanthng-nightly.js
* scanthng-nighly.min.js

They will be released into the `s3.amazonaws.com/scanthngjsdemo` bucket.

###Deploying a timestamped test version 
It is also possible to deploy timestamped versions of `scanthng.js`.

For doing that, just execute:

    grunt deploydemo

Grunt will attempt to go through the same building
process as for the production deployment, but it will attempt to deploy
two files with a timestamp on the name so that they don't conflict
with any other demo versions in use:

* scanthng-0.6.4-#############.js
* scanthng-0.6.4-#############.min.js

They will be released into the `s3.amazonaws.com/scanthngjsdemo` bucket.
