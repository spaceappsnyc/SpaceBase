var mraa  = require ('mraa');
var express = require('express');
var mysql = require('mysql');


var digitalPin = 7;
var lightSensorPin = 0;
var temperatureSensorPin = 1;

var digitalPin = new mraa.Gpio(digitalPin);
// var lightSensorPin = new mraa.Aio(digitalPin);
// var temperatureSensorPin = new mraa.Aio(temperatureSensorPin);

var knob1 = 2;
var knob2 = 3;
var knob3 = 4;
var knob1 = new mraa.Aio(knob1);
var knob2 = new mraa.Aio(knob2);
var knob3 = new mraa.Aio(knob3);

var sensorData;
var buttonData;


function convertToBinary( input ) {
	return input > 500;
	// return input;
}

digitalPin.dir(mraa.DIR_IN);

var state = 0;
setInterval(function(){

	knobs = {
		0: convertToBinary( knob1.read() ),
		1: convertToBinary( knob2.read() ),
		2: convertToBinary( knob3.read() )
	};

	buttonData = {
		buttonPressed: digitalPin.read()
	};

	sensorData = {
		light: lightSensorPin.read(),
		temperature: temperatureSensorPin.read(),
		timestamp: Date.now()
	};

	state = 1 - state;
	console.log(JSON.stringify(sensorData));
	console.log(JSON.stringify(knobs));
	console.log(JSON.stringify(buttonData));
}, 1000);


var app = express();

app.get('/', function(req, res){
	res.json(sensorData);
});

app.get('/light', function(req, res){
	res.json(sensorData.light);
});


app.get('/temperature', function(req, res){
	res.json(sensorData.temperature);
});

var server = app.listen(3000, function() {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Listening on ' + host + ':' + port);
});
// intel Edison WiFi
// pass Intel4321
