liveBoardApp.controller('LiveboardController',function($scope, $http, $timeout, LiveData, ChartGen)
  {

      $scope.totalMeasurementPoints = 0;

      var populateMeasurementTable = function(message, liveUpdateCallback)
      {
        $scope.devSpecList[message.devId][message.target][message.quantity].value = message.value;
        $scope.devSpecList[message.devId][message.target][message.quantity].msgCount += 1;

        if (typeof(liveUpdateCallback) == 'function')
        {
          liveUpdateCallback(message);
        }

      }

      var updateChartAndTimestamp = function(measurement)
      {
        $scope.devChartList[measurement.deviceId].appendMeasurement(measurement);
        $scope.lastTimestamp = Date(measurement.timestamp).toLocaleString();
      }

      var initializeDeviceList = function(rawDeviceList)
      {
            $scope.devSpecList = [];
            $scope.devChartList = [];

            rawDeviceList.forEach(function(device){
              $scope.devSpecList[device.id] = [];
              $scope.devChartList[device.id] = new ChartGen(device.id);
              $scope.devChartList[device.id].generateChart();

              device.measurements.forEach(function(measurementSpec){
                if (!(measurementSpec.place in $scope.devSpecList[device.id]))
                {
                  $scope.devSpecList[device.id][measurementSpec.place] = [];
                }
                $scope.devSpecList[device.id][measurementSpec.place][measurementSpec.quantity] = {value : 'n/a', msgCount : 0};

              });
            });

            $scope.lastTimestamp = "n/a";
      }

      // Get the model's data
      $http.get('/sgmeteo/deviceList')
        .then(function(result) {
          initializeDeviceList(result.data);
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
            $scope.devChartList[measurement.devId].appendMeasurement(measurement);
          })
        })
      );

      var liveDataProvider = new LiveData();
      liveDataProvider.processValChangeCallback = function(measurement){
        populateMeasurementTable(measurement, updateChartAndTimestamp);
      }


  });
