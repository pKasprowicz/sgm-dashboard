var socket = io();


socket.on('val change', function(msg)
{
  console.log('Value changed');
  console.log(msg);
});
