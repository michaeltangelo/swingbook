app.controller("loginCtrl", function($scope, $http, $state, Account){
    if (Account.isLoggedIn()) $state.go("home");

    $scope.message = "";
    $scope.user = {
        username: "",
        password: ""
    };


    $scope.submit = function() {
        var u = $scope.user;
        Account.login(u)
        .then(function(user) {
            // Login was successful - Should auto redirect to home
        }, function(errMsg) {
            // Login was unsuccessul
            console.log("The error message received is: " + errMsg);
            $scope.message = errMsg;
        });
    };
    console.log("login controller.");
});
