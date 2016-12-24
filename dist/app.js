var app = angular.module("app", [
    'ui.router'
]);

app.config(["$locationProvider", function($locationProvider){
    $locationProvider.html5Mode(true);
}]);

app.run(["Account", function(Account) {
    Account.updateLoginStatus();
}]);

app.directive('navBar', function() {
    return {
        restrict: "E",
        templateUrl: "app/components/navbar/views/navbar.html",
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
        url: "/createEvent",
        controller: "createEventCtrl",
        templateUrl: "app/components/createEvent/view/createEvent.html"
    })
    .state("user", {
        url: "/user/:username",
        controller: "userCtrl",
        templateUrl: "app/components/user/views/user.html"
    })
    .state("login", {
        url: "/login",
        controller: "loginCtrl",
        templateUrl: "app/components/login/views/login.html",
        params: {
            lastUrl: null
        }
    })
    .state("register", {
        url: "/register",
        controller: "registerCtrl",
        templateUrl: "app/components/register/views/register.html"
    })
    .state("test", {
        url: "/test",
        controller: "testCtrl",
        templateUrl: "app/components/test/views/test.html"
    });
}]);

app.controller("createEventCtrl", ["$scope", "$http", "$state", "Event", "Account", function($scope, $http, $state, Event, Account){
    if (!Account.isLoggedIn()) {
        $state.go("login", {lastUrl: $state.current.name});
    }
    else {
        $scope.event = {
            name: "",
            date: "",
            start: "",
            end: "",
            recurring: "",
            location: "",
            imageUrl: "",
            description: "",
        };

        $scope.populateForm = function() {
            console.log("set new event");
            $scope.event = {
                name: "Frim Fram",
                date: "2016-11-30T05:00:00.000Z",
                start: "1970-01-01T14:01:00.000Z",
                end: "1970-01-01T16:11:00.000Z",
                recurring: "never",
                location: "412 8th Ave",
                imageUrl: "",
                description: "This is a description",
            };
        };
        $scope.populateForm();

        $scope.errMsg = "No error";

        $scope.submit = function() {
            console.log("Submit clicked.");
            var newEvent = new Event($scope.event);
            // Save method needs to be impleemnted on Event class
            newEvent.save()
            .then(function(response) {
                console.log("success: " + JSON.stringify(response));
            }, function(response){
                console.log("rejected: "  + JSON.stringify(response));
            });
            //
            // $http
            // .post('/api/events/create')
            // .then(function(response) {
            //     console.log("success: " + JSON.stringify(response));
            // }, function(response) {
            //     console.log("rejected: "  + JSON.stringify(response));
            // });
        };
    }
}]);

app.controller("eventsCtrl", ["$scope", "$http", "$state", "Account", function($scope, $http, $state, Account){
    console.log("eventsctrl");
    console.log("Login Status: " + Account.isLoggedIn());
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

app.controller("loginCtrl", ["$scope", "$http", "$state", "Account", "$stateParams", function($scope, $http, $state, Account, $stateParams){
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
            // Login was successful - reset lastUrl
            $scope.postLoginRedirectState = "";
        }, function(errMsg) {
            // Login was unsuccessul
            console.log("The error message received is: " + errMsg);
            $scope.message = errMsg;
        });
    };
    console.log("login controller.");
}]);

