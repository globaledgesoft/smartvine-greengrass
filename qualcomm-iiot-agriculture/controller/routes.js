var _ = require('underscore');
var async = require('async');
var IndexImpl = require('./actions/index.js');
var request = require('request');

var Routes = function(app) {
    this.app = app;
    this.indexImplInstance = new IndexImpl(app);
    this.config = app.config;
};
module.exports = Routes;

Routes.prototype.init = function() {

    var routesApp = this.app;
    var self = this;

    routesApp.get('/echoTest', function(req, res) {
        res.json({ "echoValue": req.query.echoValue });
    });

    routesApp.get('/', function(req, res) {
        res.render('index');
    });

    /* 
     * Retreives data based on the input request variable sensor.
     * requestObject : sensor
     * responseObject : json object contains 2 array values and 1 for x-axis and 1 for y-axis
     */
    routesApp.get('/getSensorGraphData', function(req, res) {

        console.log("Inside Sensor Graph Data");

        var time = new Date().getTime();
        // var end_time = time;
        // var start_time = time - 24 * 60 * 60 * 1000;
        var end_time = time;
        var start_time = time - 60 * 24 * 60 * 60 * 1000;
        var sensor = req.query.sensor;
        console.log(sensor);
        console.log(start_time);
        console.log(end_time);
        knex.withSchema(config.schemaName).table(sensor)
            .whereBetween('reported_time', [start_time, end_time])
            .orderBy('id', 'asc')
            .asCallback(function(err, rows) {
                if (!err) {
                    console.log(rows.length);
                    var x_axis = _.pluck(rows, 'value');
                    var y_axis = _.pluck(rows, 'reported_time');
                    var data = {
                        x_axis: x_axis,
                        y_axis: y_axis
                    };
                    var jsonObj = {
                        "status": "true",
                        "code": 200,
                        "message": "Data retreived successfully",
                        "data": data
                    };
                    res.send(jsonObj);
                } else {
                    console.log(err);
                }
            });

    });

    /*
     * API to update the default city for the Weather widget
     * requestObject : cityName
     * responseObject : jsonObject gives a success flag named data.
     */
    routesApp.get('/updateDefaultCity', function(req, res) {
        var defaultCityName = req.query.cityName;
        knex.withSchema(config.schemaName).table('default_city')
            .where('description', 'default')
            .update({
                city_name: defaultCityName
            }).asCallback(function(err, rows) {
                if (!err) {
                    res.json({ "status": "true", "code": 200, "message": "data updated successfully in sqlite3", "data": "true" })
                } else {
                    res.json({ "status": "true", "code": 200, "message": "data updated successfully in sqlite3", "data": "false" })
                }
            });
    });

    /*
     * API to retreive default values for the hidden pages
     * requestObject : none
     * responseObject : jsonObject with default variable and its values.
     */
    routesApp.get('/getDefaultValues', function(req, res) {
        var responseObject = {
            status: true,
            code: 200
        };
        knex.withSchema(config.schemaName).table('default_city').select()
            .asCallback(function(err, defaultCity) {
                if (!err && defaultCity[0]) {
                    responseObject.message = "data retreived successfully";
                    responseObject.data = {
                        cityName: defaultCity[0].city_name
                    };
                    res.json(responseObject);
                } else {
                    responseObject.message = "failed to retreive data";
                    responseObject.data = null;
                    res.json(responseObject);
                }
            });
    });

    /*
     * API to update the screen transition state flag which is used for managing the screen transition. 
     * If the flag is true - No screen transition will start
     * If the flag is false - Screen transition will start based on the event.
     * requestObject : screenTransitionState
     * responseObject : jsonObject which gives update information
     */
    routesApp.get('/updateScreenTransitionState', function(req, res) {

        var screenTransitionState = null;

        if (req.query.screenTransitionState == "false") {
            screenTransitionState = false;
        } else {
            screenTransitionState = true;
        }

        knex.withSchema(config.schemaName).table('screen_transition_state')
            .where('description', 'default')
            .update({
                screen_transition_state: screenTransitionState
            }).asCallback(function(err, rows) {
                if (!err) {
                    res.json({ "status": "true", "code": 200, "message": "data updated successfully in sqlite3", "data": "true" })
                } else {
                    res.json({ "status": "true", "code": 200, "message": "data updated successfully in sqlite3", "data": "true" })
                }
            });
    });

    /*
     * API to make screen transition for Temperature
     * requestObject : sensor
     * responseObject : Just a string "ok"
     */
    routesApp.get('/startScreenTransition', function(req, res) {
        var sensor = req.query.sensor;
        var screenTransitionState = null;
        var screenTransitionStateForSensor = null;
        var event = null;
        var obj = {
            state: true
        };
        if (sensor == 'temperature') {
            event = 'agri-temp-event';
            obj.sensor = 'temperature';
        } else if (sensor == 'moisture') {
            event = 'agri-moist-event';
            obj.sensor = 'moisture';
        } else if (sensor == 'drought') {
            event = 'agri-drought-event';
            obj.sensor = 'drought';
        } else if (sensor == 'light') {
            event = 'agri-light-event';
            obj.sensor = 'light';
        }

        async.series({
            readScreenTransitionState: function(callback) {
                readScreenTransitionState(function(state) {
                    screenTransitionState = state;
                    callback(null, null);
                });
            },
            readScreenTransitionStateForSensor: function(callback) {
                readScreenTransitionStateForSensor(sensor, function(state) {
                    screenTransitionStateForSensor = state;
                    callback(null, null);
                });
            },
            sendSocketUpdate: function(callback) {
                if (!screenTransitionState && !screenTransitionStateForSensor) {
                    updateScreenTransitionState({ "state": true }, function(status) {
                        io.sockets.emit("iiot-agri-transition-screen", { "event": event });
                        console.log("Invoking " + sensor + " event");
                        callback(null, true);
                    });
                } else {
                    callback(null, false);
                }
            },
            updateScreenTransitionStateForSensor: function(callback) {
                if (!screenTransitionState) {
                    updateScreenTransitionStateForSensor(obj, function(state) {
                        callback(null, null);
                    });
                } else {
                    callback(null, null);
                }
            }
        }, function(err, result) {
            res.send("ok");
        });
    });

    /*
     * API to update temperature screen transition status flag
     * requestObject : none
     * responseObject : Just a string "ok"
     */
    routesApp.get('/updateTemperatureScreenTransitionStatus', function(req, res) {

        var updateObject = {};
        updateObject.freeze_condition = false;

        knex.withSchema(config.schemaName).table('screen_transition_state_for_sensor')
            .where('description', 'default')
            .update(updateObject).asCallback(function(err, rows) {
                if (!err) {
                    res.send("ok");
                } else {
                    res.send("failed to update");
                }
            });
    });

    /*
     * API to update temperature screen transition status flag
     * requestObject : none
     * responseObject : JSON object containing weather information data
     */
    routesApp.get('/getWeatherInfo', function(req, res) {

        var defaultCity = 'Las Vegas';
        var weatherUrl = 'http://api.openweathermap.org/data/2.5/weather?q=';
        var parameters = '&units=metric&APPID=';

        knex.withSchema(config.schemaName).table('default_city').select()
            .asCallback(function(err, rows) {
                if (!err && rows[0]) {
                    defaultCity = rows[0].city_name;
                }
                var endUrl = weatherUrl + defaultCity + parameters + self.config.weatherAppId
                console.log(endUrl);
                request.get({
                    url: endUrl
                }, function(error, response, body) {
                    var responseJson = {};
                    if (!error && response.statusCode == 200) {
                        var weatherJson = JSON.parse(body);
                        if (weatherJson.main) {
                            responseJson.status = true;
                            responseJson.temperature = weatherJson.main.temp;
                            responseJson.condition = weatherJson.weather[0].description;
                            responseJson.humidity = weatherJson.main.humidity;
                            responseJson.windSpeed = weatherJson.wind.speed;
                            responseJson.pressure = weatherJson.main.pressure;
                            var updateObject = { weather_data: JSON.stringify(responseJson) };
                            knex.withSchema(config.schemaName).table('weather_information')
                                .where('description', 'default')
                                .update(updateObject).asCallback(function(err, rows) {
                                    res.json(responseJson);
                                });
                        } else {
                            console.log("No weather information available, retreiving stored information");
                            knex.withSchema(config.schemaName).table('weather_information').select()
                                .asCallback(function(err, rows) {
                                    res.json(JSON.parse(rows[0].weather_data));
                                });
                        }
                    } else {
                        console.log("No weather information available, retreiving stored information");
                        knex.withSchema(config.schemaName).table('weather_information').select()
                            .asCallback(function(err, rows) {
                                res.json(JSON.parse(rows[0].weather_data));
                            });
                    }
                });
            });

    });

    /*
     * API to update Light screen transition status flag
     * requestObject : none
     * responseObject : Just a string "ok"
     */
    routesApp.get('/updateLightScreenTransitionStatus', function(req, res) {

        var updateObject = {};
        updateObject.light_detected = false;

        knex.withSchema(config.schemaName).table('screen_transition_state_for_sensor')
            .where('description', 'default')
            .update(updateObject).asCallback(function(err, rows) {
                if (!err) {
                    res.send("ok");
                } else {
                    res.send("failed to update");
                }
            });
    });

    /*
     * Function to update screen transition status flag
     */
    var updateScreenTransitionState = function(stateObj, callback) {
        knex.withSchema(config.schemaName).table('screen_transition_state')
            .where('description', 'default')
            .update({
                screen_transition_state: stateObj.state
            }).asCallback(function(err, rows) {
                if (!err) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
    };

    /*
     * Function to read current screen transition status flag
     */
    var readScreenTransitionState = function(callback) {
        knex.withSchema(config.schemaName).table('screen_transition_state').select()
            .asCallback(function(err, rows) {
                if (!err && rows[0]) {
                    callback(rows[0].screen_transition_state);
                } else {
                    callback(false);
                }
            });
    };

    /*
     * Function to read current screen transition status flag for sensor
     */
    var readScreenTransitionStateForSensor = function(sensor, callback) {
        knex.withSchema(config.schemaName).table('screen_transition_state_for_sensor').select()
            .asCallback(function(err, rows) {
                if (!err && rows[0]) {
                    if (sensor == "temperature")
                        callback(rows[0].freeze_condition);
                    else if (sensor == "moisture")
                        callback(rows[0].high_moisture);
                    else if (sensor == "drought")
                        callback(rows[0].drought_condition);
                    else if (sensor == "light")
                        callback(rows[0].light_detected);
                    else
                        callback(false);
                } else {
                    callback(false);
                }
            });
    };

    /*
     * Function to update screen transition status flag for sensor
     */
    var updateScreenTransitionStateForSensor = function(stateObject, callback) {
        var sensor = stateObject.sensor;
        var updateObject = {};

        if (sensor == "temperature") {
            updateObject.freeze_condition = true;
            updateObject.unfreeze_condition = false;
        } else if (sensor == "moisture") {
            if (stateObject.state) {
                updateObject.high_moisture = true;
                updateObject.drought_condition = false;
            } else {
                updateObject.high_moisture = false;
                updateObject.drought_condition = true;
            }
        } else if (sensor == "drought") {
            if (stateObject.state) {
                updateObject.high_moisture = false;
                updateObject.drought_condition = true;
            } else {
                updateObject.high_moisture = true;
                updateObject.drought_condition = false;
            }
        } else if (sensor == "light") {
            updateObject.light_detected = true;
            updateObject.low_light_detected = false;
        }

        knex.withSchema(config.schemaName).table('screen_transition_state_for_sensor')
            .where('description', 'default')
            .update(updateObject).asCallback(function(err, rows) {
                if (!err) {
                    callback(true);
                } else {
                    callback(false);
                }
            });

    };
};