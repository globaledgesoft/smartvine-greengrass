var async = require('async');

var Setup = function(app){
    this.app = app;
    this.knex = app.knex;
    this.config = app.config;
};
module.exports = Setup;

var createSchema = function(callback){
    knex.raw('create schema if not exists '+this.config.schemaName)
    .asCallback(function(err, result){
        if(!err){
            callback(null, 'Schema creation done');
        } else {
            callback(null, 'Schema already exists');
        }
    });
};

var deleteScreenTransitionStateTable = function(callback){
    knex.raw('drop table screen_transition_state')
    .asCallback(function(err, result){
        console.log(err);
        if(!err){
            callback(null, 'table deletion done');
        } else {
            callback(null, 'table deletion failed');
        }
    });
};

var deleteScreenTransitionStatusTable = function(callback){
    knex.raw('drop table screen_transition_state_for_sensor')
    .asCallback(function(err, result){
        console.log(err);
        if(!err){
            callback(null, 'screen_transition_table deletion done');
        } else {
            callback(null, 'screen_transition_table deletion failed');
        }
    });
};

var deleteWeatherInformationTable = function(callback){
    knex.raw('drop table weather_information')
    .asCallback(function(err, result){
        console.log(err);
        if(!err){
            callback(null, 'weather_information deletion done');
        } else {
            callback(null, 'weather_information deletion failed');
        }
    });
}

var createTemperatureSensorTable = function(callback){
    knex.schema.withSchema(config.schemaName).createTableIfNotExists('temperature_sensor', function(table){
        table.increments('id').primary();
        table.integer('year').notNullable();
        table.integer('month').notNullable();
        table.integer('day').notNullable();
        table.integer('hour').notNullable();
        table.integer('minute').notNullable();
        table.bigInteger('reported_time');
        table.float('value').notNullable();
    }).asCallback(function(err, rows) {
        if(!err) {
            callback(null, "temperature_sensor table created");
        } else {
            callback(null, "temperature_sensor table already exists");
        }
    });
};

var createMoistureSensorTable = function(callback){
    knex.schema.withSchema(config.schemaName).createTableIfNotExists('moisture_sensor', function(table){
        table.increments('id').primary();
        table.integer('year').notNullable();
        table.integer('month').notNullable();
        table.integer('day').notNullable();
        table.integer('hour').notNullable();
        table.integer('minute').notNullable();
        table.bigInteger('reported_time');
        table.float('value').notNullable();
    }).asCallback(function(err, rows) {
        if(!err) {
            callback(null, "moisture_sensor table created");
        } else {
            callback(null, "moisture_sensor table already exists");
        }    
    });
};

var createLightSensorTable = function(callback){
    knex.schema.withSchema(config.schemaName).createTableIfNotExists('light_sensor', function(table){
        table.increments('id').primary();
        table.integer('year').notNullable();
        table.integer('month').notNullable();
        table.integer('day').notNullable();
        table.integer('hour').notNullable();
        table.integer('minute').notNullable();
        table.bigInteger('reported_time');
        table.float('value').notNullable();
    }).asCallback(function(err, rows){
        if(!err) {
            callback(null, "light_sensor table created");
        } else {
            callback(null, "light_sensor table already exists");
        }
    });
};

var createDefaultCityWeatherTable = function(callback){
    knex.schema.withSchema(config.schemaName).createTableIfNotExists('default_city', function(table){
        table.increments('id').primary();
        table.string('city_name', 50);
        table.string('description', 50);
    }).asCallback(function(err, rows){
        if(!err){
            callback(null, "default_city table created");
        } else {
            callback(null, "default_city table creation error");
        }
    });
};

var insertDefaultCity = function(callback){
    knex.withSchema(config.schemaName).select().table('default_city')
    .asCallback(function(err, rows){
        if(!err && rows[0]){
            callback(null, "default_city already exists");
        } else {
            knex.withSchema(config.schemaName).table('default_city')
            .insert({
                city_name : config.cityName,
                description : 'default'
            }).asCallback(function(err, rows){
                if(!err){
                    callback(null, "default city record inserted");
                } else {
                    callback(null, "default city record insertion failed");
                }
            });
        }
    });
};

var createDefaultScreenTransitionStateTable = function(callback){
    knex.schema.withSchema(config.schemaName).createTableIfNotExists('screen_transition_state', function(table){
        table.increments('id').primary();
        table.boolean('screen_transition_state');
        table.string('description', 50);
    }).asCallback(function(err, rows){
        if(!err){
            callback(null, "default_transition_state table created");
        } else {
            callback(null, "defaul_transition_state table creation error");
        }
    });
};

