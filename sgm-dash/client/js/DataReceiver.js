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

var client = new Paho.MQTT.Client("ws://iot.eclipse.org/ws", "");

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

  console.log("Received message topic : ", topic);
  var expression = new RegExp("([a-z0-9])+");
  var matchList = topic.match(/([a-z0-9])+/g);

  var objectId = "." + matchList[1] + " ." +matchList[2] + " #" + matchList[3];

  console.log("Filling with message element : ", objectId);

  var textToSend = parsePacket(message.payloadBytes);

  $(objectId).text(textToSend);
  var count = parseInt( $(objectId + 'Count').text(), 10);
  count = count + 1;
  $(objectId + 'Count').text(count);

  if(message.payloadBytes.length >= 14)
  {
    var rawDate = packetToUint32(message.payloadBytes, 10);
    var date = new Date(rawDate * 1000);
    $('#timestamp').text(date);
  }

}

function parsePacket(packet)
{
  var formattedValue =  (packetToUint32(packet, 0) / packetToUint16(packet, 4)).toFixed(2);
  var unitCode = packetToUint32(packet, 6);

  switch(unitCode)
  {
    case 0:
    formattedValue += ' hPa';
    break;

    case 1:
    formattedValue += ' Celsius';
    break;

    case 2:
    formattedValue += ' %';
    break;
  }

  return formattedValue;

}

function packetToUint32(packet, offset)
{
  var value = packet[offset];
  value += (packet[offset + 1] << 8);
  value += (packet[offset + 2] << 16);
  value += (packet[offset + 3] << 24);
  return value;
}

function packetToUint16(packet, offset)
{
  var value = packet[offset];
  value += (packet[offset + 1] << 8);
  return value;
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
