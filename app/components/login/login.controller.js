app.controller("loginCtrl", function($scope, $http){
    $scope.submitCap = 0;
    $scope.message = "wokring";
    $scope.user = {
        firstName: "",
        lastName: "",
        username: "",
        password: ""
    };
    $scope.submit = function() {
        if ($scope.submitCap > 0) return;
        else $scope.submitCap++;
        $http.post('/api/register', $scope.user)
        .then(function(result) {

        }, function(result) {
            // If error registering user
            $scope.message = "Username already exists.";
        });
    };
    console.log("Login controller.");
});
