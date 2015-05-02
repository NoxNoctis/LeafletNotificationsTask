var app = angular.module("leaflet-notifications", [])

    .config(function($httpProvider) {
    $httpProvider.defaults.timeout = 5000;
});