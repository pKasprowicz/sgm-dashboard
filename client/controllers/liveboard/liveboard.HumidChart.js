/*global moment*/
/*global liveBoardApp*/
/*global Chart*/
liveBoardApp.factory('HumidChart', function()
{

    var factory = function(deviceId)
    {
        this.chartCanvas = document.getElementById(deviceId + '-chart-humid').getContext('2d');
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
                        id: 'humid',
                        type: 'linear',
                        position: 'left',
                        scalePositionLeft: true,
                        ticks : {
                            min : 0,
                            max : 100,
                            fontColor : "rgba(31, 112, 201, 1)",
                        },
                    },
                    {
                        id: 'humid2',
                        type: 'linear',
                        position: 'right',
                        scalePositionLeft: false,
                        ticks : {
                            min : 0,
                            max : 100,
                            fontColor : "rgba(31, 112, 201, 1)",
                        },
                    },
                ],
            }
        };

        this.chartData = {
            datasets : [
                {
                    data : [],
                    label : 'Humidity [%]',
                    backgroundColor: "rgba(31, 112, 201, 0.4)",
                    borderColor: "rgba(31, 112, 201, 1)",
                    borderCapStyle: 'butt',
                    yAxisID : 'humid',
                    fill : false,
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

            this.chartData.datasets[0].data.unshift({
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

            this.chartData.datasets[0].data = dataSet;
            this.chart.update();

        };

    };

    return factory;

});