(function() {
    'use strict';

    angular
        .module('naturalForce')
        .factory('AuthServerProvider', AuthServerProvider);

    AuthServerProvider.$inject = ['$http', '$localStorage', '$sessionStorage', '$q','tokenUrl'];

    function AuthServerProvider ($http, $localStorage, $sessionStorage, $q,tokenUrl) {
        var service = {
            getToken: getToken,
            login: login,
            loginWithToken: loginWithToken,
            storeAuthenticationToken: storeAuthenticationToken,
            logout: logout
        };

        return service;

        function getToken () {
            return $localStorage.authenticationToken || $sessionStorage.authenticationToken;
        }

        function login (credentials,callback) {
            var data = {
                username: credentials.username,
                password: credentials.password,
                rememberMe: credentials.rememberMe
            };
            return $http({
                url:tokenUrl,
                method:"POST",
                data:data
            }).then(function(result){
                var token=result.data.id_token;
                if (angular.isDefined(token) && token.slice(0, 7) === 'Bearer ') {
                    var jwt = token.slice(7, token.length);
                    service.storeAuthenticationToken(jwt, credentials.rememberMe);
                    return jwt;
                }else{
                    service.storeAuthenticationToken(token, credentials.rememberMe);
                }
                if(callback){
                    callback(token);
                }
            });
        }

        function loginWithToken(jwt, rememberMe) {
            var deferred = $q.defer();

            if (angular.isDefined(jwt)) {
                this.storeAuthenticationToken(jwt, rememberMe);
                deferred.resolve(jwt);
            } else {
                deferred.reject();
            }

            return deferred.promise;
        }

        function storeAuthenticationToken(jwt, rememberMe) {
            if(rememberMe){
                $localStorage.authenticationToken = jwt;
            } else {
                $sessionStorage.authenticationToken = jwt;
            }
        }

        function logout () {
            delete $localStorage.authenticationToken;
            delete $sessionStorage.authenticationToken;
        }
    }
})();
