angular.module('MyApp')
.factory('Auth', ['$http', '$location','$alert', '$rootScope','$cookieStore',
  function ($http, $location, $alert, $rootScope, $cookieStore) {

  	$rootScope.currentUser = $cookieStore.get('user')
  	$cookieStore.remove('user')

  	return {
      login: function (user) {
         $http.post('/api/login', user)
         .success(function (data) {
          $rootScope.currentUser = data
          $location.path('/')
          $alert({
            title: 'Cheers!',
            content: 'You successfully logged in',
            placement: 'top-right',
            type: 'success',
            duration: 3
          })
         })
         .error(function () {
          $alert({
            title: 'Error!',
            content: 'Invalid email or password',
            placement: 'top-right',
            type: 'danger',
            duration: 3
          })
         })
      },
  		signup: function (user) {
  			$http.post('/api/signup', user)
  			.success(function (){
  				$location.path('/login')
  				$alert({
  					title: 'Congratulations!',
  					content: 'Your account has beern created',
  					placement: 'top-right',
  					type: 'success',
  					duration: 3
  				})
  			})
  			.error(function (response) {
  				$alert({
  					title: 'Error!',
  					content: response.data,
  					placement: 'top-right',
  					type: 'danger',
  					duration: 3
  				})
  			})
  		},
      logout: function () {
        $http.get('/api/logout')
        .success(function () {
          $rootScope.currentUser = null;
          $cookieStore.remove('user')
          $alert({
            content: 'You have been logged out.',
            type: 'info',
            placement: 'top-right',
            duration: 3
          })
        }) 
      },
      isLoggedIn: function () {
        return $rootScope.currentUser ? true : false
      }
  	}
  }
	])