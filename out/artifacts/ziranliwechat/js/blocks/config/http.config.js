(function() {
    'use strict';

    angular
        .module('naturalForce')
        .config(httpConfig);

    httpConfig.$inject = ['$urlRouterProvider', '$httpProvider', '$urlMatcherFactoryProvider'];

    function httpConfig($urlRouterProvider, $httpProvider, $urlMatcherFactoryProvider) {
        //Cache everything except rest api requests
        //httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/], true);

        $urlRouterProvider.otherwise('/');
        console.log($httpProvider);
        //$httpProvider.defaults.headers.put['Content-Type']='application/x-www-form-urlencoded; charset=UTF-8';
        //$httpProvider.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded; charset=UTF-8';


        // $httpProvider.defaults.transformRequest = [function(data) {
        //     /**
        //      * The workhorse; converts an object to x-www-form-urlencoded serialization.
        //      * @param {Object} obj
        //      * @return {String}
        //      */
        //     var param = function(obj) {
        //         var query = '';
        //         var name, value, fullSubName, subName, subValue, innerObj, i;
        //
        //         for (name in obj) {
        //             value = obj[name];
        //
        //             if (value instanceof Array) {
        //                 for (i = 0; i < value.length; ++i) {
        //                     subValue = value[i];
        //                     fullSubName = name + '[' + i + ']';
        //                     innerObj = {};
        //                     innerObj[fullSubName] = subValue;
        //                     query += param(innerObj) + '&';
        //                 }
        //             } else if (value instanceof Object) {
        //                 for (subName in value) {
        //                     subValue = value[subName];
        //                     fullSubName = name + '[' + subName + ']';
        //                     innerObj = {};
        //                     innerObj[fullSubName] = subValue;
        //                     query += param(innerObj) + '&';
        //                 }
        //             } else if (value !== undefined && value !== null) {
        //                 query += encodeURIComponent(name) + '='
        //                     + encodeURIComponent(value) + '&';
        //             }
        //         }
        //
        //         return query.length ? query.substr(0, query.length - 1) : query;
        //     };
        //
        //     return angular.isObject(data) && String(data) !== '[object File]'
        //         ? param(data)
        //         : data;
        // }];
        $httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('authInterceptor');
        // jhipster-needle-angularjs-add-interceptor JHipster will add new application http interceptor here

        $urlMatcherFactoryProvider.type('boolean', {
            name : 'boolean',
            decode: function(val) { return val === true || val === 'true'; },
            encode: function(val) { return val ? 1 : 0; },
            equals: function(a, b) { return this.is(a) && a === b; },
            is: function(val) { return [true,false,0,1].indexOf(val) >= 0; },
            pattern: /bool|true|0|1/
        });
    }
})();
