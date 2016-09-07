//Initializing server
var express = require('express');
var app = express();
var server = require('http').Server(app);
app.use(express.static(__dirname + '/client/js'));
app.use(express.static(__dirname + '/client/controllers'));
app.use(express.static(__dirname + '/client/css'));


//Setting routes for express server
require('./routes.js')(app)

//Socket io initialization
var io = require('socket.io')(server);

//MQTT broker initialization
var mqtt_broker = require('./server/scripts/mqtt_broker');
var mqtt_process = require('./mqtt_processing');

mqtt_broker.serverSettings.port = 1883;

io.on('conection', function(socket){
  console.log('User connected to socket');
});

mqtt_broker.callbacks.onMessagePublishedCallback = function(packet, client)
{
  console.log("Message published!");
  message = mqtt_process.processIncomingMessage(packet);
  if (!message)
  {
    return;
  }
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
