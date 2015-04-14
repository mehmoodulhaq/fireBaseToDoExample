

(function () {
    'use strict';
    angular.module('toDoApp',['firebase'])
        .factory('toDoService',[function(){
            return {
                getToDoList:function(){
                    var toDoList =[];

                    for(var i = 1 ;  i < 11 ; i++){
                        toDoList.push({title:i})
                    }
                    return toDoList;
                }
            }
        }])
        .controller('toDoCtrl',['$scope','toDoService',function($scope,toDoService){
            $scope.myList = toDoService.getToDoList();

        }])


})();
