liveBoardApp.factory('TempPressChart', function()
{

    var prepareRegions = function()
    {
        var dates = [];

        for(var i = 0; i < 4; ++i)
        {
            dates.push(new Date());
            dates[i].setHours(0);
            dates[i].setMinutes(0);
            dates[i].setSeconds(0);
            dates[i].setMilliseconds(0);
        }

        for (var i=dates.length; i>1; --i)
        {
            dates[i-2].setDate(dates[i-1].getDate() - 1);
        }
        console.log(dates);
        return dates;
    }

    var factory = function(deviceId)
    {
        var self = this;
        this.generateChart = function()
        {
            var dates = prepareRegions();

            self.chart = c3.generate(
            {
                size : {
                    height: 180,
                },
                title : {
                    text : 'Temperature and pressure in time'
                    },
                bindto: 'div#'+deviceId+'-chart-temppress',
                data: {
                    xs : {
                      pressure : 't1',
                      temperature : 't2'
                    },
                      axes : {
                        pressure: 'y',
                        temperature: 'y2'
                      },
                    columns : [
                        ['pressure'],
                        ['t1'],
                        ['temperature'],
                        ['t2']
                    ],
                    names : {
                        pressure : "Pressure [hPa]",
                        temperature : "Temperature [\u2103]"
                    },
                    colors : {
                      pressure : 'green',
                      temperature : 'red'
                    },
                    xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
                    type : 'spline',
                },
                axis : {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%Y-%m-%d %H:%M',
                            count : 5
                            // values : dates
                        },
                        show: true,
                    },
                    y : {
                        min : 960,
                        max : 1060,
                        show: true,
                        tick: {
                            format: d3.format("4.2f"),
                            values : [960, 1000, 1060]
                        },
                    },
                    y2 : {
                        min : -40,
                        max : 40,
                        show: true,
                        tick: {
                            format: d3.format("4.2f"),
                            values : [-40, -20, 0, 20, 40]
                        },
                    },
                },
                // regions: [
                //     {end : dates[0]},
                //     {start : dates[1], end: dates[2]},
                //     {start: dates[3]}
                //     ]
            });

        };

        this.appendMeasurement = function(measurement)
        {
            if (!self.chart)
            {
                console.error('Cannot append data to unexisting chart');
                return;
            }

            if(measurement.quantity == 'humid')
            {
                return;
            }

            if(measurement.quantity == 'temp')
            {
                return;
            }

            var timestampName = measurement.quantity + '.timestamp';
            self.chart.flow(
                {
                    columns : [
                        ['y', Number(measurement.value)],
                        ['x', measurement.timestamp]
                    ],
                    length : 0
                }
            );

        };

        this.preloadData = function(dataX, dataY, dataX2, dataY2)
        {
            var y = ['pressure'];
            var x = ['t1'];
            var y2 = ['temperature'];
            var x2 = ['t2'];
            y = y.concat(dataY);
            x = x.concat(dataX);
            y2 = y2.concat(dataY2);
            x2 = x2.concat(dataX2);
            self.chart.load(
                {
                    columns : [
                        x,
                        y,
                        x2,
                        y2
                    ]
                }
            );

        };

    };

    return factory;

});