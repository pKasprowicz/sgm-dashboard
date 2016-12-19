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
  host: '0.0.0.0',
  port: 1883
};

var callbacks =
{
  onMessagePublishedCallback : function(packet, client){},
  onClientSubscribedCallback : function(topic, client){},
  authPublish : function(client, topic, callback){}
}

var onServerReady = function()
{
  console.log('Mosca server started on port', serverSettings.port);
}

var onClientConnected = function(client)
{
  console.log("CONNECTED");
  console.log("client id : ", client.id);
}

var onClientDisonnected = function(client)
{
  console.log("DISCONNECTED");
  console.log("client id : ", client.id);
}

var launchBroker = function()
{
  var server = new mosca.Server(serverSettings);

  server.authorizePublish = callbacks.authPublish;

  server.on('ready', onServerReady);
  server.on('clientConnected', onClientConnected);
  server.on('clientDisconnected', onClientDisonnected);

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
