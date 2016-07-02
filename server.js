var express = require('express');
var app = express();
var server = require('http').Server(app);

app.use(express.static(__dirname + '/client/js'));
app.use(express.static(__dirname + '/client/controllers'));

var io = require('socket.io')(server);

var mqtt_broker = require('./server/scripts/mqtt_broker');
var Device = require('./server/models/device');

require('./routes.js')(app)

io.on('connection', function(socket){
  console.log('a user connected');
});

mqtt_broker.serverSettings.port = 1883;

mqtt_broker.callbacks.onMessagePublishedCallback = function(packet, client)
{
  console.log("Message published!");
  io.emit('val change', { for: 'everyone', packet });
  console.log(packet);
}

mqtt_broker.callbacks.onClientSubscribedCallback = function(topic, client)
{
  console.log("Subscribed to ", topic);
}

mqtt_broker.launchBroker();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

server.listen(server_port, server_ip_address, function()
{
	console.log("Server started on address ", server_ip_address, " on port ", server_port);
})
