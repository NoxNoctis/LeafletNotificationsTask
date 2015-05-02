app.service('$mapService', function () {

    var map;
    var markers = {};

    this.initMap = function (element, lat, lng, zoom) {
        map = L.map(element).setView([lat, lng], zoom);

        L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

    };

    this.getCurrentView = function(){
        var res = {
            center:map.getCenter(),
            north:map.getBounds().getNorthEast().lat,
            east:map.getBounds().getNorthEast().lng,
            south:map.getBounds().getSouthWest().lat,
            west:map.getBounds().getSouthWest().lng,
            zoom:map.getZoom()
        };
        return res;
    };

    this.onMapClick = function (ctx, action) {
        map.on('click', function (point) {
            action.call(ctx, point);
        });
    };

    this.onMapMove =function (ctx, action) {
        var self = this;
        map.on('moveend', function () {
            action.call(ctx, self.getCurrentView());
        });
    };



    this.openPopup = function (event, getContent) {
        return L.popup()
            .setLatLng(event.latlng)
            .setContent(getContent(event.latlng.lat, event.latlng.lng))
            .openOn(map);
    };

    this.closePopup = function () {
        map.closePopup();
    };

    this.addOrUpdateMarker = function(notification){
       if(markers[notification.id]){
           this.updateMarker(notification);
       } else {
           this.addMarker(notification);
       }
    };

    this.addMarker = function (notification) {
        var marker = L.marker(notification).addTo(map);
        markers[notification.id] = marker;
        bindPopupToMarker(marker,notification.title, notification.description);
    };

    this.removeMarker = function(notification){
        if(markers[notification.id]) {
            map.removeLayer(markers[notification.id]);
            delete markers[notification.id];
        }
    };

    this.updateMarker = function(notification){
        var marker = markers[notification.id];
        marker.unbindPopup();
        bindPopupToMarker(marker,notification.title, notification.description);
    };

    function bindPopupToMarker(marker, title, description){
        marker.bindPopup('Title: ' + title  +'<br>'+
        'Description: ' + description);
    }


    return this;
});