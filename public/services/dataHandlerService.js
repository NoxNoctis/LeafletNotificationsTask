app.service('$dataHandlerService', function ($http, $q, $timeout) {

    var notifications,
        lastUpdated,
        updateSubscriptions = [],
        waitingForServer = false,
        updateRate = 500;

    this.createNotification = function (notification) {

        //Compensating for the api difference between waze and Leaflet
        if (!notification.lon)
            notification.lon = notification.lng;

        $http.post("/notifications", notification).then(function (res) {
            console.log("created: " + notification.title);
        });
    };

    this.upVote = function (notification) {
        $http.put("/notifications/:id/upvote".replace(":id", notification.id), notification).then(function (res) {
            console.log("upvoted: " + notification.title);
        });
    };

    this.updateNotification = function (notification) {
        $http.put("/notifications/:id".replace(":id", notification.id), notification).then(function (res) {
            console.log("updated: " + notification.title);
        });
    };

    this.deleteNotification = function (notification) {
        $http.delete("/notifications/:id".replace(":id", notification.id)).then(function (res) {
            console.log("deleted: " + notification.title);
        });
    };

    this.getNotifications = function () {
        var deferred = $q.defer();
        if (!notifications) {
            notifications = {};
            $http.get("/notifications").then(function (res) {
                angular.forEach(res.data, function (notification) {
                    if (notification.is_active) {
                        notifications[notification.id] = notification;
                    }
                });
                lastUpdated = new Date();
                startUpdater();
                deferred.resolve(notifications);
            });
        }
        else {
            deferred.resolve(notifications);
        }

        return deferred.promise;
    };

    this.updateSubscribe = function (ctx, action) {
        updateSubscriptions.push(
            {
                ctx: ctx,
                action: action
            });
    };

    function startUpdater() {
        if (!waitingForServer)
            getUpdatedNotifications();
        $timeout(startUpdater, updateRate);
    }

    function getUpdatedNotifications() {
        waitingForServer = true;
        $http.get("/notifications/updates", {params: {"since": lastUpdated}}).success(function (res) {
            waitingForServer = false;
            lastUpdated = new Date();
            //This is to compensate for what appears to be a delay in the server updates
            lastUpdated.setSeconds(lastUpdated.getSeconds() - 10);
            angular.forEach(updateSubscriptions, function (subscription) {
                subscription.action.call(subscription.ctx, res);
            });
            angular.forEach(res, function (update) {
                if (angular.isDefined(notifications[update.id])) {
                    delete notifications[update.id];
                }
                if (update.is_active) {
                    notifications[update.id] = update;
                }
            });
        }).error(function () {
            waitingForServer = false;
        });

    }


    return this;

});
