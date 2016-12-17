app.controller("testCtrl", function($scope, $http, $state){
    $scope.testStr = "";

    $http
    .get('/api/test')
    .then(function(response) {
        $scope.testStr = response.data;
    });
});
