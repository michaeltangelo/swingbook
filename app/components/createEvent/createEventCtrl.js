app.controller("createEventCtrl", function($scope, $http, $state, Event, Account){
    if (!Account.isLoggedIn()) {
        $state.go("login", {lastUrl: $state.current.name});
    }
    else {
        $scope.event = {
            name: "",
            date: "",
            start: "",
            end: "",
            recurring: "",
            location: "",
            imageUrl: "",
            description: "",
        };

        $scope.populateForm = function() {
            console.log("set new event");
            $scope.event = {
                name: "Frim Fram",
                date: "2016-11-30T05:00:00.000Z",
                start: "1970-01-01T14:01:00.000Z",
                end: "1970-01-01T16:11:00.000Z",
                recurring: "never",
                location: "412 8th Ave",
                imageUrl: "",
                description: "This is a description",
            };
        };
        $scope.populateForm();

        $scope.errMsg = "No error";

        $scope.submit = function() {
            console.log("Submit clicked.");
            var newEvent = new Event($scope.event);
            // Save method needs to be impleemnted on Event class
            newEvent.save()
            .then(function(response) {
                console.log("success: " + JSON.stringify(response));
            }, function(response){
                console.log("rejected: "  + JSON.stringify(response));
            });
            //
            // $http
            // .post('/api/events/create')
            // .then(function(response) {
            //     console.log("success: " + JSON.stringify(response));
            // }, function(response) {
            //     console.log("rejected: "  + JSON.stringify(response));
            // });
        };
    }
});
