liveBoardApp.controller('LiveboardController',function($scope, $http, $timeout, LiveData, ChartGen)
  {

      $scope.totalMeasurementPoints = 0;

      var SGM1Chart = new ChartGen('dev1');
      var SGM2Chart = new ChartGen('dev2');

      $timeout(function() {
        SGM1Chart.generateChart();
        SGM2Chart.generateChart();
      }, 1000);

      var updateData = function(incomingObject)
      {
        var message = incomingObject.message;
        return $scope.devList.some(function(device){
            if (device.id == message.devId)
            {
              return device.measurements.some(function(measurement)
                {
                  if ((measurement.place == message.target) && (measurement.quantity == message.quantity))
                  {
                    measurement.value = message.value;
                    ++measurement.msgCount;
                    $scope.lastTimestamp = message.timestamp;
                    return true;
                  }
                });
            }
        });
        // $scope.$apply();
      }

      var updateDataFromDb = function(entry)
      {
        return $scope.devList.some(function(device){
            if (device.id == entry.devId)
            {
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

      // Get the model's data
      $http.get('/sgmeteo/deviceList')
        .then(function(result)
        {
            $scope.devList = result.data;
            $scope.devList.forEach(function(device)
            {
              device.measurements.forEach(function(measurement)
              {
                  measurement.msgCount = 0;
                  measurement.value = 'n/a';
                  ++$scope.totalMeasurementPoints;
              })
            });
        });

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
        });

      $scope.lastTimestamp = "n/a";

      var liveDataProvider = new LiveData();
      liveDataProvider.processValChangeCallback = updateData;


  });