var insertDefaultTransitionState = function(callback){
    knex.withSchema(config.schemaName).select().table('screen_transition_state')
    .asCallback(function(err, rows){
        if(!err && rows[0]){
            callback(null, "Insertion into screen_transition_state failed");
        } else {
            knex.withSchema(config.schemaName).table('screen_transition_state')
            .insert({
                screen_transition_state : false,
                description : 'default'
            })
            .asCallback(function(err, rows) {
                if(!err) {
                    callback(null, "screen_transition_state inserted");
                } else {
                    callback(null, "screen_transition_state insertion failed");
                }
            });
        }
    });
};

var createScreenTransitionStatusTable = function(callback){
    knex.schema.withSchema(config.schemaName).createTableIfNotExists('screen_transition_state_for_sensor', function(table){
        table.increments('id').primary();
        table.boolean('high_moisture');
        table.boolean('drought_condition');
        table.boolean('freeze_condition');
        table.boolean('unfreeze_condition');
        table.boolean('light_detected');
        table.boolean('low_light_detected');
        table.string('description', 50);
    }).asCallback(function(err, rows){
        if(!err){
            callback(null, "screen_transition_status table created");
        } else {
            callback(null, "screen_transition_status table creation failed");
        }
    });
};

var insertDefaultTransitionStatus = function(callback){
    knex.withSchema(config.schemaName).select().table('screen_transition_state_for_sensor')
    .asCallback(function(err, rows){
        if(!err && rows[0]){
            callback(null, "Insertion into screen_transition_status failed");
        } else {
            knex.withSchema(config.schemaName).table('screen_transition_state_for_sensor')
            .insert({
                high_moisture : false,
                drought_condition : false,
                freeze_condition : false,
                unfreeze_condition : false,
                light_detected : false,
                low_light_detected : false,
                description : 'default'
            }).asCallback(function(err, rows){
                if(!err){
                    callback(null, "screen_transition_status inserted");
                } else {
                    callback(null, "screen_transition_status insertion failed");
                }
            });
        }
    });
};

var createWeatherTable = function(callback){
    knex.schema.withSchema(config.schemaName).createTableIfNotExists('weather_information', function(table){
        table.increments('id').primary();
        table.string('weather_data', 200);
        table.string('description', 50);
    }).asCallback(function(err, rows){
        console.log(err);
        if(!err){
            callback(null, "weather_information table created");
        } else {
            callback(null, "weather_information table creation failed");
        }
    });
};

var insertDefaultWeatherData = function(callback){
    var responseJson = {};
    responseJson.status = true;
    responseJson.temperature = '-';
    responseJson.condition = '-';
    responseJson.humidity = '-';
    responseJson.windSpeed = '-';
    responseJson.pressure = '-';
    knex.withSchema(config.schemaName).select().table('weather_information')
    .insert({
        weather_data : JSON.stringify(responseJson),
        description : 'default'
    }).asCallback(function(err, rows){
        console.log(err);
        if(!err){
            callback(null, "weather_information default row is inserted");
        } else {
            callback(null, "weather_information default row insertion failed");
        }
    });
}

Setup.prototype.setup = function(){
    async.series({
        createSchema : createSchema,
        deleteScreenTransitionStateTable : deleteScreenTransitionStateTable,
        deleteScreenTransitionStatusTable : deleteScreenTransitionStatusTable,
        deleteWeatherInformationTable : deleteWeatherInformationTable,
        createTemperatureSensorTable : createTemperatureSensorTable,
        createMoistureSensorTable : createMoistureSensorTable,
        createLightSensorTable : createLightSensorTable,
        createDefaultScreenTransitionStateTable : createDefaultScreenTransitionStateTable,
        insertDefaultTransitionState : insertDefaultTransitionState,
        createScreenTransitionStatusTable : createScreenTransitionStatusTable,
        insertDefaultTransitionStatus : insertDefaultTransitionStatus,
        createDefaultCityWeatherTable : createDefaultCityWeatherTable,
        insertDefaultCity : insertDefaultCity,
        createWeatherTable : createWeatherTable,
        insertDefaultWeatherData : insertDefaultWeatherData
    }, function(err, results){
        console.log(results);
    });
};  