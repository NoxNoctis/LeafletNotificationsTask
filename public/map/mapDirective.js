app.directive('map', function ($mapService, $compile, $dataHandlerService) {
    return {
        replace: true,
        template: '<div class="map"></div>',
        controller: function ($scope) {


            $scope.submitNewNotification = function (lat, lng) {

                var notification = {
                    title: this.newNotificationTitle,
                    description: this.newNotificationDescription,
                    lat: lat,
                    lon: lng,
                    lng: lng
                };
                var point = {lat: lat, lng: lng};
                $mapService.closePopup();
                $dataHandlerService.createNotification(notification);
            };


            $dataHandlerService.getNotifications().then(function (notifications) {
                angular.forEach(notifications, function (notification) {
                    $mapService.addMarker(notification);
                });
            });

            $dataHandlerService.updateSubscribe(this, function(updates){
                angular.forEach(updates, function(update){
                   if(update.is_active){
                       $mapService.addOrUpdateMarker(update);
                   } else {
                       $mapService.removeMarker(update);
                   }
                });
            });

        },
        link: function (scope, element) {
            $mapService.initMap(element[0], 32.0658, 34.8034, 13); //Coordinates of Tel-Aviv
            $mapService.onMapClick(this, function (point) {
                initPopupFields();
                $mapService.openPopup(point, getNewNotificationTemplate());
            });

            function initPopupFields() {
                scope.newNotificationTitle = "";
                scope.newNotificationDescription = "";
            }

            function getNewNotificationTemplate() {
                return function (lat, lng) {
                    var template = ('<div class="new-notification">' +
                    '<label> <span>title:</span>' +
                    '<input type="text" ng-model="newNotificationTitle"> <br>' +
                    '</label>' +
                    '<label> <span>description:</span>' +
                    '<textarea ng-model="newNotificationDescription"/>' +
                    '</label> <div>' +
                    '<button ng-click="submitNewNotification(%lat%,%lng%)">add</button>' +
                    '</div></div>').replace('%lat%', lat).replace('%lng%', lng);

                    return $compile(template)(scope)[0];
                }
            }
        }

    }
});
