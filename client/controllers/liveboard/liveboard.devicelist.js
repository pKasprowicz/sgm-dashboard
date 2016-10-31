liveBoardApp.controller('LiveboardController',function($scope, $http, $timeout, LiveData, TempPressChart, HumidChart)
  {

      $scope.totalMeasurementPoints = 0;
      var devChartList = [];
      var devHumidChartList = [];
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
        if ((measurement.quantity == 'press') ||
            (measurement.quantity == 'temp'))
        {
          devChartList[measurement.deviceId].appendMeasurement(measurement);
        }


        if (measurement.quantity == 'humid')
        {
          devHumidChartList[measurement.deviceId].appendMeasurement(measurement);
        }
        $scope.lastTimestamp = Date(measurement.timestamp).toLocaleString();
      }

      var initializeDeviceList = function(rawDeviceList)
      {
            $scope.devSpecList = [];

            rawDeviceList.forEach(function(device){
              $scope.devSpecList[device.id] = [];
              devChartList[device.id] = new TempPressChart(device.id);
              devChartList[device.id].generateChart();

              devHumidChartList[device.id] = new HumidChart(device.id);
              devHumidChartList[device.id].generateChart();

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

      var constructHistoryData = function(history)
      {
        var historyDataX = [];
        var historyDataY = [];
        var historyDataX2 = [];
        var historyDataY2 = [];
        var historyDataX3 = [];
        var historyDataY3 = [];
        history.forEach(function(measurement){
          if ((measurement.target=='air') && (measurement.quantity=='press'))
          {
            historyDataX.push(measurement.timestamp);
            historyDataY.push(measurement.value);
          }
          if ((measurement.target=='air') && (measurement.quantity=='temp'))
          {
            historyDataX2.push(measurement.timestamp);
            historyDataY2.push(measurement.value);
          }
          if ((measurement.target=='air') && (measurement.quantity=='humid'))
          {
            historyDataX3.push(measurement.timestamp);
            historyDataY3.push(measurement.value);
          }
        })
        devChartList['dev1'].preloadData(historyDataX, historyDataY, historyDataX2, historyDataY2);
        devHumidChartList['dev1'].preloadData(historyDataX3, historyDataY3);
      }

      var fetchmeasurementData = function()
      {
        $http.get('/sgmeteo/recent')
        .then(function(recent){
          recent.data.forEach(function(measurement){
            populateMeasurementTable(measurement);
          });
          $scope.lastTimestamp = (new Date(recent.data[0].timestamp)).toLocaleString();
        });

        $http.get('/sgmeteo/history')
        .then(function(history){
          constructHistoryData(history.data);
          });
      }

      // Get the model's data
      $http.get('/sgmeteo/deviceList')
        .then(function(result) {
          initializeDeviceList(result.data);
          fetchmeasurementData();
        });

      var liveDataProvider = new LiveData();
      liveDataProvider.processValChangeCallback = function(measurement){
        populateMeasurementTable(measurement, updateChartAndTimestamp);
      }


  });
