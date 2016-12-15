app.controller("eventsCtrl", function($scope, $http, $state){
    console.log("eventsctrl");
    $scope.events = [];

    $http
    .get('/api/events')
    .then(function(response) {
        if (response.data.err) {
            console.log("Error in retrieving events: " + response.data.err);
            return;
        }
        $scope.events = response.data.map(function(event) {
            return event;
        });
    });

    $scope.gotoCreateEvent = function() {
        $state.go("createEvent");
    };
});
