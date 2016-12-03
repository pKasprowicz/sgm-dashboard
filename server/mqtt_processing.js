function parsePacket(packet)
{
    var formattedValue =  (packetToUint32(packet, 0) / packetToUint16(packet, 4)).toFixed(2);
    var unitCode = packetToUint32(packet, 6);

    switch(unitCode)
    {
        // case 0:
        //     formattedValue += ' hPa';
        //     break;

        // case 1:
        //     formattedValue += ' Celsius';
        //     break;

        // case 2:
        //     formattedValue += ' %';
        //     break;
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

var processIncomingMessage = function(packet, sendingClient)
{
    var topic = packet.topic;
    var payload = packet.payload;
    console.log("Attempt to process packet", packet);

    var matchList = topic.match(/([a-z0-9])+/g);

    var packetRoot = matchList[0];
    if (packetRoot != "sgm")
    {
        return null;
    }

    var retObj = {};
    retObj.devId = sendingClient.id;
    retObj.target = matchList[1];
    retObj.quantity = matchList[2];
    retObj.value = parsePacket(payload);

    var rawDate = packetToUint32(payload, 10);
    retObj.timestamp = new Date(rawDate * 1000);

    return retObj;
}



module.exports = {
    processIncomingMessage
}
