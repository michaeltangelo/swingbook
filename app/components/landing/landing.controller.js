app.controller("landingCtrl", function($scope, $http, $state){
    console.log("landing controller.");
    $scope.taglines = [
        "Music rankings suck",
        "Because they don't account for your taste.",
        "So find people who rank music like you do."
    ];
});
