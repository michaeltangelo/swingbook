app.controller("homeCtrl", function($scope, $http, $state, Account){
    if (!Account.isLoggedIn()) $state.go("login");
    // else $state.go("events");


    console.log("home controller");
    $scope.user = Account.user();
    $scope.message = "Hello, " + $scope.user.username;
    //
    // $http
    // .get("/api/currentUser")
    // .then(function(data){
    //     console.log(data);
    //     if(data.data === "boo") {
    //         $state.go("login");
    //     }
    // });
});
