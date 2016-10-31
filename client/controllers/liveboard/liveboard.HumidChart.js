liveBoardApp.factory('HumidChart', function()
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
                title : {
                    text : 'Air Humidity in time'
                    },
                size : {
                    height: 180,
                },
                bindto: 'div#'+deviceId+'-chart-humid',
                data: {
                    x : 't1',
                    columns : [
                        ['humidity'],
                        ['t1'],
                    ],
                    names : {
                        humidity : "Air Humidity [%]",
                    },
                    colors : {
                        humidity : "blue"
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
                        min : 0,
                        max : 100,
                        show: true,
                        tick: {
                            format: d3.format("4.2f"),
                            values : [0, 50, 100]
                        },
                    },
                    y2 : {
                        min : 0,
                        max : 100,
                        show: true,
                        tick: {
                            format: d3.format("4.2f"),
                            values : [0, 50, 100]
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

            var timestampName = measurement.quantity + '.timestamp';
            self.chart.flow(
                {
                    columns : [
                        ['humidity', Number(measurement.value)],
                        ['t1', measurement.timestamp]
                    ],
                    length : 0
                }
            );

        };

        this.preloadData = function(dataX, dataY)
        {
            var y = ['humidity'];
            var x = ['t1'];

            y = y.concat(dataY);
            x = x.concat(dataX);

            self.chart.load(
                {
                    columns : [
                        x,
                        y
                    ]
                }
            );

        };

    };

    return factory;

});