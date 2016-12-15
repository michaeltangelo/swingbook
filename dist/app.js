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
    .state("event", {
        url: "/event/:slug",
        controller: "eventCtrl",
        templateUrl: "app/components/event/views/event.html"
    })
    .state("createEvent", {
        url: "/events/create",
        controller: "createEventCtrl",
        templateUrl: "app/components/events/create/view/createEvent.html"
    })
    .state("user", {
        url: "/user/:username",
        controller: "userCtrl",
        templateUrl: "app/components/user/views/user.html"
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
}]);

app.controller("eventsCtrl", ["$scope", "$http", "$state", function($scope, $http, $state){
    console.log("eventsctrl");
    $scope.events = [];

    $http
    .get('/api/events')
    .then(function(response) {
        if (response.data.err) {
            console.log("Error in retrieving events: " + response.data.err);
            return;
        }
        $scope.events = response.data.map(function(event) {
            return event;
        });
    });

    $scope.gotoCreateEvent = function() {
        $state.go("createEvent");
    };
}]);

app.controller("homeCtrl", ["$scope", "$http", "$state", "Account", function($scope, $http, $state, Account){
    if (!Account.isLoggedIn()) $state.go("login");
    else $state.go("events");

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

app.controller("landingCtrl", ["$scope", "$http", "$state", function($scope, $http, $state){
    console.log("landing controller.");
    $scope.taglines = [
        "Music rankings suck",
        "Because they don't account for your taste.",
        "So find people who rank music like you do."
    ];
}]);

app.controller("loginCtrl", ["$scope", "$http", "$state", "Account", function($scope, $http, $state, Account){
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
}]);

app.controller("registerCtrl", ["$scope", "$http", "$state", function($scope, $http, $state){
    $scope.message = "wokring";
    $scope.user = {
        firstName: "",
        lastName: "",
        username: "",
        password: ""
    };
    $scope.submit = function() {
        $http.post('/api/register', $scope.user)
        .then(function(result) {
            $state.go("home");
        }, function(result) {
            // If error registering user
            $scope.message = "Username already exists.";
        });
    };
    console.log("register controller.");
}]);

// From aksperiod Polycritic site
app.service('Account', ["$http", "$state", "$rootScope", "$q", function($http, $state, $rootScope, $q) {
  var isLoggedIn = false;
  var user = {};
  var errMsg = "";
  var login = function(c) {
    console.log("Login function called in Account service.");
    var deferred = $q.defer();

    $http.post('/api/login',{
      username:c.username.toLowerCase(),
      password:c.password
    }).then(function(data) {
        console.log("after post return");
      if (data.data.user) {
          console.log("Success");
          // Resolve the promise passing in the user
          errMsg = "";
          deferred.resolve(data.data.user);
          user = data.data;
          isLoggedIn = true;
        //   $rootScope.$broadcast("user-state-change");
          $state.go("home", {
            user: user,
            username: user.username,
          });
      }
      else {
          console.log(data.data.info.message);
          // Reject the promise passing in the errMsg
          errMsg = data.data.info.message;
          deferred.reject(errMsg);
      }
    });

    // set errMsg to be a promise until result
    errMsg = deferred.promise;
    return $q.when(errMsg);
  };

  var logout = function() {
    $http
    .get("/logout")
    .then(function(response) {
      if(response.status === 200) {
        $state.go("login");
        isLoggedIn = false;
        user = {};
        errMsg = "";
        // $rootScope.$broadcast("user-state-change");
      }
    }, function(response) {
        console.log("Error in logging out.");
        errMsg = "Log out failed.";
    });
  };

  var initialize = function(u) {
    user = u;
    isLoggedIn = true;
    $rootScope.$broadcast("user-state-change");
  };

  return {
    isLoggedIn: function(){
      return isLoggedIn;
    },
    login: login,
    logout: logout,
    user: function() {
      return user;
    },
    initialize: initialize,
  };
}]);

app.controller("createEventCtrl", ["$scope", "$http", "$state", function($scope, $http, $state){
    console.log("createEventsCtrl");
}]);
