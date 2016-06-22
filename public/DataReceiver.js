$(document).ready(
  function()
  {
    $("#connectButton").data("clicks", 0);
    $("#connectButton").click(onConnectButtonClick);
  }
);

function onConnectButtonClick()
{
  var clicks = $(this).data("clicks");

  if (0 == clicks)
  {
    connectToServer();
    clicks = 1;
    $("#connectButton").text("Connecting...");
  }
  else
  {
    try {
      disconnectFromServer();
    } catch (e) {

    } finally {

    }
    clicks = 0;
    $("#connectButton").text("Disconnected");
  }
  $(this).data("clicks", clicks);
}

var client = new Paho.MQTT.Client("ws://iot.eclipse.org/ws", "sgmClient");

function connectToServer()
{
  client.connect({onSuccess:onConnect});
}

function disconnectFromServer()
{
  client.disconnect();
}

function updateValue(message)
{
  var topic = message.destinationName;

  var topicArray = message.payloadBytes;

  console.log("Received message topic : ", topic);
  var expression = new RegExp("([a-z0-9])+");
  var matchList = topic.match(/([a-z0-9])+/g);

  var objectId = '.' + matchList[0] + "." + matchList[1] + " #" +matchList[2] + "." + matchList[3];

  console.log("Filling with message element : " objectId);

  $(document.getElementById(objectId)).text(message.payloadString);
}

function onConnect()
{
  client.onMessageArrived = updateValue;
  client.onConnectionLost = onConnectionEnd;
  var subscribeOptions = {
    qos: 1,  // QoS
    invocationContext: {foo: true},  // Passed to success / failure callback
    onSuccess: onSubscribeSuccess,
    onFailure: function(){alert("Could not subscribe to the topics!")},
    timeout: 10
  };

  client.subscribe("sgm/#", subscribeOptions);

  console.log("Waiting for messages...");
}

function onSubscribeSuccess()
{
  $("#connectButton").text("Connected");
  $("#connectButton").toggleClass("btn-success");
  $("#connectButton").toggleClass("btn-danger");
}

function onConnectionEnd()
{
  $("#connectButton").text("Disconnected");
  $("#connectButton").toggleClass("btn-success");
  $("#connectButton").toggleClass("btn-danger");
}
