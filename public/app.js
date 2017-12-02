angular.module('MyApp', ['ngResource', 'ngRoute', 'ngCookies', 'ngMessages', 'mgcrea.ngStrap'])
.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider){
	$locationProvider.html5Mode(true);
	
	$routeProvider
	.when('/', {
		templateUrl: 'views/home.html',
		controller: 'MainCtrl',
	})
	.when('/login', {
		templateUrl: 'views/login.html',
		controller: 'LoginCtrl'
	})
	.when('/signup', {
		templateUrl: 'views/signup.html',
		controller: 'SignupCtrl'
	})
	.when('/yourwins', {
		templateUrl: 'views/youwins.html',
		controller: 'YourwinsCtrl',
		authenticate: true
	})
	.when('/recents', {
		templateUrl: 'views/recents.html',
		controller: 'RecentsCtrl'
	})
	.otherwise({
		redirectTo: '/'
	})
}])
.run(['$rootScope', '$location', function ($rootScope, $location) {
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
		console.log(next.$$route)

		if (!$rootScope.currentUser && next.$$route.authenticate) {
			$location.path('/login')
			event.preventDefault()
		}
	})
}])