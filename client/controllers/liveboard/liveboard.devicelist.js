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
              })
            });
        });

      $scope.lastTimestamp = "n/a";

      var liveDataProvider = new LiveData();
      liveDataProvider.processValChangeCallback = updateData;

// var chart = c3.generate({
//     bindto: 'div.chart',
//     data: {
//         columns: [
//             [],
//             []
//         ],
//         axes: {
//             data2: 'y2'
//         },
//     type : 'spline'
//     },
//     axis : {
//         y : {
//             tick: {
//                 format: d3.format("s")
//             }
//         },
//         y2: {
//             show: true,
//             tick: {
//                 format: d3.format("$")
//             }
//         }
//     }
// });

// setTimeout(function () {
//     chart.load({
//         columns: [
//                     ['data1', 30, 20, 10, 40, 15, 17],
//                     ['data2', 100, 200, 100, 40, 150, 250]
//                 ]
//     })
// }, 1000);

// setTimeout(function () {
//     chart.flow({
//         columns: [
//             ['data1', 111, 114],
//             ['data2', 300, 154]
//         ],
//         length : 0
//     });
// }, 3000);

  });
