var mosca = require('mosca');

var serverSettings =
{
  port: 1883,
  backend : pubsubsettings
}

var pubsubsettings = {
  type: 'mqtt',
  json: false,
  mqtt: require('mqtt'),
  host: '127.0.0.1',
  port: 1883
};

var callbacks =
{
  onMessagePublishedCallback : function(packet, client){},
  onClientSubscribedCallback : function(topic, client){},
}

var onServerReady = function()
{
  console.log('Mosca server started on port', serverSettings.port);
}

var launchBroker = function()
{
  var server = new mosca.Server(serverSettings);

  server.on('ready', onServerReady);
  server.on('clientConnected', function(client)
{
  console.log('Client connected!');
});

  server.on('published', callbacks.onMessagePublishedCallback);
  server.on('subscribed', callbacks.onClientSubscribedCallback);
}

module.exports =
{
  serverSettings,
  pubsubsettings,
  launchBroker,
  callbacks

}
