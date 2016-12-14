app.controller("homeCtrl", function($scope, $http, $state){
    console.log("home controller");
    $scope.message = "hello michael";
    $scope.user = {
        username: "anthony",
    };
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
