(function(){
    'use strict';

    var app=angular.module("naturalForce");
    app.service("wechatService",["$http","domain","wechatappid","wechatObject","$rootScope","rootpath",
        function($http,domain,wechatappid,wechatObject,$rootScope,rootpath){
    app.service("wechatService",["$http","domain","wechatappid","wechatObject","$rootScope","$cookieStore",
        function($http,domain,wechatappid,wechatObject,$rootScope,$cookieStore){
        this.wechatConfig=function(){
            $http({
                url:domain+"api/jsapi?url="+encodeURIComponent(window.location.href),
                method:"GET"
            }).then(function(response){
                wx.config({
                    debug: false,
                    appId: response.data.appid,
                    timestamp: response.data.timestamp,
                    nonceStr: response.data.nonceStr,
                    signature: response.data.signature,
                    jsApiList: [
                        'checkJsApi',
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'translateVoice',
                        'startRecord',
                        'stopRecord',
                        'onRecordEnd',
                        'playVoice',
                        'pauseVoice',
                        'stopVoice',
                        'uploadVoice',
                        'downloadVoice',
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'downloadImage',
                        'getNetworkType',
                        'openLocation',
                        'getLocation',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'closeWindow',
                        'scanQRCode',
                        'chooseWXPay',
                        'openProductSpecificView',
                        'addCard',
                        'chooseCard',
                        'openCard'
                    ]
                });

                wx.ready(function (){
                    console.log("wechat jssdk on ready.")
                    // wx.hideMenuItems({
                    //     menuList: ["menuItem:share:appMessage",
                    //         "menuItem:share:timeline",
                    //         "menuItem:share:qq",
                    //         "menuItem:share:weiboApp",
                    //         "menuItem:favorite",
                    //         "menuItem:share:facebook",
                    //         "menuItem:share:QZone"] // 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
                    // });
                    refreshShare({
                        title: "自然力艺术品展", // 分享标题
                        link: rootpath+"#!/artworkList",
                        imgUrl: wechatObject.icon, // 分享图标
                        desc: wechatObject.nickname+"邀请您来一起看看"
                    },{
                        shareType:"default",
                        shareContentKey:"0",
                        user:{
                            id:wechatObject.id
                        },
                        shareTime:new Date(),
                        shareLink:rootpath+"#!/artworkList"
                    })
                    $rootScope.$broadcast("wxready",wx);

                });
            },function(){

            });
        }
        this.refreshShare=refreshShare;
        function refreshShare(shareObject,logobject){
            wx.onMenuShareTimeline({
                title: shareObject.title, // 分享标题
                link: shareObject.link,
                imgUrl: shareObject.imgUrl, // 分享图标
                success: function () {
                    logShare(logobject);
                }
            });
            wx.onMenuShareAppMessage({
                title: shareObject.title, // 分享标题
                link: shareObject.link,
                desc: shareObject.desc,
                imgUrl: shareObject.imgUrl, // 分享图标
                success: function () {
                    logShare(logobject);
                }
            });
        }

        this.share=function(shareObject){

        }

        this.loadWechatUser=function(code){
            $http({
                url:domain+"api/getuserinfo?code="+code,
                method:"GET"
            }).then(function(response){
                wechatObject.id=response.data.id;
                wechatObject.openid=response.data.openId;
                wechatObject.nickname=response.data.nickName;
                wechatObject.icon=response.data.icon;
                wechatObject.area=response.data.area;
                wechatObject.name=response.data.name;
                wechatObject.phone=response.data.phone;
                wechatObject.address=response.data.address;
                wechatObject.language=response.data.language;
                $rootScope.isloading=false;
                $rootScope.openid=wechatObject.openid;
                $cookieStore.put("openid",wechatObject.openid);
                console.log($rootScope.openid);
                console.log($cookieStore.get("openid"));
            });
        }

        this.testUser=function(){
            wechatObject.openid="one5hs5IJ14OWi-xNUvFetRIhA1g";
            wechatObject.nickname="临时用户";
            wechatObject.icon="image/logo.jpg";
            $rootScope.openid=wechatObject.openid;
            $rootScope.isloading=false;
        }

        this.getAuthUrl=function(url,state){
            if(url.indexOf("http")>=0){

            }else{
                url=(rootpath+"#!"+url);
            }
            var link="https://open.weixin.qq.com/connect/oauth2/authorize?appid="+wechatappid+"&redirect_uri="+encodeURIComponent(url)+"&response_type=code&scope=snsapi_userinfo&state="+state+"#wechat_redirect";
            //return (rootpath+"#!"+url);
            return link;
        }
        this.logShare=logShare;
        function logShare(shareObject,callback){
            $http({
                url:domain+"api/share-logs",
                method:"POST",
                data:{
                    shareType:shareObject.shareType,
                    shareContentKey:shareObject.shareContentKey,
                    shareLink:shareObject.shareLink,
                    shareTime:shareObject.shareTime,
                    user:shareObject.user
                }
            }).then(function(response){
                if(callback){
                    callback(response,true);
                }
            },function(response){
                if(callback){
                    callback(response,false);
                }
            });
        }
    }]);
    app.factory("wechatObject",[function(){
        return {
            "id":"",
            "openid":"",
            "nickname":"",
            "icon":"",
            "area":"",
            "name":"",
            "phone":"",
            "address":"",
            "language":""

        }
    }]);
})();