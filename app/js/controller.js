/**
 * Created by 鸠小浅 on 2017/6/2.
 */
(function () {
    'use strict';
    var app = angular.module("naturalForce");
    app.controller("artworkListController", ["$scope", "$rootScope", "artworkService", "toaster", "$state", "wechatObject", "wechatService", "rootpath",
        function ($scope, $rootScope, artworkService, toaster, $state, wechatObject, wechatService, rootpath) {
            $scope.title = "艺术品列表";
            $scope.artlist = [];
            // $scope.$watch("$root.openid",function(newvalue,oldvalue){
            //     console.log("openid changed:",newvalue);
            //     if(newvalue&&newvalue!=""){
            //         toaster.pop("info","操作提示","获取到openid:"+newvalue);
            //     }
            // },true);

            function loadArtList() {
                console.log("loaddata");
                $rootScope.isloading = true;
                artworkService.getArtList(function (data, flag) {
                    $rootScope.isloading = false;
                    if (!flag) {
                        toaster.pop('error', "错误提示", data.data.error);
                    }
                    $scope.artlist = data.data;
                });
            }

            loadArtList();
            $scope.loadArtList = loadArtList;
            $scope.artClick = function (art) {
                $state.go("artworkDesc", {art: art});
            }
            if (wechatObject.id != "") {
                wxshare();
            }
            function wxshare() {
                $scope.shareObject = {
                    shareType: "artworklist",
                    shareContentKey: "0",
                    user: {
                        id: wechatObject.id
                    },
                    shareTime: new Date(),
                    shareLink: rootpath + "#!/artworkList"
                }
                var img = "";
                if ($scope.artlist.length > 0) {
                    img = $scope.artlist[0].coverImage;
                }
                console.log("artlist wxshare", $scope.shareObject, wechatObject);
                wechatService.refreshShare({
                    title: "自然力艺术品展", // 分享标题
                    link: $scope.shareObject.shareLink,
                    imgUrl: img, // 分享图标
                    desc: wechatObject.nickname + "邀请您来一起看看"
                }, $scope.shareObject);
                return;
            }

            $scope.$on("wxready", function () {
                console.log("listen on wxready");
                wxshare();
            });
        }]);

    app.controller("artworkDescController", ["$scope", "$state", "$stateParams", "toaster", "rootpath",
        "artworkService", "$location", "wechatObject", "wechatService", "$rootScope", "wechatappid", "$timeout",
        function ($scope, $state, $stateParams, toaster, rootpath, artworkService, $location, wechatObject,
                  wechatService, $rootScope, wechatappid, $timeout) {
            $scope.rootpath = rootpath;
            $scope.art = $stateParams.art;

            if ($scope.art == null) {
                var artId = $location.search().art;

                if (!artId) {
                    var posstate = $location.$$absUrl.indexOf("state=");
                    if (posstate > 0) {
                        var stateurl = $location.$$absUrl.substring(posstate + 6);
                        var nextPos = stateurl.indexOf("#!");
                        var state = stateurl.substring(0, nextPos);
                        if (state.length > 0) {
                            artId = state;
                        }
                    }
                }
                if (artId) {
                    artworkService.loadArtwork(artId, function (result, flag) {
                        if (!flag) {
                            toaster.pop('error', "错误提示", "获取艺术品数据出错。");
                        }
                        console.log("loadArtwork", result);
                        $scope.art = result.data;
                        loadImages($scope.art.id);
                        //$scope.shareObject.shareContentKey=$scope.art.id;
                        //$scope.shareObject.shareLink=wechatService.getAuthUrl(rootpath+"#!/artworkDesc",$scope.art.id)
                        console.log("load artwork share");
                        wxshare();
                    });
                }
            } else {
                loadImages($scope.art.id);
                wxshare();
                console.log("direct artwork share");
            }


            function wxshare() {
                $scope.shareObject = {
                    shareType: "artwork",
                    shareContentKey: $scope.art.id,
                    user: {
                        id: wechatObject.id
                    },
                    shareTime: new Date(),
                    shareLink: rootpath + "#!/artworkDesc?shareid=" + $scope.art.id
                }
                console.log($scope.shareObject);
                //alert($scope.art.name);
                wechatService.refreshShare({
                    title: $scope.art.name, // 分享标题
                    link: $scope.shareObject.shareLink,
                    imgUrl: $scope.art.coverImage, // 分享图标
                    desc: $scope.art.memo
                }, $scope.shareObject);
                return;

            }

            $scope.$on("wxready", function () {
                console.log("listen on wxready");
                // wx.showMenuItems({
                //     menuList: ["menuItem:share:appMessage",
                //         "menuItem:share:timeline",
                //         "menuItem:favorite"]
                // });
                wxshare();
            });

            function loadImages(artId) {
                artworkService.loadArtworkImages(artId, function (result, flag) {
                    if (!flag) {
                        return;
                    }
                    $scope.images = result.data;
                    console.log($scope.images);
                });
            }

            $scope.goList = function () {
                $state.go("artworkList");
            }

            $scope.user = wechatObject;
            // $scope.$watch("user",function(v1,v2){
            //     console.log("user",v1);
            //     $scope.user=wechatObject;
            // },true);

            $scope.buy = function () {
                if (!$scope.user.phone || $scope.user.phone == "") {
                    $scope.userinfo = true;
                } else {
                    $scope.buyArt();
                }
            }
            $scope.buyArt = function () {
                $scope.userinfo = false;
                var data = {
                    openid: wechatObject.openid,
                    artId: $scope.art.id,
                    address: $scope.user.address,
                    contact: $scope.user.name,
                    phone: $scope.user.phone
                }
                artworkService.buyArtwork(data, function (result, flag) {
                    if (!flag) {
                        toaster.pop('error', "错误提示", result.data.errormsg);
                        return;
                    }
                    var orderinfo = result.orderInfo;
                    var artworkOrder = result.artworkOrder;
                    wx.chooseWXPay({
                        timestamp: orderinfo.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                        nonceStr: orderinfo.nonceStr, // 支付签名随机串，不长于 32 位
                        package: orderinfo.packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                        signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                        paySign: orderinfo.paySign, // 支付签名
                        success: function (res) {
                            // 支付成功后的回调函数
                            if (res.errMsg == "chooseWXPay:ok") {
                                artworkService.payfinish(wechatObject.openid, artworkOrder.id, function (payresult, error) {
                                    if (!iserr) {
                                        toaster.pop("warning", "操作提示", payresult.data.errormsg);
                                        return;
                                    }
                                    toaster.pop("info", "购买成功", "您已成功购得这件艺术品");
                                    // artworkService.loadArtwork($scope.art.id,function(result,flag){
                                    //     if(!flag){
                                    //         toaster.pop('error', "错误提示", "获取艺术品数据出错。");
                                    //     }
                                    //     console.log("loadArtwork",result);
                                    //     $scope.art=result.data;
                                    //     loadImages($scope.art.id);
                                    // })
                                });
                            }
                        }
                    });
                })
            }

            $scope.hideuserinfo = function () {
                $scope.userinfo = false;
            }
        }]);
    app.controller("wechatUserController", ["$scope", "wechatUserService", "$cookieStore", function ($scope, wechatUserService, $cookieStore) {
        var openid = $cookieStore.get("openid");
        console.log(openid);
        $scope.artOpen = false;
        $scope.artBtnText = "展开已购艺术品";
        $scope.courseOpen = false;
        $scope.courseBtnText = "展开已购课程";
        wechatUserService.getMyArtOrder(openid, function (data, flag) {
            if (flag == true) {
                $scope.artOrders = data;
            }
        });
        wechatUserService.getMyCourseOrder(openid, function (data, flag) {
            if (flag == true) {
                $scope.courseOrders = data;
            }
        });
        $scope.ifArtOpen = function () {
            $scope.artOpen = !$scope.artOpen;
            if ($scope.artOpen == true) {
                $scope.artBtnText = "隐藏已购艺术品";
            } else {
                $scope.artBtnText = "展开已购艺术品";
            }
        };
        $scope.ifCourseOpen = function () {
            $scope.courseOpen = !$scope.courseOpen;
            if ($scope.courseOpen == true) {
                $scope.courseBtnText = "隐藏已购课程";
            } else {
                $scope.courseBtnText = "展开已购课程";
            }
        }
    }]);

    app.controller("courseListController", ["$scope", "$rootScope", "courseService", "toaster", "$state", "wechatObject", "wechatService", "rootpath",
        function ($scope, $rootScope, courseService, toaster, $state, wechatObject, wechatService, rootpath) {
            $scope.title = "课程列表";
            $scope.courselist = [];
            // $scope.$watch("$root.openid",function(newvalue,oldvalue){
            //     console.log("openid changed:",newvalue);
            //     if(newvalue&&newvalue!=""){
            //         toaster.pop("info","操作提示","获取到openid:"+newvalue);
            //     }
            // },true);

            function loadCourseList() {
                console.log("loaddata");
                $rootScope.isloading = true;
                courseService.getCourseList(function (data, flag) {
                    $rootScope.isloading = false;
                    if (!flag) {
                        toaster.pop('error', "错误提示", data.data.error);
                    }
                    $scope.courselist = data.data;
                });
            }

            loadCourseList();
            $scope.loadCourseList = loadCourseList;
            $scope.courseClick = function (course) {
                $state.go("courseDesc", {course: course});
            }
            if (wechatObject.id != "") {
                wxshare();
            }
            function wxshare() {
                $scope.shareObject = {
                    shareType: "courselist",
                    shareContentKey: "0",
                    user: {
                        id: wechatObject.id
                    },
                    shareTime: new Date(),
                    shareLink: rootpath + "#!/courseList"
                }
                var img = "";
                if ($scope.courselist.length > 0) {
                    img = $scope.courselist[0].coverImage;
                }
                console.log("courseList wxshare", $scope.shareObject, wechatObject);
                wechatService.refreshShare({
                    title: "自然力课程", // 分享标题
                    link: $scope.shareObject.shareLink,
                    imgUrl: img, // 分享图标
                    desc: wechatObject.nickname + "邀请您来一起看看"
                }, $scope.shareObject);
                return;
            }

            $scope.$on("wxready", function () {
                console.log("listen on wxready");
                wxshare();
            });
        }]);

    app.controller("courseDescController", ["$scope", "$state", "$stateParams", "toaster", "rootpath",
        "courseService", "$location", "wechatObject", "wechatService", "$rootScope", "wechatappid", "$timeout",
        function ($scope, $state, $stateParams, toaster, rootpath, courseService, $location, wechatObject,
                  wechatService, $rootScope, wechatappid, $timeout) {
            $scope.rootpath = rootpath;
            $scope.course = $stateParams.course;
            $scope.order = {};
            $scope.onlive = {};
            if(wechatObject.openid!=""){
                console.log(wechatObject);
                courseService.loadCourseOrderByUser($scope.course.id, wechatObject.openid, function (data) {
                    if (data) {
                        $scope.order = data.courseOrder;
                        if (data.onlive) {
                            $scope.onlive = data.onlive;
                        }
                    }
                });
            }else{
                $scope.$watch("$root.openid", function (newvalue, oldvalue) {
                    if(!newvalue)return;
                    courseService.loadCourseOrderByUser($scope.course.id, newvalue, function (data) {
                        if (data) {
                            $scope.order = data.courseOrder;
                            if (data.onlive) {
                                $scope.onlive = data.onlive;
                            }
                        }
                    });
                }, true);
            }

            if ($scope.course == null) {
                var courseId = $location.search().course;
                if (!courseId) {
                    var posstate = $location.$$absUrl.indexOf("state=");
                    if (posstate > 0) {
                        var stateurl = $location.$$absUrl.substring(posstate + 6);
                        var nextPos = stateurl.indexOf("#!");
                        var state = stateurl.substring(0, nextPos);
                        if (state.length > 0) {
                            courseId = state;
                        }
                    }
                }
                if (courseId) {
                    courseService.loadCourse(courseId, function (result, flag) {
                        if (!flag) {
                            toaster.pop('error', "错误提示", "获取艺术品数据出错。");
                        }
                        $scope.course = result.data;
                        wxshare();
                    });
                }
            } else {
                wxshare();
            }

            $scope.goList = function () {
                $state.go("courseList");
            }

            function wxshare() {
                $scope.shareObject = {
                    shareType: "course",
                    shareContentKey: $scope.course.id,
                    user: {
                        id: wechatObject.id
                    },
                    shareTime: new Date(),
                    shareLink: rootpath + "#!/courseDesc?shareid=" + $scope.course.id
                }
                console.log($scope.shareObject);
                //alert($scope.art.name);
                wechatService.refreshShare({
                    title: $scope.course.name, // 分享标题
                    link: $scope.shareObject.shareLink,
                    imgUrl: $scope.course.coverImage, // 分享图标
                    desc: $scope.course.memo
                }, $scope.shareObject);
                return;

            }

            $scope.buy = function () {
                var data = {
                    openid: wechatObject.openid,
                    courseId: $scope.course.id
                }
                courseService.buyCourse(data, function (result, flag) {
                    if (!flag) {
                        toaster.pop('error', "错误提示", result.data.errormsg);
                        return;
                    }
                    var orderinfo = result.orderInfo;
                    var courseOrder = result.courseOrder;
                    if (result.onlive) {
                        $scope.onlive = result.onlive;
                    }
                    if (orderinfo) {
                        wx.chooseWXPay({
                            timestamp: orderinfo.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                            nonceStr: orderinfo.nonceStr, // 支付签名随机串，不长于 32 位
                            package: orderinfo.packageValue, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                            paySign: orderinfo.paySign, // 支付签名
                            success: function (res) {
                                // 支付成功后的回调函数
                                if (res.errMsg == "chooseWXPay:ok") {
                                    courseService.payfinish(wechatObject.openid, courseOrder.id, function (payresult, error) {
                                        if (!iserr) {
                                            toaster.pop("warning", "操作提示", payresult.data.errormsg);
                                            return;
                                        }
                                        toaster.pop("info", "报名成功", "您已成功报名该课程。");
                                        $scope.order = payresult.courseOrder;
                                        if (payresult.onlive) {
                                            $scope.onlive = payresult.onlive;
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        if (courseOrder.payStatus == '已支付') {
                            $scope.order = courseOrder;
                        }
                    }

                })
            }

            $scope.gotoonlive = function (onlive) {
                var url = "http://test.moistmedia.net/wechatcore/onlive/mobile/onliveroom.jsp";
                window.location.href = wechatService.getAuthUrl(url, onlive.bc_no);
            }
        }]);
})();