var mongoose = require('mongoose');
var Device = require('../models/device')

var mongoDbUrl = 'admin:***REMOVED***@ds025603.mlab.com:25603/dashboard';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  mongoDbUrl = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

console.log('Connecting to ', mongoDbUrl);

mongoose.connect(mongoDbUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

new Device({
	id : "DEV1",
	loc : "Villa Hubertus",
	measurements : [
    {
      place : "air",
      quantity : "temp"
    },
    {
      place : "air",
      quantity : "press"
    },
    {
      place : "air",
      quantity : "humid"
    }
	]
}).save(function(err, product, numAffected){
  if(err)
  {
    console.log("Could not save object");
  }
});

new Device({
	id : "DEV2",
	loc : "Brama Romet Red Line",
	measurements : [
    {
      place : "air",
      quantity : "temp"
    },
    {
      place : "air",
      quantity : "press"
    },
    {
      place : "air",
      quantity : "humid"
    }
	]
}).save(function(err, product, numAffected){
  if(err)
  {
    console.log("Could not save object");
  }
});
