// From aksperiod Polycritic site
app.service('Account', function($http, $state, $rootScope, $q) {
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
});
