function initializeUi()
{
  $("#connectButton").data("clicks", 0);
  $("#connectButton").click(onConnectButtonClick);

  client.onMessageArrived = processMessage;
}

function processMessage()
{
  
}
