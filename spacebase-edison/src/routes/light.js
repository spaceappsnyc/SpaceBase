var router = require('express').Router;

router..get('/light', function(req, res){
	res.json(sensorData.light);
});

module.exports = .router;