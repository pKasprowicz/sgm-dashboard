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

//MQTT broker initialization
var mqtt_broker = require('./server/mqtt_broker');
var mqtt_process = require('./server/mqtt_processing');

mqtt_broker.serverSettings.port = 1883;

io.on('conection', function(socket){
  console.log('User connected to socket');
});

mqtt_broker.callbacks.onMessagePublishedCallback = function(packet, client)
{
  console.log("Message published!");
  var message = mqtt_process.processIncomingMessage(packet);
  if (!message)
  {
    return;
  }
  measurementsDb.storeMeasurement(message);
  io.emit('val change', { for: 'everyone', message });
  console.log(packet);
}

mqtt_broker.callbacks.onClientSubscribedCallback = function(topic, client)
{
  console.log("Subscribed to ", topic);
}

mqtt_broker.launchBroker();

//Starting the web server

var server_port = 8081;
var server_ip_address = '127.0.0.1';

server.listen(server_port, server_ip_address, function()
{
	console.log("Server started on address ", server_ip_address, " on port ", server_port);
})
