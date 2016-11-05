var app = angular.module('swingBook', ['ui.router']);

app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl'
		});

	$urlRouterProvider.otherwise('home');
}]);
	
app.controller('MainCtrl', [
	'$scope',
	'events',
	function($scope, events){
		$scope.events = events;
		$scope.test = 'Hello world!';
		$scope.events = [
			{name: "Frim Fram", date: 'Thurs 9:00pm-1:00am', numAttendees: 0},
			{name: 'Brooklyn Swings', date: 'Fridays 7:30pm-10:00pm', numAttendees: 0},
			{name: 'Swing Practice', date: 'Tuesdays 9:00pm-11:00pm', numAttendees: 0}
		];
		$scope.addEvent = function() {
			if(!$scope.name || $scope.name === '') return;
			if(!$scope.date || $scope.date === '') return;
			$scope.events.push({name: $scope.name, date: $scope.date, numAttendees: 0});
		};
		$scope.addAttendee = function(event) {
			event.numAttendees++;
		}
}]);

app.factory('events', [function(){
	var o = {
		events: []
	};
	return o;
}])