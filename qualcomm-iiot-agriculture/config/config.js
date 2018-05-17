module.exports = {
    dbConfig : {
        dialect: 'sqlite3',
        schemaName: "agriculture",
        connection: {
            filename: '../sqlite-db/data.db'
        }
    },
    port : 8090,
    cityName : 'Germany',
    weatherAppId : '86bd0c1173a7bdb42904832ef8f139f4'
}

