/**
 * Created by 橘 on 2017/5/7.
 */
(function () {
    'use strict';

// Declare app level module which depends on views, and components
    angular.module('naturalForce', [
        "ui.router", 'toaster', "ngAnimate", "ngCookies", "ngStorage", "ngResource"
    ]).config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', '$urlMatcherFactoryProvider',
        function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider, $urlMatcherFactoryProvider) {//路由定义
            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('artworkList', {
                    url: '/artworkList',
                    templateUrl: 'views/artworkList.html',
                    controller: "artworkListController"
                })
                .state('artworkDesc', {
                    params: {art: null},
                    url: '/artworkDesc',
                    templateUrl: 'views/artworkDesc.html',
                    controller: "artworkDescController"
                })
                .state('myInfo', {
                    url: '/myInfo',
                    templateUrl: 'views/myInfo.html',
                    controller: 'wechatUserController'
                })
                .state('courseList', {
                    url: '/courseList',
                    templateUrl: 'views/courseList.html',
                    controller: "courseListController"
                })
                .state('courseDesc', {
                    params: {course: null},
                    url: '/courseDesc',
                    templateUrl: 'views/courseDesc.html',
                    controller: "courseDescController"
                })
            ;
        }])
    ;
})();
(function () {
    'use strict';
    angular.module('naturalForce').run(['$rootScope', '$log', "wechatService", "$location", "runmodal", "AuthServerProvider",
        function ($rootScope, $log, wechatService, $location, runmodal, AuthServerProvider) {
            $rootScope.isloading = true;
            AuthServerProvider.login({
                username: "admin",
                password: "ziranli123",
                rememberMe: true
            }, function () {
                //启动
                wechatService.wechatConfig();
                if (runmodal == "dev") {//调试模式模拟身份
                    wechatService.testUser();
                } else {
                    var url = $location.$$absUrl;
                    var pos = url.indexOf("code=");
                    if (pos > 0) {
                        url = url.substring(pos + 5);
                        console.log(url);
                        var nextPos = url.indexOf("&");
                        var code = url.substring(0, nextPos);
                        console.log(code);
                        console.log("system start! find code param.invoke code user method");
                        wechatService.loadWechatUser(code);
                    } else {
                        //alert("没有从微信跳转");
                        var shareid = $location.search().shareid;
                        console.log()
                        var link = wechatService.getAuthUrl($location.$$absUrl, shareid);
                        window.location.href = link;
                    }
                }
            });

        }]);

})();
(function () {
    'use strict';
    // DO NOT EDIT THIS FILE, EDIT THE GULP TASK NGCONSTANT SETTINGS INSTEAD WHICH GENERATES THIS FILE
    angular
        .module('naturalForce')
        .constant('smsurl', "http://test.moistmedia.net/ziranliserver/api/sendsms")
        // .constant('tokenUrl', "http://localhost:8082/api/authenticate/client")
        // .constant('domain',"http://localhost:8082/")
        // .constant('rootpath',"http://localhost:8082/activitywechat/")
        // .constant('tokenUrl', "http://localhost:8080/ziranliserver/api/authenticate")
        // .constant('domain', "http://localhost:8080/ziranliserver/")
        // .constant('rootpath', "http://localhost:8080/ziranliwechat/")
        .constant('tokenUrl', "http://test.moistmedia.net/ziranliserver/api/authenticate")
        .constant('domain',"http://test.moistmedia.net/ziranliserver/")
        .constant('rootpath',"http://test.moistmedia.net/ziranliwechat/")
        .constant('homePage', "artworkList")
        .constant('wechatappid', "wx83f372e021582278")
        .constant('runmodal', "dev")
    ;
})();
