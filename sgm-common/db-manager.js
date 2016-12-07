var mongoose = require('mongoose');
var Measurements = require('./models/measurement');
var Devices = require('./models/device');

var mongoDbUrl = 'sgm:sgm@ds025603.mlab.com:25603/dashboard';
mongoose.connect(mongoDbUrl);

const HistoryMeasurementsCount = 24;

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

    updateRecentMeasurement(measurement);

}

var updateRecentMeasurement = function(measurement)
{
    var queryParams = {
    };

    queryParams.devId = measurement.devId;
    queryParams.quantity = measurement.quantity;
    queryParams.target = measurement.target;

    Measurements.LastMeasurementEntry.find( queryParams ).remove().exec();


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

var getMeasurementsHistory = function(resultCallback, queryParameters)
{
    var dateFilter = new Date();

    dateFilter.setDate(dateFilter.getDate() - 5);

    var dateQuery = {"timestamp" : { "$gte" : dateFilter} };

    var historyQuery = {};

    if ('undefined' != queryParameters)
    {
        var queryParams = Object.assign(dateQuery, queryParameters)
        historyQuery = Measurements.MeasurementEntry.find( queryParams ).sort({timestamp : 'ascending'});
    }
    else
    {
         historyQuery = Measurements.MeasurementEntry.find( dateQuery ).sort({timestamp : 'ascending'});
    }

    console.log(queryParams);

    historyQuery.exec(function(err, entries)
    {
        resultCallback(entries.slice(entries.length - HistoryMeasurementsCount, entries.length));
    });
};

var getRecentMeasurements = function(resultCallback)
{
 var historyQuery = Measurements.LastMeasurementEntry.find().sort({timestamp : 'descending'});
 historyQuery.exec(function(err, entries)
 {
    resultCallback(entries);
 });
};

var getRegisteredPublishers = function(resultCallback)
{
    Devices.find({}, function(err, devices)
    {
        resultCallback(err, devices);
    })
};

module.exports =
{
    storeMeasurement,
    getMeasurementsHistory,
    getRecentMeasurements,
    getRegisteredPublishers
}