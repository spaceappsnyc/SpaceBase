var router = require('express').Router;

router.get('/temperature', function(req, res){
	res.json(sensorData.temperature);
});

module.exports = .router;