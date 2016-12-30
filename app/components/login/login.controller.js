app.controller("loginCtrl", function($scope, $http, $state, Account, $stateParams){
    if (Account.isLoggedIn()) $state.go("home");

    $scope.postLoginRedirectState = "";
    if ($stateParams && $stateParams.lastUrl) {
        $scope.postLoginRedirectState = $stateParams.lastUrl;
    }

    $scope.message = "";
    $scope.user = {
        username: "",
        password: ""
    };


    $scope.submit = function() {
        console.log("Inside submit.");
        var u = $scope.user;
        var redirectState = $scope.postLoginRedirectState;
        console.log("Submitting login request with info: " + JSON.stringify(u));
        Account.login(u, redirectState)
        .then(function(user) {
            console.log("Received a reply: " + user);
            // Login was successful - reset lastUrl
            $scope.postLoginRedirectState = "";
        }, function(errMsg) {
            // Login was unsuccessul
            console.log("The error message received is: " + errMsg);
            $scope.message = errMsg;
        });
    };
    console.log("login controller.");
});
