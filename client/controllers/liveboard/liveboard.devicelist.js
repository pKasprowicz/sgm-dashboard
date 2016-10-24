liveBoardApp.controller('LiveboardController',function($scope, $http, $timeout, LiveData, ChartGen)
  {

      $scope.totalMeasurementPoints = 0;

      var setTimeZone = function(dateString)
      {
        var date = new Date(dateString);
        return date.toLocaleDateString();
      }

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
                    $scope.lastTimestamp = Date(message.timestamp).toLocaleString();
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

      var populateFromDb = function(entry)
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
        .then(function(result)
        {
          $scope.devList = result.data;
          initializeDeviceList();
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

                if (populateFromDb(measurement))
                {
                  ++this.filledMeasurments;
                }

                if(this.filledMeasurments == $scope.totalMeasurementPoints)
                {
                  return true;
                }

              }, self);
            $scope.lastTimestamp = Date(result.data[0].timestamp).toLocaleString();
            })});

      var liveDataProvider = new LiveData();
      liveDataProvider.processValChangeCallback = updateData;


  });
