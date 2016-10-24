var mongoose = require('mongoose');
var Measurements = require('./models/measurement');

var storeMeasurement = function(measurement)
{

    new Measurements.MeasurementEntry(
    {
        timestamp : measurement.timestamp,
        devId     : measurement.devId,
        quantity  : measurement.quantity,
        target    : measurement.target,
        value     : measurement.value,
        comment   : 'none'
    }
    ).save(function(err, product, numAffected){
        if(err)
        {
            console.log("Could not save object");
        }
    });

    new Measurements.LastMeasurementEntry(
    {
        timestamp : measurement.timestamp,
        devId     : measurement.devId,
        quantity  : measurement.quantity,
        target    : measurement.target,
        value     : measurement.value,
        comment   : 'none'
    }
    ).save(function(err, product, numAffected){
        if(err)
        {
            console.log("Could not save object");
        }
    });

}

var getMeasurementsHistory = function(resultCallback)
{
 var dateFilter = new Date();

 dateFilter.setDate(dateFilter.getDate() - 3);

 var historyQuery = Measurements.MeasurementEntry.find( {"timestamp" : { "$gte" : dateFilter} } ).sort({timestamp : 'descending'});
 historyQuery.exec(function(err, entries)
 {
    resultCallback(entries);
 });
}

var getRecentMeasurements = function(resultCallback)
{
 var historyQuery = Measurements.LastMeasurementEntry.find().sort({timestamp : 'descending'});
 historyQuery.exec(function(err, entries)
 {
    resultCallback(entries);
 });
}

module.exports =
{
    storeMeasurement,
    getMeasurementsHistory,
    getRecentMeasurements
}