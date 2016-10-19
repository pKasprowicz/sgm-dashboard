liveBoardApp.service('ChartGen', function()
{

    this.generateChart = function()
    {
      console.log("Generating chart!");
        var chart = c3.generate({
        bindto: 'div#dev1-chart',
        data: {
            columns: [
                [],
                []
            ],
            axes: {
                data2: 'y2'
            },
        type : 'spline'
        },
        axis : {
            y : {
                tick: {
                    format: d3.format("s")
                }
            },
            y2: {
                show: true,
                tick: {
                    format: d3.format("$")
                }
            }
        }
      });

      setTimeout(function () {
          chart.load({
              columns: [
                          ['data1', 30, 20, 10, 40, 15, 17],
                          ['data2', 100, 200, 100, 40, 150, 250]
                      ]
          })
      }, 0);

      setTimeout(function () {
          chart.flow({
              columns: [
                  ['data1', 111, 114],
                  ['data2', 300, 154]
              ],
              length : 0
          });
      }, 3000);
    }

});