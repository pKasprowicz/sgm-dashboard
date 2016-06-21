var mongoose = require('mongoose');
var Device = require('../models/device')

mongoose.connect('mongodb://127.0.0.1/devices');

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
    }
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
    }
    {
      place : "air",
      quantity : "humid"
    }
	]
}).save();