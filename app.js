//Initializing server
var express = require('express');
var app = express();
var server = require('http').Server(app);
var bodyParser = require('body-parser')

app.use(express.static(__dirname + '/client/js'));
app.use(express.static(__dirname + '/client/controllers'));
app.use(express.static(__dirname + '/client/css'));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

//Setting routes for express server
require('./server/routes.js')(app)

var measurementsDb = require('./server/db_manager.js');

//Socket io initialization
var io = require('socket.io')(server);

var mqttReceiver = require('./server/mqtt_receiver');
var mqtt_process = require('./server/mqtt_processing');


io.on('conection', function(socket){
  console.log('User connected to socket');
});

mqttReceiver.callbacks.onMessageArrived = function(topic, message, packet)
{
  console.log("Message arrived!");
  var measurement = mqtt_process.processIncomingMessage(message);
  if (!measurement)
  {
    return;
  }
  measurementsDb.storeMeasurement(measurement);
  io.emit('val change', { for: 'everyone', measurement });
}

mqttReceiver.connect();

//Starting the web server

console.log("Starting server in ", process.env.NODE_ENV, " environment")

var server_port = process.env.PORT;
var server_ip_address = '127.0.0.1';

server.listen(server_port, server_ip_address, function()
{
	console.log("Server started on address ", server_ip_address, " on port ", server_port);
})
