var dbManager = require('db-manager');

var MeasurementsLUT = [];

MeasurementsLUT['press']    = {desc : 'Cisnienie',   unit : 'hPa'};
MeasurementsLUT['temp']     = {desc : 'Temperatura', unit : 'C'};
MeasurementsLUT['humid']    = {desc : 'Wilgotność',  unit : '%'};

var getWeather = function()
{
    var weather = [];
    dbManager.getRegisteredPublishers(function(entries)
    {
        entries.forEach(function(entry)
        {
            if(entry.status != 'diabled')
            {
                return;
            }
            weather[entry.id] = {'location' : entry.loc, 'measurements' : []};
        });
    });
    
    dbManager.getRecentMeasurements(function(measurements)
    {
        measurements.forEach(function(measurement)
        {
           weather[measurement.devId].measurements.push(
               {
                   'description' : MeasurementsLUT[measurement.quantity].desc,
                   'value' : measurement.value + ' ' + MeasurementsLUT[measurement.quantity].unit
                   
               });
        });
    })
    
    return weather;
}

module.exports = {
    getWeather
}