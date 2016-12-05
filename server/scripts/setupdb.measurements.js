var mongoose = require('mongoose');
var Measurement = require('../models/measurement')

var mongoDbUrl = 'sgm:sgm@ds025603.mlab.com:25603/dashboard';

console.log('Connecting to ', mongoDbUrl);

mongoose.connect(mongoDbUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

new Measurement({
  timestamp : new Date(Date.now()),
  quantity : "air",
  value : "25.0 Celsius",
  comment : "n/a"
}).save(function(err, product, numAffected){
  if(err)
  {
    console.log("Could not save object");
  }
});

