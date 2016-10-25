liveBoardApp.factory('ChartGen', function()
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
                bindto: 'div#'+deviceId+'-chart',
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
                            format: '%Y-%m-%d %H:%M',
                            values : dates
                        },
                        localtime: true,
                        show: true,
                    },
                    y : {
                        min : 960,
                        max : 1140,
                        show: true,
                        tick: {
                            format: d3.format("4.2f")
                        },
                    },
                    y2: {
                        min: -30,
                        max: 40,
                        show: true
                    }
                },
                regions: [
                    {end : dates[0]},
                    {start : dates[1], end: dates[2]},
                    {start: dates[3]}
                    ]
            });

        };

        this.loadData = function(data)
        {
            var pressureValues = ['press'];
            var tempValues = ['temp'];

            var pressureTimestamps = ['press.timestamp'];
            var tempTimestamps = ['temp.timestamp'];

            pressureValues.concat(data.press_y);
            tempValues.concat(data.temp_y);
            pressureTimestamps.concat(data.press_x);
            tempTimestamps.concat(data.temp_x);

            self.chart.load(
                {
                    columns : [
                        pressureValues,
                        tempValues,
                        pressureTimestamps,
                        tempTimestamps
                        ]
                }
                );
        }

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

            // if(measurement.quantity == 'temp')
            // {
            //     return;
            // }

            var timestampName = measurement.quantity + '.timestamp';
            self.chart.flow(
                {
                    columns : [
                        [measurement.quantity, Number(measurement.value)],
                        [timestampName, measurement.timestamp]
                    ],
                    length: 0
                }
            );

        }
    }


    return factory;



});