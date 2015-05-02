app.directive('notificationList', function($dataHandlerService, $mapService){

    return {
        replace:true,
        templateUrl: 'notificationList/notificationList.html',
        controller: function($scope){
            $scope.mapView = $mapService.getCurrentView();
            $mapService.onMapMove($scope, function(mapView){
                $scope.$apply(function(){
                    $scope.mapView = mapView;
                });
            });

            $scope.getSize= function(obj){
                return _.size(obj);
            };
            $scope.save = function(notification){
                $dataHandlerService.updateNotification(notification);
            };
            $scope.upVote = function(notification){
                $dataHandlerService.upVote(notification);
            };
            $scope.delete = function(notification){
                $dataHandlerService.deleteNotification(notification);
            };
            $dataHandlerService.getNotifications().then(function(res) {
                $scope.notifications = res;
            });
        }
    }
});
