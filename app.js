//https://mfirstapp.firebaseio.com/

(function () {
    'use strict';
    angular.module('toDoApp',['firebase'])
        .factory('toDoService',['$timeout','$q',function($timeout,$q){
            var mainRef = new Firebase('https://mfirstapp.firebaseio.com/');
            var toDoListRef = mainRef.child('toDo');

            return {
                getToDoList:function(){
                    var toDoList =[];
                    toDoListRef.on('child_added', function(dataSnapshot) {
                        var items = dataSnapshot.val();
                        var itemsKey = dataSnapshot.key();

                        $timeout(function(){
                            toDoList.push({
                                $id:itemsKey,
                                title: items
                            });
                        });
                    });

                    return toDoList;
                },
                addItem: function ( title ) {
                    toDoListRef.push( title );
                },
                removeItem: function (item) {
                    var promise = $q.defer();

                    toDoListRef.child(item.$id)
                        .remove(function (err) {
                            if(err) {
                                console.log(err);
                                promise.reject(err)
                            }
                            else{
                                console.log('Item removed!');
                                promise.resolve('Item removed')
                            }
                        });

                    return promise.promise;
                },
                editItem:function(item){
                    var promise = $q.defer();

                    var obj = {};
                    obj[item.$id]= item.title;

                   /* toDoListRef
                        .update(obj,function (err) {*/
                    toDoListRef.child(item.$id)
                        .set(item.title,function (err) {
                            if(err) {
                                console.log(err);
                                promise.reject(err)
                            }
                            else{
                                console.log('Item edited!');
                                promise.resolve('Item edited')
                            }
                        });
                    return promise.promise;

                }

            }
        }])
        .controller('toDoCtrl',['$scope','toDoService',function($scope,toDoService){
            $scope.myList = toDoService.getToDoList();
            $scope.addItem = function () {
                toDoService.addItem( $scope.title );
                $scope.title='';
            };
            $scope.removeItem = function (item,index) {
                toDoService.removeItem(item)
                    .then(function(res){
                        $scope.myList.splice(index,1);
                    })
                    .catch(function (err) {
                        console.log(err)
                    })
            };
            $scope.editItem = function(item,index,pScope){
                debugger;
                toDoService.editItem(item)
                    .then(function(res){
                        //$scope.myList[index] = res;
                        pScope.editState = !pScope.editState;
                    })
                    .catch(function (err) {
                        console.log(err)
                    })

            }

        }])


})();
