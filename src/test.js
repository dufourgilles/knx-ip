"use strict";

const {KNXClient, KNXTunnelSocket, KNXProtocol, Datapoints, DataPointType} = require("./index");

const knxClient = new KNXClient();

knxClient.on("error", err => {
    if (err) {
        console.log(err);
    }
});

knxClient.on("discover",  info => {
    const [ip,port] = info.split(":");
    discoverCB(ip,port);
});

knxClient.on("ready", () => {
    console.log("Ready. Starting discovery");
});

knxClient.startDiscovery("192.168.1.99");
const wait = (t=2000) => {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, t);
    });
};

const handleBusEvent = function(srcAddress, dstAddress, npdu) {
    console.log(`${srcAddress.toString()} -> ${dstAddress.toString()} :`, npdu.dataValue);
};

const discoverCB = (ip, port) => {
    console.log("Connecting to ", ip, port);
    const lampSwitchAddress = new KNXProtocol.KNXAddress("1.1.15", KNXProtocol.KNXAddress.TYPE_GROUP);
    const lampSwitch = new Datapoints.Switch(lampSwitchAddress);
    const lampStatus = new Datapoints.Switch(new KNXProtocol.KNXAddress("1.2.15", KNXProtocol.KNXAddress.TYPE_GROUP));

    const knxSocket = new KNXTunnelSocket("1.1.100");
    lampSwitch.bind(knxSocket);
    lampStatus.bind(knxSocket);
    knxSocket.connect(ip, port)
        .then(() => console.log("Connected through channel id ", knxSocket.channelID))
        .then(() => console.log("Reading lamp status"))
        .then(() => lampStatus.read())
        .then(val => console.log("Lamp status:", val))
        .then(() => console.log("Sending lamp ON"))
        .then(() => lampSwitch.setOn())
        .then(() => wait())
        .then(() => lampStatus.read())
        .then(val => console.log("Lamp status:", val))
        .then(() => lampSwitch.setOff())
        .then(() => wait(1000))
        .then(() => lampStatus.read())
        .then(val => console.log("Lamp status:", val))
        .then(() => {
            console.log("Starting bus monitoring");
            knxSocket.on("indication", handleBusEvent);
            knxSocket.monitorBus()
        })
        .then(() => wait(9000))
        .catch(err => {console.log(err);})
        .then(() => process.exit(0));
};