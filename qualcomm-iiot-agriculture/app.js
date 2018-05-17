//Initializing the required packages
var express = require('express');
var app = express();
var path = require('path');
var apiRoutes = express.Router();
var bodyParser = require('body-parser');
var async = require("async");

//Initializing socket communication
var http = require('http').Server(app);
io = require('socket.io')(http);

app.set('view engine', 'html');

app.set('views', __dirname + '/webapps');
app.set('view engine', 'html');

//Configuring static pages directory.
app.use(express.static(path.join(__dirname + '/webapps')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));  

//Reading configuration
config    	 = require('./config/config.js');

//Creating knex query manager Object
knex    	 = require('knex')(config.dbConfig);

app.knex = knex;
app.config = config;

//Configuring and creating tables.
var Setup = require('./config/setup.js');
var setupObject = new Setup(app);

//Configuring APIRoutes
var Routes = require('./controller/routes.js')
var routes = new Routes(app);
routes.init();

module.exports = app;

setupObject.setup(function(err, res) {
    if(!err && (res ==  "done")) {
        console.log("done");
    }
});

//Configuring and starting the API server.
var server = http.listen(config.port, function () {
  	var host = server.address().address;
  	var port = server.address().port;
  	console.log("Example app listening at http://%s:%s", host, port);
});
