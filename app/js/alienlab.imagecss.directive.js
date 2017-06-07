(function() {
    'use strict';
    angular
        .module('naturalForce')
        .directive('alienImage', function(){
            return {
                restrict: 'A',
                scope: {
                    image:"@"
                },
                link: function(scope, element, attrs){
                    console.log($(element));
                    element.css("height",element.width()/2+"px");
                    element.css("background-image","url('"+scope.image+"')");
                    element.css("overflow","hidden");
                }
            }
        });
})();
