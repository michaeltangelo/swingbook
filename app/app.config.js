var app = angular.module("app", [
    'ui.router'
]);

app.config(function($locationProvider){
    $locationProvider.html5Mode(true);
});

app.run(function(Account) {
    Account.updateLoginStatus();
});

app.directive('navBar', function() {
    return {
        restrict: "E",
        templateUrl: "app/components/navbar/views/navbar.html",
        controller: "navCtrl"
    };
});
