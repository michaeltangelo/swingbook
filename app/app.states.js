app.config(function($stateProvider, $urlRouterProvider,$locationProvider){
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
});
