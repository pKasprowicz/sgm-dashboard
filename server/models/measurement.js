var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var measurementSchema = new Schema(
    {
      timestamp : Date,
      devId : String,
      quantity  : String,
      target    : String,
      value     : String,
      comment   : String
    }

  );

var MeasurementEntry = mongoose.model('measurement', measurementSchema);

module.exports = MeasurementEntry;