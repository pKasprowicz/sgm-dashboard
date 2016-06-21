$(document).ready(
  function()
  {
    $("#connectButton").data("clicks", 0);
    $("#connectButton").click(onConnectButtonClick);
  }
);