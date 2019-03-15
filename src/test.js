"use strict";

const {KNXClient, KNXTunnelSocket, KNXProtocol} = require("./index");

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
const wait = (t=3000) => {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, t);
    });
};

const discoverCB = (ip, port) => {
    const GROUP_ADDRESS = 1;
    console.log("Connecting to ", ip, port);
    const lampSwitch = new KNXProtocol.KNXAddress("1.1.15", GROUP_ADDRESS);
    const lampStatus = new KNXProtocol.KNXAddress("1.2.15", GROUP_ADDRESS);
    const ON = Buffer.alloc(1);
    ON.writeUInt8(1,0);
    const OFF = Buffer.alloc(1);
    OFF.writeUInt8(0,0);

    const knxSocket = new KNXTunnelSocket("1.1.100");
    knxSocket.connect(ip, port)
        .then(() => console.log("Connected through channel id ", knxSocket.channelID))
        .then(() => console.log("Reading lamp status"))
        .then(() => knxSocket.read(lampStatus))
        .then(buf => {
            if (buf !== undefined) {
                console.log("Lamp status:", buf.toString());
            }
        })
        .then(() => console.log("Sending lamp ON"))
        .then(() => knxSocket.write(lampSwitch, ON))
        .then(() => wait())
        .then(() => knxSocket.read(lampStatus))
        .then(buf => {
            if (buf !== undefined) {
                console.log("Lamp status:", buf.toString());
            }
        })
        .then(() => knxSocket.write(lampSwitch, OFF))
        .then(() => wait(1000))
        .then(() => knxSocket.read(lampStatus))
        .catch(err => {console.log(err);});
};