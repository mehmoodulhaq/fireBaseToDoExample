//https://mfirstapp.firebaseio.com/

(function () {
    'use strict';
    angular.module('toDoApp',['firebase'])
        .factory('toDoService',['$timeout','$q','$firebaseArray',function($timeout,$q, $firebaseArray){
            var mainRef = new Firebase('https://mfirstapp.firebaseio.com/');
            var toDoListRef = mainRef.child('toDo');
            var $toDoListArray;

            return {
                getToDoList:function(){
                    return $toDoListArray = $firebaseArray( toDoListRef );
                },
                addItem: function ( title ) {
                   return $toDoListArray.$add( title);
                },
                removeItem: function (item) {
                    return $toDoListArray.$remove(item)
                },
                editItem:function(item){
                    return $toDoListArray.$save(item)

                }

            }
        }])
        .controller('toDoCtrl',['$scope','toDoService',function($scope,toDoService){
            $scope.myList = toDoService.getToDoList();
            $scope.addItem = function () {
                toDoService.addItem( $scope.title )
                    .then(function(ref) {
                        var id = ref.key();
                        console.log("added record with id " + id);
                        //list.$indexFor(id); // returns location in the array
                        $scope.title='';
                    })

            };
            $scope.removeItem = function (item,index) {
                toDoService.removeItem(item)
                    .then(function(res){
                        //$scope.myList.splice(index,1);
                        console.log(res)
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            };
            $scope.editItem = function(item,index,pScope){
                toDoService.editItem(item)
                    .then(function(res){
                        //$scope.myList[index] = res;
                        pScope.editState = !pScope.editState;
                    })
                    .catch(function (err) {
                        console.log(err)
                    })

            };
            $scope.cancelEditItem = function( item, local ){
                item.$value = local.cached;
                local.editState = !local.editState;
            }

        }])


})();
