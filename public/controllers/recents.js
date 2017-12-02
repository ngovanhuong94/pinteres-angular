angular.module('MyApp')
.controller('RecentsCtrl', ['$scope', '$rootScope','$alert','$http', function ($scope, $rootScope,$alert, $http) {
 $http.get('/api/recents')
 .success(function (data) {
 	console.log(data)
 	$scope.wins = data
 })
 .error(function (response) {
 	$alert({
 		content: response.data.message,
 		type: 'danger',
 		placement: 'top-right',
 		duration: 3
 	})
 })
 $scope.like = function (id) {
 	$http.get(`/api/recents/${id}/like`)
 	.success(function (data){
 		var newWins = $scope.wins
 		for (var i =0; i< newWins.length; i++) {
 			if (newWins[i]._id === id) {
 				newWins[i] = data
 			}
 		}
 		console.log(data)
 		$scope.wins = newWins
 	})
 	.error(function (response) {
 		$alert({
 			content: response.data.error,
 			type: 'danger',
 			placement: 'top-right',
 			duration: 3
 		})
 	})
 }
}])