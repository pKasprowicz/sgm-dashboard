var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var deviceSchema = new Schema(
      {
        id: String,
        loc: String,
        measurements :
        [
          {
            place : String,
            quantity : String
          }
        ]

      });

var DeviceEntry = mongoose.model('Device', deviceSchema);

module.exports = DeviceEntry;