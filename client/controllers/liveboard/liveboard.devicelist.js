liveBoardApp.controller('LiveboardController',function($scope, $http, $timeout, LiveData, ChartGen)
  {

      $scope.totalMeasurementPoints = 0;

      $timeout(function() {
        $scope.devList.forEach(function(device) {
            device.chart.generateChart();
        })
      }, 1000);

      var updateData = function(incomingObject)
      {
        var message = incomingObject.message;
        $scope.devList.some(function(device){
            if (device.id == message.devId)
            {
              return device.measurements.some(function(measurement)
                {
                  if ((measurement.place == message.target) && (measurement.quantity == message.quantity))
                  {
                    measurement.value = message.value;
                    ++measurement.msgCount;
                    $scope.lastTimestamp = message.timestamp;
                    if(device.chart != 'undefined')
                    {
                      device.chart.appendMeasurement(message);
                    }
                    return true;
                  }
                });
            }
        });
        $scope.$apply();
      }

      var updateDataFromDb = function(entry)
      {
        return $scope.devList.some(function(device){
            if (device.id == entry.devId)
            {
              device.chart.appendMeasurement(entry);
              return device.measurements.some(function(measurement)
                {
                  if ((measurement.place == entry.target)
                      && (measurement.quantity == entry.quantity)
                      && (measurement.msgCount == 0))
                  {
                    (measurement.msgCount == 0)
                    measurement.value = entry.value;
                    ++measurement.msgCount;
                    // $scope.lastTimestamp = entry.timestamp;
                    return true;
                  }
                });
            }
        });
        $scope.$apply();
      }

      var renderDeviceList = function()
      {
            $scope.devList.forEach(function(device)
            {
              device.chart = new ChartGen(device.id);
              device.measurements.forEach(function(measurement)
              {
                  measurement.msgCount = 0;
                  measurement.value = 'n/a';
                  ++$scope.totalMeasurementPoints;
              })
            });
      }

      // Get the model's data
      $http.get('/sgmeteo/deviceList')
        .then(function(result)
        {
          $scope.devList = result.data;
          renderDeviceList();
        }
        ).then(function()
        {
          //Get recent measurements
          $http.get('/sgmeteo/history')
            .then(function(result)
            {
              var self = this;
              result.data.some(function(measurement)
              {

                if (updateDataFromDb(measurement))
                {
                  ++this.filledMeasurments;
                }

                if(this.filledMeasurments == $scope.totalMeasurementPoints)
                {
                  return true;
                }

              }, self);
            })});

      $scope.lastTimestamp = "n/a";

      var liveDataProvider = new LiveData();
      liveDataProvider.processValChangeCallback = updateData;


  });
