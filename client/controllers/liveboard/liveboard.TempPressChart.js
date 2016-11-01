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
                    text : 'Temperature and pressure over time'
                    },
                bindto: 'div#'+deviceId+'-chart-temppress',
                data: {
                    xs : {
                      press : 'press.t',
                      temp : 'temp.t'
                    },
                      axes : {
                        press: 'y',
                        temp: 'y2'
                      },
                    columns : [
                        ['press'],
                        ['press.t'],
                        ['temp'],
                        ['temp.t']
                    ],
                    names : {
                        press : "Pressure [hPa]",
                        temp : "Temperature [\u2103]"
                    },
                    colors : {
                      press : 'green',
                      temp : 'red'
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
                zoom : {
                    enabled : true
                }
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

            var timestampName = measurement.quantity + '.t';
            self.chart.flow(
                {
                    columns : [
                        [measurement.quantity, Number(measurement.value)],
                        [timestampName,      measurement.timestamp]
                    ],
                    length : 0
                }
            );

        };

        this.preloadData = function(dataX, dataY, key)
        {
            var y = [key];
            var x = [key+'.t'];
            y = y.concat(dataY);
            x = x.concat(dataX);
            self.chart.load(
                {
                    columns : [
                        x,
                        y,
                    ]
                }
            );

        };

    };

    return factory;

});