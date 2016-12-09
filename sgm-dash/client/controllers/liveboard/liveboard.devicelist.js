liveBoardApp.controller('LiveboardController',function($scope, $http, $timeout, LiveData, TempPressChart, HumidChart)
  {

      $scope.totalMeasurementPoints = 0;
      $scope.tablesLoaded = 0;
      $scope.test = "69";
      var devChartList = [];
      var populateMeasurementTable = function(message, liveUpdateCallback)
      {
        if ($scope.devSpecList[message.devId].status == 'disabled')
        {
          return;
        }
        $scope.devSpecList[message.devId].measurements[message.target][message.quantity].lastTimestamp = moment(message.timestamp).format('MM/DD/YYYY HH:mm');
        $scope.devSpecList[message.devId].measurements[message.target][message.quantity].value = message.value;
        $scope.devSpecList[message.devId].measurements[message.target][message.quantity].msgCount += 1;

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
      }

      var initializeDeviceList = function(rawDeviceList)
      {
            $scope.devSpecList = [];

            rawDeviceList.forEach(function(device){
              $scope.devSpecList[device.id] = {status : device.status, measurements : []};
              devChartList[device.id] = [];

              if (device.status == 'disabled')
              {
                return;
              }

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
                if (!(measurementSpec.place in $scope.devSpecList[device.id].measurements))
                {
                  $scope.devSpecList[device.id].measurements[measurementSpec.place] = [];
                }
                $scope.devSpecList[device.id].measurements[measurementSpec.place][measurementSpec.quantity] = {value : 'n/a', msgCount : 0, lastTimestamp : 'n/a'};

              });
            });
      }

      var constructHistoryData = function(history)
      {
        for (var deviceId in devChartList)
        {
          if ($scope.devSpecList[deviceId].status == 'disabled')
          {
            continue;
          }
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
        var dataSet = [];

        queryResult.forEach(function(entry){
          dataSet.push({x : entry.timestamp, y : entry.value });
        });
        chartDescriptor.chart.preloadData(dataSet, key);
      }

      var fetchmeasurementData = function()
      {
        $http.get('/sgmeteo/recent')
        .then(function(recent){
          recent.data.forEach(function(measurement){
            populateMeasurementTable(measurement);
          });
          $scope.tablesLoaded = 1;
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
