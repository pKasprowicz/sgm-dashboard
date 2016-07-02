angular.module('Liveboard',[])
  .controller('LiveboardController', function($scope)
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

      $scope.devList =
      [
        { id : "dev1",
          loc : "Villa Hubertus",
          measurements : [
            { place : "air",
              quantity : "temp",
              value : 7,
              msgCount : 0
            },
            { place : "air",
              quantity : "press",
              value : "n/a",
              msgCount : 0
            },
            { place : "air",
              quantity : "humid",
              value : "n/a",
              msgCount : 0
            }
          ]
        },

        { id : "dev2",
          loc : "Plac treningowy",
          measurements : [
            { place : "air",
              quantity : "temp",
              value : "n/a",
              msgCount : 0
            },
            { place : "air",
              quantity : "press",
              value : "n/a",
              msgCount : 0
            },
            { place : "air",
              quantity : "humid",
              value : "n/a",
              msgCount : 0
            }
          ]
        }

      ];
  })
