// From aksperiod Polycritic site
app.service('Account', function($http, $state, $rootScope) {
  var isLoggedIn = false;
  var user = {};
  var errMsg = "";
  var login = function(c) {
    console.log("Login function called in Account service.");
    $http.post('/api/login',{
      username:c.username.toLowerCase(),
      password:c.password
    }).then(function(data) {
        console.log("after post return");
      if (data.data.user) {
          console.log("Success");
      }
      else {
          console.log(data.data.info.message);
      }
      user = data.data;
      errMsg = "";
      isLoggedIn = true;
    //   $rootScope.$broadcast("user-state-change");
      $state.go("home", {
        user: user,
        username: user.username,
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
});
