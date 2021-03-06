var packetDispatcher = {
    'measurement' : {
        parsePacket : function(topic, payload){}
    },
    'message' : {
        parsePacket : function(topic, payload){}
    },
    'test' : {
        parsePacket : function(topic, payload){}
    }
    };

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

var processIncomingMessage = function(topic, payload)
{
    console.log("Attempt to process", topic);

    try
    {
        var matchList = topic.match(/([a-zA-Z0-9])+/g);
    }
    catch(e)
    {
        console.log('Cannot parse message');
        return null;
    }

    console.log(matchList);
    var packetRoot = matchList[0];
    if (packetRoot != "sgm")
    {
        return null;
    }

    var retObj = {};
    retObj.devId = matchList[1];
    retObj.target = matchList[2];
    retObj.quantity = matchList[3];
    retObj.value = parsePacket(payload);

    console.log("retObj");
    console.log(retObj);

    var rawDate = packetToUint32(payload, 10);
    retObj.timestamp = new Date(rawDate * 1000);

    return retObj;
}



module.exports = {
    processIncomingMessage
}