app.controller('navCtrl', ["$scope", "$state", "Account", "$rootScope", "$timeout", function($scope, $state, Account, $rootScope, $timeout){
  $scope.$on("user-state-change", function() {
    console.log("user state change");
    setItems();
  });
  $scope.isOpen = false;

  $scope.toggleOpen = function() {
    if(!$scope.isOpen) {
      $scope.isOpen = !$scope.isOpen;
      $rootScope.overlayOn = $scope.isOpen;
      $timeout(function(){
        $('._nav-overlay .inner .item').css({
          "animation-name": "fade-up",
          "animation-duration": "500ms",
          "animation-fill-mode": "forwards",
        });
      });
    } else {
      $('._nav-overlay .inner .item').css({
        "animation-name": "fade-down",
        "animation-duration": "500ms",
        "animation-fill-mode": "backwards",
      });
      $timeout(function(){
        $scope.isOpen = !$scope.isOpen;
        $rootScope.overlayOn = $scope.isOpen;
      }, 500);
    }
  };
  $scope.goTo = function(link) {
    $scope.isOpen = false;
    $rootScope.overlayOn = $scope.isOpen;
    $state.go(link);
  };

  function setItems() {
    $scope.items = [{
      name:Account.user().username,
      link:"home",
      on: Account.isLoggedIn(),
    },{
      name:"Feed",
      link:"feed",
      on: true,
    },{
      name:"All",
      link:"all",
      on:  Account.isLoggedIn(),
    },{
      name:"Login",
      link:"login",
      on: !Account.isLoggedIn(),
    },{
      name:"Logout",
      link:"logout",
      on: Account.isLoggedIn(),
    }].reverse();
  }
  setItems();

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

app.controller("testCtrl", ["$scope", "$http", "$state", function($scope, $http, $state){
    $scope.testStr = "";

    $http
    .get('/api/test')
    .then(function(response) {
        $scope.testStr = response.data;
    });
}]);

app.factory("Event", ["$http", function($http) {
    function Event(eventObj) {
        var event = eventObj;

        var update = function(eventObj) {
            if (eventObj) {
                for (var key in eventObj) {
                    // Skip if property is from prototype
                    if(!eventObj.hasOwnProperty(key)) continue;
                    event[key] = eventObj[key];
                }
            }
        };

        var save = function() {
            console.log("save function called");
            return (
                $http
                .post('/api/events/create', {event})
            );
        };
        return {
            event,
            update,
            save
        };

        //
        // var list = [];
        // var pristine = [];
        // var add = function(obj) {
        //     list.push(obj);
        // };
        //
        // var get = function(i) {
        //     if(validIndex(i))
        //     return list[i];
        // };
        //
        // var last = function() {
        //     return list[list.length-1];
        // };
        //
        // var remove = function(i) {
        //     if(validIndex(i))
        //     return list.splice(i,1).length;
        //     return false;
        // };
        //
        // var all = function() {
        //     return list;
        // };
        //
        // var create = function(obj) {
        //     list = obj;
        //     pristine = angular.copy(obj);
        // };
        //
        // var validIndex = function(i) {
        //     if(!list.length) return false;
        //     if(i===0) return !!list.length;
        //     return i && i<list.length && i>=0;
        // };
        //
        // var set = function(i, obj) {
        //     if(validIndex(i)) {
        //         for(var key in obj) {
        //             list[i][key] = obj[key];
        //         }
        //     }
        // };
        //
        // var size = function() {
        //     return list.length;
        // };
        // var resetPristineObject = function() {
        //     pristine = angular.copy(list);
        // };
        //
        // return {
        //     add,
        //     set,
        //     get,
        //     last,
        //     remove,
        //     all,
        //     create,
        //     validIndex,
        //     size,
        //     resetPristineObject,
        //     isPristine: function() {
        //         if(list.length !== pristine.length) return false;
        //         return angular.equals(list, pristine);
        //     }
        // };
    }
    return Event;
}]);

// From aksperiod Polycritic site
app.service('Account', ["$http", "$state", "$rootScope", "$q", function($http, $state, $rootScope, $q) {
  var isLoggedIn = false;
  var user = {};
  var errMsg = "";
  var login = function(c, redirectState) {
      return $q(function(resolve, reject){
          $http.post('/api/login',{
              username:c.username.toLowerCase(),
              password:c.password
          }).then(function(data) {
              user = data.data;
              isLoggedIn = true;
              //   $rootScope.$broadcast("user-state-change");
              var redirect = (redirectState && $state.href(redirectState)) ? redirectState : "home";
              $state.go(redirect, {
                  user: user,
                  username: user.username,
              });
          }, function(err) {
              if(err.status === 401){
                  reject("Invalid username or password.");
              }
          });
    });
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
    // $rootScope.$broadcast("user-state-change");
  };

  var updateLoginStatus = function() {
      $http
      .get("/api/isLoggedIn")
      .then(function(response) {
          if (response.data==="0") {
              user = {};
              isLoggedIn = false;
          }
          else {
              initialize(response.data);
          }
      }, function(response) {
          console.log("Something failed in isLoggedIn on server side.");
      });
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
    updateLoginStatus: updateLoginStatus
  };
}]);
