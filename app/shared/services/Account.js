// From aksperiod Polycritic site
app.service('Account', function($http, $state, $rootScope, $q) {
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
});
