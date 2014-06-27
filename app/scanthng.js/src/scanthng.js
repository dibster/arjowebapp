// (c) Copyright 2014 EVRYTHNG Ltd London / Zurich
// www.evrythng.com
/*global qrcode, MegaPixImage, Spinner, Zepto*/

(function() {
    'use strict';
    var innerconf = {
        acceptedInputTypes: ['1DBARCODE','QRCODE','OBJPICT'],
    };

    var spinner;

    // This adds a hidden modal div to the DOM and
    // then adds a spin.js spinner to it
    // which can later be called by the callback functions
    var initializeSpinner = function(){
        spinner = new Spinner( );
    };

    var persistentConfig = {
        redirect: true,
        inBrowserQRdecoding: false,
        bw: true,
        successCb: function( data ){ console.log(data); },
        errorCb: function( data ){ console.log( data ); },
        startCb: function( data ){ console.log( data ); },
        scanType: 'QRCODE',
        invisible: true,
        spinner: {},
        serviceUrl: 'https://api.evrythng.com',
        apiKey: ''
    };

    var message = '';
    var file;

    var isCanvasSupported = function() {
        return !!document.createElement('canvas').getContext;
    };

    // We couldn't find how to do feature detection for the media capture
    // element, so we decided to do browser sniffing (sighs!)
    //
    // Media capture is supposed to work in the current browsers:
    //* Android 3.0 browser
    //* Chrome for Android (0.16)
    //* Firefox Mobile 10.0
    //* iOS6 Safari and Chrome (partial support)
    var isCaptureSupported = function(){
        var ua = navigator.userAgent ;
        var uaindex, mobileOSver, version ;

        // Android 3.0 is supposed to support Media Capture
        if ( ua.match(/Android/) && !ua.match(/Chrome/) ) {
            uaindex = ua.indexOf('Android ');
            mobileOSver = ua.substr( uaindex + 8, 3 );
            version = mobileOSver.substr(0, mobileOSver.indexOf('.'));
            return ( version >= 3 );

        // Chrome for Android 0.16 (that is Chrome 16) is supposed to support Media Capture
        } else if ( ua.match(/Android/) && ua.match(/Chrome/) ) {
            uaindex = ua.indexOf('Chrome/');
            mobileOSver = ua.substr( uaindex + 7, 3 );
            version = mobileOSver.substr(0, mobileOSver.indexOf('.'));
            return ( version >= 16 );

        // Firefox Mobile 10.0 is supposed to support Media Capture
        } else if ( ua.match(/Firefox/) && ua.match(/Mobile/) ) {
            uaindex = ua.indexOf('Firefox/');
            mobileOSver = ua.substr( uaindex + 8, 3 );
            version = mobileOSver.substr(0, mobileOSver.indexOf('.'));
            return ( version >= 10 );

        // iOS version 6 (Chrome or Safari) is supposed to support Media Capture
        } else if ( ua.match(/iPad/) || ua.match(/iPhone/))  {
            uaindex  = ua.indexOf('OS ');
            mobileOSver = ua.substr( uaindex + 3, 3 );
            version = mobileOSver.substr(0, mobileOSver.indexOf('_'));
            return ( version >= 6 );
        }
        return false;
    };

    // The device doesn't need to to support media capture in order
    // to enable the identification process. The user can always
    // upload an image file from their file system.
    // However, canvas is necessary to resize images and turn to b&w
    // before uploading.

    var isScanThngSupported = function(){
        var ua = navigator.userAgent ;
        var uaindex, mobileOSver;

        if ( isCanvasSupported() ) {
            // If Firefox for Android we assume it supports canvas,
            // because we don't have actual data about this support
            // but we know Gecko has fully supported canvas since 2.0
            if ( ua.match(/Android/) && ua.match(/Gecko/) ) {
                return true;
            }

            // Opera Mobile supports canvas completely
            if ( ua.match(/Android/) && ua.match(/Opera Mobi/) ) {
                return true;
            }

            // Android 2.x doesn't support canvas.toDataURL
            if ( ua.match(/Android/) && !ua.match(/Chrome/) ) {
                uaindex = ua.indexOf('Android ');
                mobileOSver = ua.substr( uaindex + 8, 3 );
                return ( mobileOSver >= 3 );
            }
            return true;
        }
        return false;
    };

    // Validates the spinner sub-object passed in a configuration
    var isValidSpinnerConf = function( spinnerconf ){
        if ( typeof spinnerconf !== 'object' ) { return false; }
        return ( spinnerconf.auto === undefined || typeof spinnerconf.auto === 'boolean' );
    };

    // Sets the persistent configuration if a valid configuration object
    // is passed as parameter
    var setPersistentConfig = function( config ) {
        if (typeof config === 'undefined'){ return; }    // No changes to the the persistent configuration
        if (!isValidConfig( config )){ return 'Error: Invalid configuration object'; }  // We don't allow any error

        persistentConfig.spinner = config.spinner || persistentConfig.spinner;
        persistentConfig.inBrowserQRdecoding = ( config.inBrowserQRdecoding !== undefined ) ? config.inBrowserQRdecoding : persistentConfig.inBrowserQRdecoding;
        persistentConfig.invisible = ( config.invisible !== undefined ) ? config.invisible : persistentConfig.invisible;
        persistentConfig.redirect  = ( config.redirect  !== undefined ) ? config.redirect : persistentConfig.redirect;
        persistentConfig.apiKey = config.apiKey || persistentConfig.apiKey;
        persistentConfig.serviceUrl = config.serviceUrl || persistentConfig.serviceUrl;
        persistentConfig.bw = ( config.bw !==  undefined ) ? config.bw : persistentConfig.bw;
        persistentConfig.successCb = config.successCb || persistentConfig.successCb;
        persistentConfig.errorCb =  config.errorCb || persistentConfig.errorCb;
        persistentConfig.startCb = config.startCb || persistentConfig.startCb;
        persistentConfig.scanType = ( config.scanType && ( innerconf.acceptedInputTypes.indexOf(config.scanType) >= 0)) ? config.scanType : persistentConfig.scanType;
    };

    // This is the process that creates the mediaCapture element
    // Important: to hide this input from the user,
    // use 'visibility:hidden' ('display:none' will not work on some devices)
    var id = function( conf ){
        if (!isValidConfig( conf )){ return 'Error: Invalid configuration object'; }

        // We call media capture with the configuration
        // taht results from falling back the local config
        // to the global config
        addMediaCapture( createOneOffConfig( conf ));
        return message;
    };

    // This validates a config object (either persistent or transitory)
    var isValidConfig = function( conf ){
        return ( conf === undefined || (
            ( conf.spinner === undefined || ( isValidSpinnerConf( conf.spinner ) )) && // spinner is undefined or is valid
            ( conf.inBrowserQRdecoding === undefined || ( typeof conf.inBrowserQRdecoding === 'boolean' )) && // inBrowserQRdecoding is undefined or boolean
            ( conf.invisible === undefined || ( typeof conf.invisible === 'boolean' )) && // invisible is undefined or boolean
            ( conf.redirect === undefined || ( typeof conf.redirect === 'boolean' )) && // redirect is undefined or boolean
            ( conf.bw === undefined || ( typeof conf.bw === 'boolean' )) && // bw is undefined or boolean
            ( conf.apiKey === undefined || ( typeof conf.apiKey === 'string' )) &&
            ( conf.serviceUrl === undefined || ( typeof conf.serviceUrl === 'string' )) &&
            ( conf.successCb === undefined || ( typeof conf.successCb === 'function' )) && // successCb is undefined or a function
            ( conf.errorCb === undefined || ( typeof conf.errorCb === 'function' )) && // errorCb is undefined or a function
            ( conf.startCb === undefined || ( typeof conf.startCb === 'function' )) && // startCb is undefined or a function
            ( conf.scanType === undefined || ( innerconf.acceptedInputTypes.indexOf( conf.scanType ) >= 0 )) // scanType is undefined or one of accepted
            )
        );
    };

    // Set-up the configuration just for the
    // current identification process
    // by overriding the persistent configuration values
    var createOneOffConfig = function( conf ){
        var newconf = ( conf === undefined ? persistentConfig :       // If no explicit one-off config, use persistent
            {
                spinner:   conf.spinner || persistentConfig.spinner,
                inBrowserQRdecoding: (conf.inBrowserQRdecoding !== undefined ? conf.inBrowserQRdecoding : persistentConfig.inBrowserQRdecoding ),
                invisible: (conf.invisible !== undefined ? conf.invisible : persistentConfig.invisible ),
                redirect:  (conf.redirect !== undefined ? conf.redirect : persistentConfig.redirect ),
                bw:        (conf.bw !== undefined ? conf.bw : persistentConfig.bw ),
                scanType:  conf.scanType || persistentConfig.scanType,
                errorCb:   conf.errorCb || persistentConfig.errorCb,
                startCb:   conf.startCb || persistentConfig.startCb,
                successCb: conf.successCb || persistentConfig.successCb,
                apiKey:    conf.apiKey || persistentConfig.apiKey,
                serviceUrl:    conf.serviceUrl || persistentConfig.serviceUrl
            });
        return newconf;
    };

    var process = function(conf) {
        var stype = conf.scanType;
        var fullServiceUrl = conf.serviceUrl + '/scan/recognitions';
        var decoderUrl = fullServiceUrl + '?1dbarcode&qrcode';
        var recognizerUrl = fullServiceUrl + '?objpic';

        // Show spinner if auto is set to true
        if ( conf.spinner.auto ) {
            spinner.spin( Zepto('body')[0] );
        }
        // Call the start callback
        conf.startCb( conf, spinner );
        if ( stype === 'QRCODE' ) {
            conf.inBrowserQRdecoding ? processQRcode( conf ) : processOnServer( decoderUrl, conf );  // jshint ignore:line
        } else if ( stype === '1DBARCODE' ) {
            processOnServer( decoderUrl, conf);
        } else if ( stype === 'OBJPICT' ) {
            processOnServer( recognizerUrl, conf);
        }
    };

    // As DOMNodeInserted is not reliable on all our target platforms
    // we need to poll the DOM to see if our recently added mediaCapture
    // has been effectively added, before we try to click on it
    var clickMediaCapture = function(elId){
        if ( Zepto('#' + elId).length ){
            Zepto( '#' + elId + ' input' ).click();
        } else {
            window.setTimeout( clickMediaCapture.bind( this, elId ), 100 );
        }
    };

    // add a new media capture element to the DOM
    var addMediaCapture = function(conf) {
        innerconf.captureid = 'scanthng' + Date.now();

        var mediaCaptureHtml = '<form class="scanThng_form" id="' + innerconf.captureid + '"><input type="file" name="upload" ';
        mediaCaptureHtml += 'accept="image/*" capture="camera" ';
        mediaCaptureHtml += (conf.invisible ? 'style="visibility: hidden"' : '');
        mediaCaptureHtml += '></form>';
        var el;

        // Remove any previously created media capture forms before creating a new one
        Zepto('.scanThng_form').remove();
        // Append Media Capture form with the right URL
        Zepto('body').append( mediaCaptureHtml );
        // The element we just created
        el = Zepto('#' + innerconf.captureid + ' input');

        // Add listener for changes in our Media Capture element
        el.on('change', function() {
            file = this.files[0];
            process(conf);
        });

        clickMediaCapture( innerconf.captureid );
    };

    // In-browser QR decoding:
    // *qrcode* only accepts one callback that is called
    // once the decoding ends (either successfully or unsuccessfully)
    // The results of this decoding is returned in a string which is either:
    // a) String containing a valid URL
    // b) The string "error decoding QR Code"

    var processQRcode = function( conf ) {
        // Error callback is the user's error cb
        var finalErrorCb = conf.errorCb;

        // Ensure Thng information is obtained from the engine
        // if decoding succeeds
        var finalSuccessCb = function(data){
                qrGetThngData( data, conf.successCb, finalErrorCb );
            };

        // Inject spinner.stop to callbacks if config.spinner.auto is true
        if ( conf.spinner && conf.spinner.auto ) {
            finalErrorCb = function(data){
                spinner.stop();
                finalErrorCb(data);
            };

            finalSuccessCb = function(data){
                spinner.stop();
                finalSuccessCb(data);
            };
        }

        if ( conf.redirect ){
            qrcode.callback = function( data ){
                return redirector( data );
            };
        } else {
            qrcode.callback = function( data ){
                return ( data !== 'error decoding QR Code' ? finalSuccessCb( data ) : finalErrorCb( data ) );
            };
        }
        tools.downsizeImage(qrcode.decode, conf.bw);
    };

    // Send image to Scanthng Service for recognition
    var processOnServer = function( processorUrl, conf) {
        var finalSuccessCb = conf.successCb, finalErrorCb = conf.errorCb;

        if ( conf.spinner && conf.spinner.auto ) {
            finalSuccessCb = function(data){
                spinner.stop();
                conf.successCb( data );
            };

            finalErrorCb = function(data){
                spinner.stop();
                conf.errorCb( data );
            };
        }

        var redirectCb = function( data ){
            if ( data && data.defaultRedirectUrl ){
                redirector( data.defaultRedirectUrl );
            } else {
                finalErrorCb( data );
            }
        };

        var successCb = conf.redirect ? redirectCb : finalSuccessCb ;

        tools.downsizeImage(function(dataUrl) {
            ajaxUploadImage(dataUrl, processorUrl, successCb, finalErrorCb, conf.apiKey );
        }, conf.bw);
    };

    var ajaxUploadImage = function(dataUrl, endpointUrl, successCb, errorCb, apiKey ) {
        var data = { image : dataUrl };
        var req = Zepto.ajax({
            type : 'POST',
            url : endpointUrl,
            timeout : 10000,
            dataType : 'json',
            contentType : 'application/json; charset=utf-8',
            crossDomain : true,
            processData : false,
            data : JSON.stringify(data),
            headers : { Authorization : apiKey }
        });
        req.done( successCb );
        req.fail( errorCb );
    };

    // Get data from an entity by using its associated URL
    var qrGetThngData = function( url, successCb, errorCb ) {
        var req = Zepto.ajax({
            type: 'GET',
            url: url,
            timeout: 10000,
            dataType : 'json',
            contentType : 'application/json; charset=utf-8'
        });
        req.done( successCb );
        req.fail( errorCb );
    };

    var redirector = function( url ) { window.location.href = url; };

    var tools = {
        downsizeImage: function(callback, convertToBW) {
            var that = this;
            // read file as dataURL
            var img = document.createElement('img');
            var reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
            img.onload = function(){
                var img2 = that.downsizeDataUrl.bind(this, convertToBW)();
                callback( img2 );
            };
        },

        downsizeDataUrl: function(convertToBW) {
            var canvas = document.createElement('canvas');

            // render image on canvas using Megapixel library (Fixes problems for
            // iOS Safari) https://github.com/stomita/ios-imagefile-megapixel
            var mpImg = new MegaPixImage(this);
            mpImg.render(canvas, { maxWidth: 480, maxHeight: 480 });
            if (convertToBW){
                tools.convertToBlackWhite(canvas);
            }
            return canvas.toDataURL('image/jpeg', 0.6);
        },

        convertToBlackWhite: function(canvas) {
            var ctx = canvas.getContext('2d');
            var imgd = ctx.getImageData(0, 0, canvas.width, canvas.height);
            var pix = imgd.data;
            for (var i = 0, n = pix.length; i < n; i += 4) {
                var grayscale = pix[i] * 0.3 + pix[i + 1] * 0.59 + pix[i + 2] * 0.11;
                pix[i] = grayscale; // red
                pix[i + 1] = grayscale; // green
                pix[i + 2] = grayscale; // blue
                // alpha
            }
            ctx.putImageData(imgd, 0, 0);
        }
    };

    var Innerscanthng = function( config ) {
        Zepto(document).ready( function(){
            initializeSpinner();
        });
        setPersistentConfig( config );
    };

    Innerscanthng.prototype.canvasSupport = isCanvasSupported();
    Innerscanthng.prototype.captureSupport = isCaptureSupported();
    Innerscanthng.prototype.isScanThngSupported = isScanThngSupported();

    // This function allows to specify a global default
    // configuration
    Innerscanthng.prototype.config = function( config ){
        setPersistentConfig( config );
        return persistentConfig;
    };

    // This functions starts the whole identification process
    // It accepts a config object as a parameter
    // which overrides any default configuration
    Innerscanthng.prototype.identify = function( config ){
        return isScanThngSupported() ? id( config ) : 'Your browser doesn\'t support ScanThng';
    };

    window.ScanThng = Innerscanthng;
    return Innerscanthng;
})();
