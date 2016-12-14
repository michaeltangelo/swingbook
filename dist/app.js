var app = angular.module("app", [
    'ui.router'
]);

app.config(["$locationProvider", function($locationProvider){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);

app.directive('navBar', function() {
    return {
        restrict: "E",
        templateUrl: "app/components/navbar/views/navbar.view.html",
        controller: "navCtrl"
    };
});

app.config(["$stateProvider", "$urlRouterProvider", "$locationProvider", function($stateProvider, $urlRouterProvider,$locationProvider){
    $urlRouterProvider.otherwise("/");
    $stateProvider
    .state("home", {
        url: "/",
        controller: "homeCtrl",
        templateUrl: "app/components/home/views/home.html"
    })
    .state("events", {
        url: "/events",
        controller: "eventsCtrl",
        templateUrl: "app/components/events/views/events.html"
    })
    .state("login", {
        url: "/login",
        controller: "loginCtrl",
        templateUrl: "app/components/login/views/login.html"
    });
}]);

app.controller("homeCtrl", ["$scope", "$http", "$state", function($scope, $http, $state){
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
}]);

app.controller("eventsCtrl", ["$scope", function($scope){
    console.log("Events controller.");
}]);

app.controller("loginCtrl", ["$scope", "$http", function($scope, $http){
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
}]);
