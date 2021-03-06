'use strict';

/* Controllers */

angular.module('myApp.controllers', [])

    .controller('HomeCtrl', ['$scope', 'syncData', 'Products', function($scope, syncData, Products) {
        var retryInterval = 10; //seconds
        console.log('retry interval : ' + retryInterval);
        // return all Arjo Products from API
        Products.all().then(function (result) {
            $scope.products = result.data;
            console.log($scope.products[0]);
        });

        $scope.getProducts = function() {
            Products.all().then(function (result) {
                $scope.products = result.data;
            });
        }
        //setInterval($scope.getProducts, 1000);

    }])

   .controller('BedCtrl', ['$scope', 'syncData', 'Thngs', function($scope, syncData, Thngs) {
        console.log('in bed controller');
        var retryInterval = 10; //seconds
        console.log('retry interval : ' + retryInterval);
        // return all Arjo Products from API
        Thngs.all().then(function (result) {
            $scope.thngs = result.data;
            console.log($scope.thngs[0]);
        });
        Thngs.get('UdHrGg9APBpRCK66rKdb7Ckh').then(function (result) {
            $scope.thng = result.data;
            console.log($scope.thng);
        });
        Thngs.getProperties('UdHrGg9APBpRCK66rKdb7Ckh').then(function (result) {
            $scope.properties = result.data;
            console.log($scope.properties);
        });

        $scope.getThngs = function() {
            console.log('refresh thngs');
            Thngs.get('UdHrGg9APBpRCK66rKdb7Ckh').then(function (result) {
                $scope.thng = result.data;
                console.log($scope.thng);
            });
            Thngs.getProperties('UdHrGg9APBpRCK66rKdb7Ckh').then(function (result) {
                $scope.properties = result.data;
                console.log($scope.properties);
            });
        }
        //setInterval($scope.getThngs, 1000);

   }])


   .controller('LoginCtrl', ['$scope', 'loginService', '$location', function($scope, loginService, $location) {
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.login = function(cb) {
         $scope.err = null;
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else {
            loginService.login($scope.email, $scope.pass, function(err, user) {
               $scope.err = err? err + '' : null;
               if( !err ) {
                  cb && cb(user);
               }
            });
         }
      };

      $scope.createAccount = function() {
         $scope.err = null;
         if( assertValidLoginAttempt() ) {
            loginService.createAccount($scope.email, $scope.pass, function(err, user) {
               if( err ) {
                  $scope.err = err? err + '' : null;
               }
               else {
                  // must be logged in before I can write to my profile
                  $scope.login(function() {
                     loginService.createProfile(user.uid, user.email);
                     $location.path('/account');
                  });
               }
            });
         }
      };

      function assertValidLoginAttempt() {
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.pass !== $scope.confirm ) {
            $scope.err = 'Passwords do not match';
         }
         return !$scope.err;
      }
   }])

   .controller('AccountCtrl', ['$scope', 'loginService', 'syncData', '$location', function($scope, loginService, syncData, $location) {
      syncData(['users', $scope.auth.user.uid]).$bind($scope, 'user');

      $scope.logout = function() {
         loginService.logout();
      };

      $scope.oldpass = null;
      $scope.newpass = null;
      $scope.confirm = null;

      $scope.reset = function() {
         $scope.err = null;
         $scope.msg = null;
      };

      $scope.updatePassword = function() {
         $scope.reset();
         loginService.changePassword(buildPwdParms());
      };

      function buildPwdParms() {
         return {
            email: $scope.auth.user.email,
            oldpass: $scope.oldpass,
            newpass: $scope.newpass,
            confirm: $scope.confirm,
            callback: function(err) {
               if( err ) {
                  $scope.err = err;
               }
               else {
                  $scope.oldpass = null;
                  $scope.newpass = null;
                  $scope.confirm = null;
                  $scope.msg = 'Password updated!';
               }
            }
         }
      }

   }]);