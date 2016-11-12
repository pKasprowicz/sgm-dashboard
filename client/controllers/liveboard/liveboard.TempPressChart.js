/*global moment*/
/*global liveBoardApp*/
/*global Chart*/
liveBoardApp.factory('TempPressChart', function()
{

    var factory = function(deviceId)
    {
        var keyDataSetMap = [];
        keyDataSetMap['press'] = 0;
        keyDataSetMap['temp'] = 1;

        this.chartCanvas = document.getElementById(deviceId + '-chart-temppress').getContext('2d');
        this.timeFormat = 'MM/DD/YYYY HH:mm';

        this.chartOptions = {
            tooltips : {
                mode : 'x-axis',
                titleFontFamily : 'monospace',
                bodyFontFamily : 'monospace',
            },
            scales: {
                xAxes: [
                    {
        				type: "time",
        				time: {
        					format: this.timeFormat,
        				},
        				scaleLabel: {
        					display: true,
        				}
			        }
    			],
    			yAxes: [
                    {
                        id: 'press',
                        type: 'linear',
                        position: 'left',
                        scalePositionLeft: true,
                        ticks : {
                            min : 960,
                            max : 1140,
                            fontColor : "rgba(114, 159, 44, 1)",
                        },
                    },
                    {
                        id: 'temp',
                        type: 'linear',
                        position: 'right',
                        scalePositionLeft: false,
                        ticks : {
                            min: -30,
                            max: 40,
                            fontColor : "rgba(215,40,40,1)",
                        },
                    },
                ],
            }
        };

        this.chartData = {
            datasets : [
                {
                    data : [],
                    label : 'Pressure [hPa]',
                    backgroundColor: "rgba(114, 159, 44, 0.4)",
                    borderColor: "rgba(114, 159, 44, 1)",
                    borderCapStyle: 'butt',
                    yAxisID : 'press',
                    fill : false,
                },
                {
                    data : [],
                    label : 'Temperature [\u2103]',
                    backgroundColor: "rgba(215,40,40,0.4)",
                    borderColor: "rgba(215,40,40,1)",
                    borderCapStyle: 'butt',
                    yAxisID : 'temp',
                    fill : false
                },
            ]
        }

        this.generateChart = function()
        {
            this.chart = new Chart(this.chartCanvas, {
                type: 'line',
                data: this.chartData,
                options : this.chartOptions,
            });

        };

        this.appendMeasurement = function(measurement)
        {
            if (!this.chart)
            {
                console.error('Cannot append data to unexisting chart');
                return;
            }

            this.chartData.datasets[keyDataSetMap[measurement.quantity]].data.push({
                x : moment(measurement.timestamp).format(this.timeFormat),
                y : measurement.value
            });

            this.chart.update();

        };

        this.preloadData = function(dataSet, key)
        {
            dataSet.forEach(function(entry){
                entry.x = moment(entry.x).format(this.timeFormat);
            }, this);

            this.chartData.datasets[keyDataSetMap[key]].data = dataSet;
            this.chart.update();

        };

    };

    return factory;

});