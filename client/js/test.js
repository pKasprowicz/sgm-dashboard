var drawChart = function()
        {
            console.log("Generating chart!");
            //Test section end
            this.chart = c3.generate(
            {
                bindto: 'div#chart',
                data: {
                    columns: [
                        ['press'],
                        ['temp'],
                        ['press.timestamp'],
                        ['temp.timestamp']
                    ],
                    xs: {
                        press: 'press.timestamp',
                        temp: 'temp.timestamp'
                    },
                    xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
                    type : 'spline',
                    axes : {
                        press : 'y',
                        temp : 'y2'
                    }
                },
                axis : {
                    x: {
                        type: 'timeseries',
                        tick: {
                                format: '%Y-%m-%d %H:%M'
                            }
                    },
                    y : {
                        show: true,
                        tick: {
                            format: d3.format("4.2f")
                        }
                    },
                    y2: {
                        show: true
                    }
                }
            });

        };

        var appendMeasurement = function(value)
        {
          var measTime = new Date();

          var valueToShow = Number(value);
          console.log(typeof(valueToShow));

            this.chart.flow(
                {
                    columns : [
                        ['press', valueToShow],
                        ['press.timestamp', measTime.toISOString()],
                    ],
                    length : 0
                }
            );

        }

drawChart();