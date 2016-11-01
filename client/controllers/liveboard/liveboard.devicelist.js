liveBoardApp.controller('LiveboardController',function($scope, $http, $timeout, LiveData, TempPressChart, HumidChart)
  {

      $scope.totalMeasurementPoints = 0;
      var devChartList = [];
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
        devChartList[measurement.devId].some(function(chartDescriptor){
          if (chartDescriptor.values.includes(measurement.quantity))
          {
            chartDescriptor.chart.appendMeasurement(measurement);
            return true;
          }
        });
        $scope.lastTimestamp = Date(measurement.timestamp).toLocaleString();
      }

      var initializeDeviceList = function(rawDeviceList)
      {
            $scope.devSpecList = [];

            rawDeviceList.forEach(function(device){
              $scope.devSpecList[device.id] = [];
              devChartList[device.id] = [];

              var tempPressDescriptor = {
                chart : new TempPressChart(device.id),
                values : ['temp', 'press'],
              }

              var humidDescriptor = {
                chart : new HumidChart(device.id),
                values : ['humid'],
              }

              tempPressDescriptor.chart.generateChart();
              humidDescriptor.chart.generateChart();

              devChartList[device.id].push(tempPressDescriptor);
              devChartList[device.id].push(humidDescriptor);

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
        for (var deviceId in devChartList)
        {
          devChartList[deviceId].forEach(function(chartDescriptor){
            chartDescriptor.values.forEach(function(dataSet){
              $http.post('/sgmeteo/history', {devId : deviceId, target : 'air', quantity : dataSet})
              .then(function(result){
                parseHistoryData(chartDescriptor, dataSet, result.data);
              })
            });
          });
        }

      }

      var parseHistoryData = function(chartDescriptor, key, queryResult)
      {
        var xData = [];
        var yData = [];

        queryResult.forEach(function(entry){
          xData.push(entry.timestamp);
          yData.push(entry.value);
        });
        chartDescriptor.chart.preloadData(xData, yData,key);
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

      }

      // Get the model's data
      $http.get('/sgmeteo/deviceList')
        .then(function(result) {
          initializeDeviceList(result.data);
          fetchmeasurementData();
          constructHistoryData();
        });

      var liveDataProvider = new LiveData();
      liveDataProvider.processValChangeCallback = function(measurement){
        populateMeasurementTable(measurement, updateChartAndTimestamp);
        $scope.$apply();
      }

  });
