var mqttBroker = require('./mqtt_broker');
var dbManager = require('../server/db_manager');
var mongoose = require('mongoose');

mqttBroker.serverSettings.port = 1883;

var mongoDbUrl = 'admin:***REMOVED***@ds025603.mlab.com:25603/dashboard';

mongoose.connect(mongoDbUrl);

var allowedPublishers = [];

dbManager.getRegisteredPublishers(function(devices)
{
    devices.forEach(function(device)
    {
        allowedPublishers.push(device.id);
    });
    console.log('ALLOWED PUBLISHERS: ');
    console.log(allowedPublishers);
});

mqttBroker.callbacks.onMessagePublishedCallback = function(topic, client)
{
    //check if this is the new connection
    if (client)
    {
        console.log("PUBLISHED");
        console.log("client id : ", client.id);
        console.log("topic  : ", topic.topic);
        console.log("payload  : ", topic.payload);
    }
};

mqttBroker.callbacks.onClientSubscribedCallback = function(topic, client)
{
    console.log("SUBSCRIPTION");
    console.log("client : ", client.id);
    console.log("topic  : ", topic);
};

mqttBroker.callbacks.authPublish = function(client, topic, payload, callback)
{
    if(allowedPublishers.indexOf(client.id) != -1)
    {
        console.log(client.id, ' published message');
        callback(null, true);
    }
    else
    {
        console.warn('Publisher with id ', client.id, 'not allowed');
        callback(null, false);
    }
};

mqttBroker.launchBroker();