angular.module('Liveboard', [])
  .controller('LiveboardController',function($scope, $http)
  {

      var updateData = function(topic, message)
      {

      }

      var testUpdate = function(val)
      {
        $scope.devList[0].measurements[0].value = val;

      }

      $scope.clicker = function()
      {
        testUpdate("5.6");
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

  });
