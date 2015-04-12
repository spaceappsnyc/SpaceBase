var app = angular.module('spacebase', []);

app.controller('MockDataController', ['$scope', function($scope) {
	// index 0 = x, index 1 = y, index 2 = temp (or w/e we're measuring)
	var scaleFactor = 10;
	var dataPoints = [
		{
			x: 0,
			y: 0,
			light: 100,
			temperature: 0
		},
		{
			x: 1,
			y: 0,
			light: 125,
			temperature: 0
		},
		{
			x: 2,
			y: 0,
			light: 100,
			temperature: 0
		},
		{
			x: 0,
			y: 1,
			light: 125,
			temperature: 0
		},
		{
			x: 1,
			y: 1,
			light: 150,
			temperature: 0
		},
		{
			x: 2,
			y: 1,
			light: 125,
			temperature: 0
		},
		{
			x: 0,
			y: 2,
			light: 100,
			temperature: 0
		},
		{
			x: 1,
			y: 2,
			light: 125,
			temperature: 0
		},
		{
			x: 2,
			y: 2,
			light: 100,
			temperature: 0
		}
	];
	// var dataSmoother = Smooth(dataAsVector, {
	// 	method: Smooth.LINEAR,
	// 	scaleTo: scaleFactor
	// });

	// var i = 0;
	// var dataPoint;
	// var smoothedData = [];

	// while ( i < scaleFactor ){
	// 	dataPoint = dataSmoother(i);
	// 	var dataX = dataPoint[0];
	// 	var dataY = dataPoint[1];
	// 	var dataVal = dataPoint[2];

	// 	var newDataPoint = {
	// 		x: dataX * scaleFactor,
	// 		y: dataY * scaleFactor,
	// 		value: dataVal
	// 	};

	// 	smoothedData.push(newDataPoint);

	// 	++i;
	// }

	function bilinerInterpolation (x, y, data) {
		var vector1 = [1-x, x];
		var matrix2 = math.matrix(
			[
				[data[0], data[2]], 
				[data[1], data[3]]
			]);
		var vector3 = math.matrix([[1-y], [y]]);
		// return matrix2;
		var intermResult = math.multiply(vector1, matrix2);
		return math.multiply( intermResult, vector3);
	}

	var getLightPoint = function ( x, y, array) {
		var retVal = -1;
		array.forEach(function ( elem ) {
			if ( elem.x == x && elem.y == y )
				retVal = elem.light;
		});
		return retVal;
	};

	// get 9th point
	var fillTempData = function ( ) {
		var mydata = [];
		for (x=0; x < scaleFactor; x++){
			for(y=0; y < scaleFactor; y++){
				mydata.push({x:x, y:y, value:bilinerInterpolation(x/scaleFactor, y/scaleFactor, [
					getLightPoint(0,0, dataPoints),
					getLightPoint(1,0, dataPoints),
					getLightPoint(0,1, dataPoints),
					getLightPoint(1,1, dataPoints),
					] )});
			}
		}
		//////
		for (x=0; x < scaleFactor; x++){
			for(y=0; y < scaleFactor; y++){
				mydata.push({x:x+scaleFactor, y:y, value:bilinerInterpolation(x/scaleFactor, y/scaleFactor, [
					getLightPoint(1,0, dataPoints),
					getLightPoint(2,0, dataPoints),
					getLightPoint(1,1, dataPoints),
					getLightPoint(1,2, dataPoints),
					] )});
			}
		}
		/////
		for (x=0; x < scaleFactor; x++){
			for(y=0; y < scaleFactor; y++){
				mydata.push({x:x, y:y+scaleFactor, value:bilinerInterpolation(x/scaleFactor, y/scaleFactor, [
					getLightPoint(0,1, dataPoints),
					getLightPoint(1,1, dataPoints),
					getLightPoint(0,2, dataPoints),
					getLightPoint(1,2, dataPoints),
					] )});
			}
		}
		//////
		for (x=0; x < scaleFactor; x++){
			for(y=0; y < scaleFactor; y++){
				mydata.push({x:x+scaleFactor, y:y+scaleFactor, value:bilinerInterpolation(x/scaleFactor, y/scaleFactor, [
					getLightPoint(1,1, dataPoints),
					getLightPoint(2,1, dataPoints),
					getLightPoint(1,2, dataPoints),
					getLightPoint(2,2, dataPoints),
					] )});
			}
		}
		return mydata;
	};

	$scope.mockMapData = {
		max: 150,
		min: 100,
		data: fillTempData()
	};
}]);