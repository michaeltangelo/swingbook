var app = angular.module("app", [
    'ui.router'
]);

app.config(function($locationProvider){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

app.directive('navBar', function() {
    return {
        restrict: "E",
        templateUrl: "app/components/navbar/views/navbar.view.html",
        controller: "navCtrl"
    };
});
