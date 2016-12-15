app.controller("loginCtrl", function($scope, $http, $state, Account){
    if (Account.isLoggedIn()) $state.go("home");

    $scope.message = "";
    $scope.user = {
        username: "",
        password: ""
    };


    $scope.submit = function() {
        var u = $scope.user;
        Account.login(u, function(data) {
            console.log(data);
            console.log("Finished!");
        });
    };
    console.log("login controller.");
});
