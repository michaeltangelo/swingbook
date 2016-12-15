app.config(function($stateProvider, $urlRouterProvider,$locationProvider){
    $urlRouterProvider.otherwise("/");
    $stateProvider
    .state('landing', {
        url: "/",
        controller: "landingCtrl",
        templateUrl: "app/components/landing/views/landing.html"
    })
    .state("home", {
        url: "/home",
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
    })
    .state("register", {
        url: "/register",
        controller: "registerCtrl",
        templateUrl: "app/components/register/views/register.html"
    });
});
