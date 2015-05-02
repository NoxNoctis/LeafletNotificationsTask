app.filter('mapNotification', function($mapService){
    return function(notifications, mapView){
      //  var coords = $mapService.getCurrentView();
        var res = [];
        angular.forEach(notifications, function(notification) {
            if (notification.lat < mapView.north && notification.lat > mapView.south &&
                notification.lon < mapView.east && notification.lon > mapView.west) {
                res.push(notification);
            }
        });


        return _.sortBy(res, function(notification){
            return dist(notification, mapView.center);
        });

        function dist(point1, point2){
            var lng1 = point1.lng? point1.lng:point1.lon,
                lng2 = point2.lng? point2.lng:point2.lon,
                lngDist = (lng1-lng2),
                latDist = (point1.lat-point2.lat);

            latDist *= latDist;
            lngDist *=lngDist;

            return Math.sqrt(latDist + lngDist);
        }
    }
});
