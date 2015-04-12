app.directive('heatmap', [function(){
	return {
		restrict: 'E',
		scope: {
			mapData: '='
		},
		replace: true,
		template: '<div style="height: 100%; width: 100%;"></div>',
		link: function(scope, element, attrs){
			var heatmap = h337.create({
				container: element[0]
			});

			heatmap.setData(scope.mapData);

			scope.$watch('mapData', function(newVal, oldVal){
				if (newVal !== oldVal){
					heatmap.setData(newVal);
				}
			}, true);
		}
	};
}]);