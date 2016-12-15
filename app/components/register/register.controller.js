app.controller("registerCtrl", function($scope, $http, $state){
    $scope.message = "wokring";
    $scope.user = {
        firstName: "",
        lastName: "",
        username: "",
        password: ""
    };
    $scope.submit = function() {
        $http.post('/api/register', $scope.user)
        .then(function(result) {
            $state.go("home");
        }, function(result) {
            // If error registering user
            $scope.message = "Username already exists.";
        });
    };
    console.log("register controller.");
});
