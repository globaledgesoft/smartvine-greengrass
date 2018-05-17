myModule.service('getDetails', function($http) {
    return {
        getTempGraph: function() {
            var req = {
                method: 'GET',
//                url: socketUrlAddress + "/getTemperatureGraphData"
                url: socketUrlAddress + "/getSensorGraphData?sensor=temperature_sensor"
            }
            return $http(req).then(function(response) {
                return response.data;
            });
        },
        getMoistureGraph: function() {
            var req = {
                method: 'GET',
//                url: socketUrlAddress + "/getMoistureGraphData"
                url: socketUrlAddress + "/getSensorGraphData?sensor=moisture_sensor"
            }
            return $http(req).then(function(response) {
                return response.data;
            });
        },
        getLightGraph: function() {
            var req = {
                method: 'GET',
//                url: socketUrlAddress + "/getLightGraphData"
                url: socketUrlAddress + "/getSensorGraphData?sensor=light_sensor"
            }
            return $http(req).then(function(response) {
                return response.data;
            });
        },
        updateScreenTransitionState: function() {
            var req = {
                method: 'GET',
                url: socketUrlAddress + "/updateScreenTransitionState?screenTransitionState=false"
            }
            return $http(req).then(function(response) {
                return response.data;
            });
        },
        getWeatherInfo: function() {
            var req = {
                method: 'GET',
                url: socketUrlAddress + "/getWeatherInfo"
            }
            return $http(req).then(function(response) {
                return response.data;
            });
        }
    }
});