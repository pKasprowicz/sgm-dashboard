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

var Device = mongoose.model('Device', deviceSchema);

module.exports = Device;