var https = require('https');
var fs = require("fs");

var options = {
	host: 'asofavkjfjmc.iot.us-east-1.amazonaws.com',
	port: 8443,
	path: '/greengrass/discover/thing/Moisture',
	method: 'GET',
	key: fs.readFileSync("./moisture/certs/Moisture.private.key"),
	cert: fs.readFileSync("./moisture/certs/Moisture.cert.pem"),
	ca: fs.readFileSync("root-CA.crt")
};

var req = https.request(options, function(res) {
	res.on('data', function(d) {
		var jsonObject = JSON.parse(d);
		console.log(jsonObject.GGGroups[0].CAs)
		fs.writeFile("gg-CA.crt", jsonObject.GGGroups[0].CAs[0]);
  	});
});

req.end();

req.on('error',function(e) {
	console.error(e);
});
