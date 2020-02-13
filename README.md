
# knx-ip

Pure typescript implementation of KNXnet/IP protocol for Node.JS.

KNX-IP allows you to discover KNX gateways in your home installation and create a tunnel connection to
pass knx messages to read status of sensors (wind, sun, temperature,...), lamp switches, ...
also switch on/off lamps, send signals to stores, ...

WARNIG
This new version (0.0.18) is now written in typescript.
The classes remain the same but some methods/properties may have changed.

## Installation

Make sure your machine has Node.JS (version 6.x or greater) and do:

```bash
npm install knx-ip
```

## Documentation

For more information, check the
[knx-ip documentation](http://www.gdnet.be/knx-ip/doc/)

## Usage

Use the [KNXClient class](http://www.gdnet.be/knx-ip/doc/classes/_knxclient_.knxclient.html) to discover existing KNX Gateways.
The KNXClient.startDiscovery(ip) function starts a new discovery on the interface
matching the specified ip address.  This process runs for 20 seconds.
The KNXClient will emit "discover" messages when a new knx gateway is discovered.

To send KNX messages to your knx home installation, first create a tunnel to your knx gateway.
A tunnel is created with the [KNXTunnelSocket class](http://www.gdnet.be/knx-ip/doc/classes/_knxtunnelsocket_.knxtunnelsocket.html).  
The single argument is the knx bus address to use to connect
to the gateway (this should be a unique knx address in your environment).
Use this socket to connect() to the ip address of the knx gateway.
Once connected, you can read() the status of readable knx components and set the state of any knx 
writeable component.

In the example below, we attempt to discover the knx gateway using the KNXClient.startDiscovery function.
Once the gateway is identified, we setup a tunnel using the knxSocket.connect() method.
We then read the status (on or off) of a lamp with knx address 1.2.15 and then switch the lamp on,
read the status again before switching the lamp off.

```javascript


const {KNXClient, KNXTunnelSocket, KNXProtocol, DataPoints} = require("knx-ip");

const knxClient = new KNXClient();

knxClient.on(KNXClient.KNXClientEvents.error, err => {
    if (err) {
        console.log(err);
    }
});

// Call discoverCB when a knx gateway has been discovered.
knxClient.on(KNXClient.KNXClientEvents.discover,  info => {
    const [ip,port] = info.split(":");
    discoverCB(ip,port);
});

knxClient.on(KNXClient.KNXClientEvents.ready, () => {
    console.log("Ready. Starting discovery");
});

// start auto discovery on interface with ip 192.168.1.99
knxClient.startDiscovery("192.168.1.99");

const wait = (t=3000) => {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, t);
    });
};

const handleBusEvent = function(srcAddress, dstAddress, npdu) {
    console.log(`${srcAddress.toString()} -> ${dstAddress.toString()} :`, npdu.dataValue);
};

// Actions to perform when a KNX gateway has been discovered.
const discoverCB = (ip, port) => {
        console.log("Connecting to ", ip, port);
        // Create a knx address for a lamp switch on knx bus address 1.1.15
        const lampSwitchAddress = KNXProtocol.KNXAddress.createFromString("1.1.15", KNXProtocol.KNXAddress.TYPE_GROUP);
        // Create a Datapoint of type Switch to control the lamp
        const lampSwitch = new DataPoints.Switch(lampSwitchAddress);
        // Create a Datapoint of type Switch to read the lamp status
        // This time using the createDataPoint function
        const lampStatus = DataPoints.createDataPoint(
            KNXProtocol.KNXAddress.createFromString("1.2.15", KNXProtocol.KNXAddress.TYPE_GROUP),
            "Switch"
        );
        // Create tunnel socket with source knx address 1.1.100
        const knxSocket = new KNXTunnelSocket("1.1.100");
        // Bind the datapoints with the socket
        lampSwitch.bind(knxSocket);
        lampStatus.bind(knxSocket);
        // Connect to the knx gateway on ip:port
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
```

```bash
Ready. Starting discovery
Connecting to  192.168.1.158 3671
Connected through channel id  35
Reading lamp status
Lamp status: 0
Sending lamp ON
Lamp status: 1
Lamp status: 0
Starting bus monitoring
1.1.16 -> 9.1.2 : <Buffer 00 64>
1.1.16 -> 9.1.5 : <Buffer 42 d2 7c c8>
1.1.16 -> 9.1.6 : <Buffer 41 c0 bd 5d>
```
