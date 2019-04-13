# knx-ip
Pure javascript implementation of KNXnet/IP protocol for Node.JS.

KNX-IP allows you to discover KNX gateways in your home installation and create a tunnel connection to
pass knx messages to read status of sensors (wind, sun, temperature,...), lamp switches, ... and 
also switch on/off lamps, send signals to stores, ...

###### Installation

Make sure your machine has Node.JS (version 6.x or greater) and do:
```
npm install knx-ip
```

#### Documentation

For more information, check the
[knx-ip documentation](http://www.gdnet.be/knx-ip/doc/)


#### Usage

Use the KNXClient class to discover existing KNX Gateways.
The KNXClient.startDiscovery(ip) function starts a new discovery on the interface
matching the specified ip address.  This process runs for 20 seconds.
The KNXClient will emit "discover" messages when a new knx gateway is discovered.

To send KNX messages to your knx home installation, first create a tunnel to your knx gateway.
A tunnel is created with the KNXTunnelSocket class.  The single argument is the knx bus address to use to connect
to the gateway (this should be a unique knx address in your environment).
Use this socket to connect() to the ip address of the knx gateway.
Once connected, you can read() the status of readable knx components and set the state of any knx 
writeable component.


In the example below, we attempt to discover the knx gateway using the KNXClient.startDiscovery function.
Once the gateway is identified, we setup a tunnel using the knxSocket.connect() method.
We then read the status (on or off) of a lamp with knx address 1.2.15 and then switch the lamp on,
read the status again before switching the lamp off.
 

```javascript
"use strict";

const {KNXClient, KNXTunnelSocket, KNXProtocol} = require("knx-ip");

const knxClient = new KNXClient();

knxClient.on("error", err => {
    if (err) {
        console.log(err);
    }
});

// Call discoverCB when a knx gateway has been discovered.
knxClient.on("discover",  info => {
    const [ip,port] = info.split(":");
    discoverCB(ip,port);
});

knxClient.on("ready", () => {
    console.log("Ready. Starting discovery");
});

// start auto discovery on interface with ip 192.168.1.99
knxClient.startDiscovery("192.168.1.99");

const wait = (t=3000) => {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, t);
    });
};

// Actions to perform when a KNX gateway has been discovered.
const discoverCB = (ip, port) => {
    const GROUP_ADDRESS = 1;
    console.log("Connecting to ", ip, port);
    // Create a knx addres for a lamp switch on knx bus address 1.1.15
    const lampSwitch = new KNXProtocol.KNXAddress("1.1.15", GROUP_ADDRESS);
    // Create a knx address for a lamp status associated with the above lamp switch
    const lampStatus = new KNXProtocol.KNXAddress("1.2.15", GROUP_ADDRESS);
    const ON = Buffer.alloc(1);
    ON.writeUInt8(1,0);
    const OFF = Buffer.alloc(1);
    OFF.writeUInt8(0,0);

    // Create tunnel socket with source knx address 1.1.100
    const knxSocket = new KNXTunnelSocket("1.1.100");
    // Connect to the knx gateway on ip:port
    knxSocket.connect(ip, port)
        .then(() => console.log("Connected through channel id ", knxSocket.channelID))
        .then(() => console.log("Reading lamp status"))
        .then(() => knxSocket.read(lampStatus))
        .then(buf => {
            if (buf !== undefined) {
                console.log("Lamp status:", buf.toString());
            }
        })
        .then(() => console.log("Turn lamp ON"))
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
```
```
$ node src/test.js 
Ready. Starting discovery
Connecting to  192.168.1.158 3671
Connected through channel id  43
Reading lamp status 
Lamp status: 0
Sending lamp ON
Lamp status: 1

```