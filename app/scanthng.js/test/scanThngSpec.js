/*global ScanThng, describe, it, expect, beforeEach*/
'use strict';
describe('ScanThng basics', function() {
    describe('The ScanThng global var', function() {
        it('exists', function() {
            expect(ScanThng).toBeDefined();
        });
        it('is a function', function() {
            expect(typeof ScanThng).toBe( 'function' );
        });
    });

    describe('scanThng public methods and properties', function() {
        var sc = new ScanThng();

        it('has an identify method', function() {
            expect(sc.identify).toBeDefined();
        });
        it('identify is a function', function() {
            expect(typeof sc.identify).toBe( 'function' );
        });
        it('has a config method', function() {
            expect( sc.config).toBeDefined();
        });
        it('config is a function', function() {
            expect(typeof sc.config).toBe( 'function' );
        });
        it('has an isScanThngSupported property', function() {
            expect( sc.isScanThngSupported ).toBeDefined();
        });
        it('isScanThngSupported is a boolean', function() {
            expect(typeof sc.isScanThngSupported ).toBe( 'boolean' );
        });
        it('isScanThngSupported is true (almost always)', function() {
            expect(sc.isScanThngSupported).toBe(true);
        });
    });
    describe('default configuration values', function() {
        var sc = new ScanThng();
        var conf = sc.config();
        it('spinner is an object', function() {
            expect(typeof conf.spinner).toBe('object');
        });
        it('invisible is true', function() {
            expect(conf.invisible).toBe(true);
        });
        it('bw is true', function() {
            expect(conf.bw).toBe(true);
        });
        it('redirect is true', function() {
            expect(conf.redirect).toBe(true);
        });
        it('scanType is QRCODE', function() {
            expect(conf.scanType).toBe('QRCODE');
        });
        it('errorCb is a function', function() {
            expect(typeof conf.errorCb).toBe( 'function' );
        });
        it('startCb is a function', function() {
            expect(typeof conf.startCb).toBe( 'function' );
        });
        it('successCb is a function', function() {
            expect(typeof conf.successCb).toBe( 'function' );
        });
        it('apiKey is a an empty string', function() {
            expect(conf.apiKey).toBe( '' );
        });
        it('serviceUrl to be ', function() {
            expect(conf.serviceUrl).toBe( 'https://api.evrythng.com' );
        });
    });
    describe('setting configuration values', function() {
        var sc = new ScanThng();
        var confObject = {
            spinner: {auto: false},
            scanType: '1DBARCODE',
            redirect: false,
            invisible: false,
            inBrowserQRdecoding: true,
            bw: false,
            apiKey: 'lalala',
            serviceUrl: 'lalala',
            errorCb: function(){ console.log('error'); },
            successCb: function(){ console.log('success'); },
            startCb: function(){ console.log('start'); }
        };
        it('spinner is {auto: true} when set via the config method', function() {
            var conf = sc.config({spinner: {auto: true}});
            expect(conf.spinner).toEqual( {auto:true} );
        });
        it('bw is false when set to false', function() {
            var conf = sc.config({bw: false});
            expect(conf.bw).toBe(false);
        });
        it('bw is unchanged when set to a string', function() {
            var conf = sc.config({bw: 'aaaaaa'});
            expect(conf.bw).toBe(false);
        });
        it('inBrowserQRdecoding is false when set to false', function() {
            var conf = sc.config({inBrowserQRdecoding: false});
            expect(conf.inBrowserQRdecoding).toBe(false);
        });
        it('inBrowserQRdecoding is not changed when set to string', function() {
            var conf = sc.config({inBrowserQRdecoding: 'something'});
            expect(conf.inBrowserQRdecoding).toBe(false);
        });
        it('invisible is false when set to false', function() {
            var conf = sc.config({invisible: false});
            expect(conf.invisible).toBe(false);
        });
        it('invisible is not changed when set to string', function() {
            var conf = sc.config({invisible: 'something'});
            expect(conf.invisible).toBe(false);
        });
        it('redirect is false when set to false', function() {
            var conf = sc.config({redirect: false});
            expect(conf.redirect).toBe(false);
        });
        it('serviceUrl is unchanged when set to a boolean', function() {
            var conf = sc.config({serviceUrl: true});
            expect(typeof conf.serviceUrl).toBe('string');
        });
        it('serviceUrl is changed when set to "lalala"', function() {
            var conf = sc.config({serviceUrl: 'lalala'});
            expect(conf.serviceUrl).toBe('lalala');
        });
        it('redirect is unchanged when set to a string', function() {
            var conf = sc.config({redirect: 'string'});
            expect(conf.redirect).toBe(false);
        });
        it('scanType is 1DBARCODE when set to 1DBARCODE', function() {
            var conf = sc.config({scanType: '1DBARCODE'});
            expect(conf.scanType).toBe('1DBARCODE');
        });
        it('scanType is unchanged when set to INVALID_VALUE', function() {
            sc.config({scanType: 'OBJPICT'});
            var conf = sc.config({scanType: 'INVALID_VALUE'});
            expect(conf.scanType).toBe('OBJPICT');
        });
        it('apiKey is lalala when set to lalala', function() {
            var conf = sc.config({apiKey: 'lalala'});
            expect(conf.apiKey).toBe('lalala');
        });
        it('apiKey is unchanged when set to empty string', function() {
            var conf = sc.config({apiKey: ''});
            expect(conf.apiKey).toBe('lalala');
        });
        it('accepts a valid a configuration object', function() {
            var conf = sc.config(confObject);
            expect(conf).toEqual(confObject);
        });
        it('rejects an invalid a configuration object', function() {
            confObject.apiKey = '';
            var conf = sc.config(confObject);
            expect(conf).not.toEqual(confObject);
        });
        it('rejects all other properties', function() {
            var conf = sc.config(confObject);
            expect(conf).not.toEqual(confObject);
        });
    });

    describe('ScanThng identify', function() {
        beforeEach( function(done){
            $('.scanThng_form').remove();
            done();
        });

        it('doesn\'t have any ScanThng forms when removed', function() {
            expect( $('.scanThng_form').length ).toBe(0);
        });

        it('creates an .scanThng_form element when identify is called with a proper config', function() {
            var sc = new ScanThng();
            sc.identify({apiKey: 'llll'});
            expect( $('.scanThng_form').length ).toBe(1);
        });

        it('Ensures that all previous media captures are removed when called', function() {
            var sc = new ScanThng();
            sc.identify({apiKey: 'llll'});
            sc.identify({apiKey: 'llll'});
            sc.identify({apiKey: 'llll'});
            sc.identify({apiKey: 'llll'});
            sc.identify({apiKey: 'llll'});
            sc.identify({apiKey: 'llll'});
            expect( $('.scanThng_form').length ).toBe(1);
        });
    });
});
