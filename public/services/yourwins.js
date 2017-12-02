angular.module('MyApp')
.factory('Yourwin', ['$resource', function ($resource) {
	return $resource('/api/yourwins/:_id')
}])