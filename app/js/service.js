/**
 * Created by 鸠小浅 on 2017/6/2.
 */
(function () {
    'use strict';
    var app = angular.module("naturalForce");
    app.service("artworkService", ["$http","domain", function ($http,domain) {
        this.getArtList=function(callback){
            $http({
                url:domain+'/api/artworks',
                method:"GET"
            }).then(function(data){
                console.log(data);
                if(callback){
                    callback(data,true);
                }
            },function(error){
                console.log(error);
                if(callback){
                    callback(error,false);
                }
            });
        };
        this.loadArtwork=function(artId,callback){
            $http({
                url:domain+'/api/artworks/'+artId,
                method:"GET"
            }).then(function(data){
                console.log(data);
                if(callback){
                    callback(data,true);
                }
            },function(error){
                console.log(error);
                if(callback){
                    callback(error,false);
                }
            });
        };
        this.loadArtworkImages=function(artId,callback){
            $http({
                url:domain+'/api/artwork/images/'+artId,
                method:"GET"
            }).then(function(data){
                console.log(data);
                if(callback){
                    callback(data,true);
                }
            },function(error){
                console.log(error);
                if(callback){
                    callback(error,false);
                }
            });
        };
        this.buyArtwork=function(artwork,callback){
            $http({
                url:domain+'/api/artwork-orders/json',
                method:"POST",
                data:artwork
            }).then(function(data){
                console.log(data);
                if(callback){
                    callback(data,true);
                }
            },function(error){
                console.log(error);
                if(callback){
                    callback(error,false);
                }
            });
        };
    }]);
    app.service("wechatUserService",["$http","domain",function ($http,domain) {
        //获取个人艺术品订单
        this.getMyArtOrder=function (openid,callback) {
            $http({
                url:domain+'/api/artwork-orders/'+openid,
                method:'GET'
            }).then(function (data) {
                console.log(data);
                if (callback){
                    callback(data,true)
                }
            },function (error) {
                console.log(error);
                if (callback){
                    callback(error,false);
                }
            });
        };
        //获取个人课程订单
        this.getMyCourseOrder=function (openid,callback) {
            $http({
                url: domain+'/api/course-orders/'+openid,
                method: 'GET'
            }).then(function (data) {
                console.log(data);
                if (callback){
                    callback(data,true);
                }
            },function (error) {
                console.log(error);
                if (callback){
                    callback(error,false);
                }
            });
        }
    }]);
})();