var mongoose = require('mongoose');
var Device = require('../models/device')

var mongoDbUrl = '127.0.0.1:27017/devices';

if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  mongoDbUrl = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

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
}).save();

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
}).save();