var express = require('express');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'mihirpatel.me',
	user: 'spacebase',
	password: 'factset123',
	database: 'spacebase'
});
var mraa  = require ('mraa');

// var Data = sequelize.define('Data', {
//   x: Sequelize.INTEGER,
//   y: Sequelize.INTEGER,
//   ligth: Sequelize.INTEGER,
//   temperature: Sequelize.FLOAT,
//   timestamp: Sequelize.DATE,
// });

var buttonPin = 7;
var lightSensorPin = 0;
var temperatureSensorPin = 1;
var knob1 = 2;
var knob2 = 3;
var knob3 = 4;

var buttonPin = new mraa.Gpio(buttonPin);
buttonPin.dir(mraa.DIR_IN);
var lightSensorPin = new mraa.Aio(lightSensorPin);
var temperatureSensorPin = new mraa.Aio(temperatureSensorPin);


var knob1 = new mraa.Aio(knob1);
var knob2 = new mraa.Aio(knob2);
var knob3 = new mraa.Aio(knob3);

var sensorData;
var buttonData;


function convertToBinary( input ) {
	return input > 500;
	// return input;
}

var toInt = function ( boolVal ) {
	return boolVal? 1:0;
}

var mapKnobs = function () {
	var map = {
		'000': {x: 0, y: 0},
		'001': {x: 1, y: 0},
		'010': {x: 2, y: 0},
		'011': {x: 0, y: 1},
		'100': {x: 2, y: 1},
		'101': {x: 0, y: 2},
		'110': {x: 1, y: 2},
		'111': {x: 2, y: 2},
	};
	return map['' + toInt(knobs[0]) + toInt(knobs[1]) + toInt(knobs[2])] || {x: -1, y: -1};
}

setInterval(function(){

	knobs = {
		0: convertToBinary( knob1.read() ),
		1: convertToBinary( knob2.read() ),
		2: convertToBinary( knob3.read() )
	};

	buttonData = {
		buttonPressed: buttonPin.read()
	};

	sensorData = {
		light: lightSensorPin.read(),
		temperature: temperatureSensorPin.read(),
		timestamp: new Date()
	};
	edisonData = {
		x: mapKnobs().x,
		y: mapKnobs().y,
		light: sensorData.light,
		temperature: sensorData.temperature,
		timestamp: sensorData.timestamp
	}

	// console.log(JSON.stringify(sensorData));
	// console.log(JSON.stringify(knobs));
	// console.log(JSON.stringify(buttonData));

	writeToDB();
}, 1000);

var writeToDB = function( res ) {
	console.log('trying to write: ' + JSON.stringify(edisonData));
	if (buttonData.buttonPressed) {
		connection.query('INSERT INTO data SET ? ', edisonData, function ( err, result ) {
	  		if (err) {
	  			if (res)
	  				res.status(400).json(err);
	  		} else {
	  			if (res){
	  				res.status(201).json(result);
	  			}
	  			console.log('pushing data to db: ' + JSON.stringify(edisonData));
	  		}
		} );
	}
};

module.exports.createServer = function ( ) {
	connection.connect(function(err){
		if (!err) {
			console.log('connected to db');
			
		} else {
			console.log('error connecting to db');
			console.log(err);

		}
	});
	var server = express();

	server.get('/', function(req, res){
		writeToDB( res );
	});

	server.get('/light', function(req, res){
		res.json(sensorData.light);
	});

	server.get('/temperature', function(req, res){
		res.json(sensorData.temperature);
	});

	return server;
}
