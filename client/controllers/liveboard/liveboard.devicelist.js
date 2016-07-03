liveBoardApp.controller('LiveboardController',function($scope, $http, LiveData)
  {

      var updateData = function(incomingObject)
      {
          var message = incomingObject.message;
        $scope.devList.some(function(device){
            if (device.id == message.devId)
            {
                return device.measurements.some(function(measurement){
                    if ((measurement.place == message.target) && (measurement.quantity == message.quantity)){
                        measurement.value = message.value;
                        ++measurement.msgCount;
                        $scope.lastTimestamp = message.timestamp;
                        return true;
                    }
                });
            }
        });
          $scope.$apply();
      }

      // Get the model's data
      $http.get('/deviceList')
        .then(function(result)
        {
            $scope.devList = result.data;
            $scope.devList.forEach(function(device)
            {
              device.measurements.forEach(function(measurement)
              {
                  measurement.msgCount = 0;
                  measurement.value = 'n/a';
              })
            });
        });

      $scope.lastTimestamp = "n/a";

      var liveDataProvider = new LiveData();
      liveDataProvider.processValChangeCallback = updateData;

  });
