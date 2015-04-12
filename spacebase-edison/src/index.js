var server = require('./server').createServer();

var app = server.listen(3000, function() {
	// var host = app.address().address;
	var port = app.address().port;
	console.log('Listening on port ' + port);
});
// intel Edison WiFi
// pass Intel4321
