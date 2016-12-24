app.controller('navCtrl', function($scope, $state, Account, $rootScope, $timeout){
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

});
