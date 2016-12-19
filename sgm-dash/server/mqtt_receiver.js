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
    client = mqtt.connect(brokerUrl);

    client.on('connect', function ()
    {
        console.log('Receiver connected to ', brokerUrl);
        client.subscribe('sgm/#', function(err, granted){
            if (err == null)
            {
                console.log('Server\'s subscription accepted!');
            }
        });
    });
    
    client.on('message', function(topic, message, packet){
        console.log('MESSAGE!');
        callbacks.onMessageArrived(topic, message, packet);
    });
    
    client.on('packetreceive', function(packet){
        console.log('packetreceive event triggered!');
        console.log(packet);
    });
    
};

module.exports = {
    connect,
    brokerUrl,
    callbacks
};
