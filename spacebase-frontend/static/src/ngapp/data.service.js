app.service('DataService', ['$q', '$http', function($q, $http){
	var svc = {};

	svc.getData = function(){
		var deferred = $q.defer();

		$http.get('/api/v1/data').then(function success(result){
			var data = result.data;
			for (var i = 0; i < data.length; ++i){
				data[i].light = parseFloat(data[i].light);
				data[i].temperature = parseFloat(data[i].temperature);
			}
			deferred.resolve(data);
		}, function error(response){
			deferred.reject(response.message);
		});

		return deferred.promise;
	};

	return svc;
}]);