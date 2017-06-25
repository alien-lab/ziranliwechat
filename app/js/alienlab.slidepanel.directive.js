/**
 * Created by 橘 on 2017/6/24.
 */
(function(){
    'use strict';
    var app=angular.module("naturalForce");
    app.directive("slidePanel",["$window",function($window){
        return {
            restrict:"EA",
            templateUrl:"views/slidePanel.html",
            scope:{
                sliderate:"@",
                direction:"@",
                contentId:"@"
            },
            link:function(scope, element, attrs){
                if(!scope.direction){
                    scope.direction="right";
                }
                var fullscreen=element.find(".fullscreen");
                var width=$window.screen.width;
                var height=$window.screen.height;
                fullscreen.css("width",width+"px");
                fullscreen.css("height",height+"px");

                var slidepanel=element.find(".slidepanel");

                slidepanel.css("width",width*scope.sliderate+"px");

                if(scope.direction=="right"){

                }else{
                    slidepanel.css("right",width-(width*scope.sliderate));
                }

                scope.showpanel=function(){
                    scope.show=true;
                }
                scope.hidepanel=function(){
                    scope.show=false;
                }
                scope.panelclick=function($event){
                    $event.stopPropagation();
                }

                if(scope.contentId!=null){
                    var content=$("#"+scope.contentId);
                    slidepanel.append(content);
                }

            }
        };
    }]);
})();