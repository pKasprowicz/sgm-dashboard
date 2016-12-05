const mqtt = require('mqtt');
var client = {};

var brokerUrl = 'mqtt://127.0.0.1';

var callbacks = {
    onMessageArrived : function(topic, message, packet){},
};

var connect = function()
{
    if (callbacks.onMessageArrived == {})
    {
        console.error("No callback for message event!");
        return;
    }
    client = mqtt.connect(brokerUrl);

    client.on('connect', function ()
    {
        console.log('Receiver connected to ', brokerUrl);
        client.subscribe('sgm');
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