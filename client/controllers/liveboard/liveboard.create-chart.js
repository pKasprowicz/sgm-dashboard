liveBoardApp.factory('ChartGen', function()
{

    var factory = function(deviceId)
    {
        var self = this;
        this.generateChart = function()
        {
            console.log("Generating chart!");
            //Test section end
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

        this.appendMeasurement = function(measurement)
        {
            if (!self.chart)
            {
                console.error('Cannot append data to unexisting chart');
                return;
            }

            if((measurement.quantity == 'humid') || (measurement.quantity == 'temp'))
            {
                return;
            }

            console.log(measurement);
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