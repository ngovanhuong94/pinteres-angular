angular.module('MyApp')
.controller('YourwinsCtrl', ['$scope', '$alert','Yourwin', function ($scope, $alert, Yourwin) {
	$scope.add = function () {
		Yourwin.save({
			title: $scope.title,
			sourceUrl: $scope.sourceUrl
		}, function (data) {
			$scope.title = ''
			$scope.sourceUrl = ''
			$scope.yourwins.push(data)
			$alert({
				content: 'You have been added a win',
				placement: 'top-right',
				type: 'success',
				duration: 3
			})
		}, function (response) {
			$scope.title = ''
			$scope.sourceUrl = ''
			$alert({
				content: response.data.message,
				placement: 'top-right',
				type: 'danger',
				duration: 3
			})
		})
	}

	$scope.yourwins = Yourwin.query()

	$scope.delete = function (id) {
		console.log(id)
		Yourwin.delete({_id: id}, function () {
			var yourwins = $scope.yourwins
			var index = 0;
			for (var i =0; i< yourwins.length; i++) {
				if (yourwins[i]._id === id) {
					index = i
				}
			}
			console.log(index)
			$scope.yourwins.splice(index, 1)
			$alert({
				content: 'You have been deleted a win',
				type: 'success',
				placement: 'top-right',
				duration: 3
			})
		}, function (response) {
			$alert({
				content: response.data.message,
				type: 'danger',
				placement: 'top-right',
				duration: 3
			})
		})
	}
}])