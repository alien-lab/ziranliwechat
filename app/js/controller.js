/**
 * Created by 鸠小浅 on 2017/6/2.
 */
(function () {
    'use strict';
    var app = angular.module("naturalForce");
    app.controller("artworkListController", ["$scope","$rootScope","artworkService","toaster","$state",'$cookieStore',
        function ($scope,$rootScope,artworkService,toaster,$state,$cookieStore) {
        $scope.title="艺术品列表";
        $scope.artlist=[];
        $scope.$watch("$root.openid",function(newvalue,oldvalue){
            console.log("openid changed:",newvalue);
            console.log($rootScope.openid);
            console.log($cookieStore.get("openid"));
            if(newvalue&&newvalue!=""){
                toaster.pop("info","操作提示","获取到openid:"+newvalue);
            }
        },true);

        function loadArtList(){
            console.log("loaddata");
            $rootScope.isloading=true;
            artworkService.getArtList(function(data,flag){
                $rootScope.isloading=false;
                if(!flag){
                    toaster.pop('error', "错误提示", data.data.error);
                }
                $scope.artlist=data.data;
            });
        }
        loadArtList();
        $scope.loadArtList=loadArtList;
        $scope.artClick=function(art){
            $state.go("artworkDesc",{art:art});
        }
    }]);

    app.controller("artworkDescController",["$scope","$state","$stateParams","toaster","rootpath","artworkService","$location","wechatObject",
        function($scope,$state,$stateParams,toaster,rootpath,artworkService,$location,wechatObject){
            $scope.rootpath=rootpath;
            $scope.art=$stateParams.art;
            if($scope.art==null){
                var artId=$location.search().art||$location.search().state;
                artworkService.loadArtwork(artId,function(result,flag){
                    if(!flag){
                        toaster.pop('error', "错误提示", "获取艺术品数据出错。");
                    }
                    console.log("loadArtwork",result);
                    $scope.art=result.data;
                    loadImages($scope.art.id);
                });

            }else{
                loadImages($scope.art.id);
            }
            function loadImages(artId){
                artworkService.loadArtworkImages(artId,function(result,flag){
                    if(!flag){
                        return;
                    }
                    $scope.images=result.data;
                    console.log($scope.images);
                });
            }
            $scope.goList=function(){
                $state.go("artworkList");
            }

            $scope.user=wechatObject;
            // $scope.$watch("user",function(v1,v2){
            //     console.log("user",v1);
            //     $scope.user=wechatObject;
            // },true);

            $scope.buy=function(){
                if(!$scope.user.phone||$scope.user.phone==""){
                    $scope.userinfo=true;
                }else{
                    $scope.buyArt();
                }
            }
            $scope.buyArt=function(){
                $scope.userinfo=false;
                var data={
                    openid:wechatObject.openid,
                    artId:$scope.art.id,
                    address:$scope.user.address,
                    contact:$scope.user.name,
                    phone:$scope.user.phone
                }
                artworkService.buyArtwork(data,function(result,flag){
                    if(!flag){
                        toaster.pop('error', "错误提示", result);
                        return ;
                    }
                    toaster.pop('info', "购买成功", "感谢您的购买");
                })
            }

            $scope.hideuserinfo=function(){
                $scope.userinfo=false;
            }
    }]);
    app.controller("wechatUserController",["$scope","wechatUserService","$cookieStore",function ($scope,wechatUserService,$cookieStore) {
        var openid = $cookieStore.get("openid");
        console.log(openid);
        wechatUserService.getMyArtOrder(openid,function (data,flag) {
            if (flag==true){
                $scope.artOrders=data;
            }
        });
        wechatUserService.getMyCourseOrder();
    }]);
})();