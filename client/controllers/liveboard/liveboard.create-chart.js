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

        for (var i=dates.length; i>2; --i)
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
            console.log("Generating chart!");

            var dates = prepareRegions();

            var dateRegions = [
                {axis : 'x', end : dates[0]},
                {axis : 'x', start : dates[1], end : dates[2]},
                {axis : 'x', start : dates[3]}
            ];

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
                    type : 'line',
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
                            values: dateRegions
                        },
                        show: true,
                    },
                    y : {
                        min : 960,
                        max : 1140,
                        show: true,
                        tick: {
                            format: d3.format("4.2f")
                        }
                    },
                    y2: {
                        min: -30,
                        max: 40,
                        show: true
                    }
                },
                regions: dateRegions
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