liveBoardApp.controller('LiveboardController',function($scope, $http, $timeout, LiveData, ChartGen)
  {

      $scope.totalMeasurementPoints = 0;

      var populateMeasurementTable = function(message, liveUpdateCallback)
      {
        $scope.devList.some(function(device){
            if (device.id == message.devId)
            {
              return device.measurements.some(function(measurement)
                {
                  if ((measurement.place == message.target) && (measurement.quantity == message.quantity))
                  {
                    measurement.value = message.value;
                    ++measurement.msgCount;

                    if (typeof(liveUpdateCallback) == 'function')
                    {
                      liveUpdateCallback(device, measurement);
                    }

                    return true;
                  }
                });
            }
        });
      }

      var updateChartAndTimestamp = function(device, measurement)
      {
        device.chart.appendMeasurement(measurement);
        $scope.lastTimestamp = Date(measurement.timestamp).toLocaleString();
      }

      var initializeDeviceList = function()
      {
            $scope.devList.forEach(function(device)
            {
              device.chart = new ChartGen(device.id);
              device.chart.generateChart();
              device.measurements.forEach(function(measurement)
              {
                  measurement.msgCount = 0;
                  measurement.value = 'n/a';
                  ++$scope.totalMeasurementPoints;
              })
            });

            $scope.lastTimestamp = "n/a";
      }

      // Get the model's data
      $http.get('/sgmeteo/deviceList')
        .then(function(result) {
          $scope.devList = result.data;
          initializeDeviceList();
        })
        .then(
        $http.get('/sgmeteo/recent')
        .then(function(recent){
          recent.data.forEach(function(measurement){
            populateMeasurementTable(measurement);
          });
          $scope.lastTimestamp = (new Date(recent.data[0].timestamp)).toLocaleString();
        })
        )
        .then(
        $http.get('/sgmeteo/history')
        .then(function(history){
          history.data.forEach(function(measurement){
            $scope.devList.some(function(device){
              if(device.id == measurement.devId)
              {
                device.chart.appendMeasurement(measurement);
              }
            })})
          })
        );

      var liveDataProvider = new LiveData();
      liveDataProvider.processValChangeCallback = function(measurement){
        populateMeasurementTable(measurement, updateChartAndTimestamp);
      }


  });
