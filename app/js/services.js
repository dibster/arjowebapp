(function() {
   'use strict';

   /* Services */

   angular.module('myApp.services', ['myApp.service.login', 'myApp.service.firebase'])

      // put your services here!
      // .service('serviceName', ['dependency', function(dependency) {}]);
       .service('API', function(){
           return {url : 'http://api.evrythng.com/', key : 'a99WjkBUjWKUbl3FRfcpQTafD6amtH82QdxpO4fVPYIli2JTOZLTXWLgfxYsSMUxdy2iBfkfczM6i0Wn',
                   thngId : 'UdHrGg9APBpRCK66rKdb7Ckh'};
       })

       .service('CustomFields', function(){
           return {
               reformat: function (evrythngCustomFields) {
                   var angularFieldCollection = [];
                   if (!(_.isEmpty(evrythngCustomFields))) {
                       for (var key in evrythngCustomFields) {
                           if (evrythngCustomFields.hasOwnProperty(key)) {
                               var customField = {};
                               customField.name = key;
                               customField.value = evrythngCustomFields[key];
                               angularFieldCollection.push(customField);
                           }
                       }
                   }
                   return angularFieldCollection;
               }
           }
       })

// get products
        .factory('Products',
        function Products($http, API){

            return {
                all: function() {
                    return  $http({
                        url: API.url + 'products' + '?access_token=' + API.key,
                        method: "GET",
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    })
                        .success(function (products) {
                            return products;
                        })
                        .error(function () {
                            return 'Error';
                        });
                },
                get : function(productId) {
                    return  $http({
                        url: API.url + 'products/' + productId + '?access_token=' + API.key,
                        method: "GET",
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    })
                        .success(function (product) {
                            return product;
                        })
                        .error(function () {
                            return 'Error';
                        });
                }
            }
        })

// get thngs
        .factory('Thngs',
        function Thngs($http, API){

            return {
                all: function() {
                    return  $http({
                        url: API.url + 'thngs' + '?access_token=' + API.key,
                        method: "GET",
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    })
                        .success(function (thngs) {
                            return thngs;
                        })
                        .error(function () {
                            return 'Error';
                        });
                },
                get : function(thngId) {
                    return  $http({
                        url: API.url + 'thngs/' + thngId + '?access_token=' + API.key,
                        method: "GET",
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    })
                        .success(function (thng) {
                            return thng;
                        })
                        .error(function () {
                            return 'Error';
                        });
                },
                getProperties : function(thngId) {
                    return  $http({
                        url: API.url + 'thngs/' + thngId + '/properties/rail' + '?access_token=' + API.key,
                        method: "GET",
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    })
                        .success(function (properties) {
                            return properties;
                        })
                        .error(function () {
                            return 'Error';
                        });
                }
            }
        })

// get Actions


        .factory('Actions',
        function Actions($http, API){

            return {
                allOfType: function(type) {
                    return  $http({
                        url: API.url + 'actions/' + type +  '?access_token=' + API.key,
                        method: "GET",
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    })
                        .success(function (actions) {
                            return actions;
                        })
                        .error(function () {
                            return 'Error';
                        });
                },
                get : function(actionId) {
                    return  $http({
                        url: API.url + 'actions/' +actionId + '?access_token=' + API.key,
                        method: "GET",
                        headers: {'Content-Type': 'application/json; charset=utf-8'}
                    })
                        .success(function (action) {
                            return action;
                        })
                        .error(function () {
                            return 'Error';
                        });
                }
            }
        })

})();


