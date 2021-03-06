const mqtt = require('mqtt');
var dns = require('dns');
var client = {};

var brokerUrl = 'mqtt://broker';

var callbacks = {
    onMessageArrived : function(topic, message, packet){},
};

var connect = function()
{
    console.log('Connecting to ', brokerUrl);

    if (callbacks.onMessageArrived == {})
    {
        console.error("No callback for message event!");
        return;
    }
    client = mqtt.connect(brokerUrl, {qos : 2, clientId : "SGMserver-" + Math.random().toString(16).substr(2, 8)});

    client.on('connect', function ()
    {
        console.log('Receiver connected to ', brokerUrl);
        client.subscribe('sgm/#',{qos : 2});
    });
    client.on('message', function(topic, message, packet){
        callbacks.onMessageArrived(topic, message, packet);
    });
};

module.exports = {
    connect,
    brokerUrl,
    callbacks
};
