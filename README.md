
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


const {KNXTunnelSocket, DataPoints, KNXAddress} = require("knx-ip");

// Create tunnel socket with source knx address 1.1.100
const knxClient = new KNXTunnelSocket("1.1.100");

knxClient.on(KNXTunnelSocket.KNXTunnelSocketEvents.error, err => {
    if (err) {
        console.log(err);
    }
});

// Call discoverCB when a knx gateway has been discovered.
knxClient.on(KNXTunnelSocket.KNXTunnelSocketEvents.discover,  info => {
    const [ip,port] = info.split(":");
    discoverCB(ip,port);
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
        const lampSwitchAddress =  KNXAddress.createFromString("1.1.15", KNXAddress.TYPE_GROUP);
        const dateAddress = KNXAddress.createFromString("9.1.11", KNXAddress.TYPE_GROUP);
        const bsoHallAddresss =  KNXAddress.createFromString("2.6.4", KNXAddress.TYPE_GROUP);
        // Create a Datapoint of type Switch to control the lamp
        const lampSwitch = DataPoints.createDataPoint(lampSwitchAddress, "Switch");
        // Create a Datapoint of type Switch to read the lamp status
        // This time using the createDataPoint function
        const lampStatus = new DataPoints.Switch(
            KNXAddress.createFromString("1.2.15", KNXAddress.TYPE_GROUP)
        );
        const dateStatus = new DataPoints.Date(dateAddress);
        const bsoHall = new DataPoints.Percentage(bsoHallAddresss);
        // Bind the datapoints with the socket
        lampSwitch.bind(knxClient);
        lampStatus.bind(knxClient);
        dateStatus.bind(knxClient);
        bsoHall.bind(knxClient);
        // Connect to the knx gateway on ip:port
        knxClient.connectAsync(ip, port)
            .then(() => console.log("Connected through channel id ", knxClient.channelID))
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
                knxClient.on("indication", handleBusEvent);
                knxClient.monitorBus()
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

### Generic Datapoint

If you do not find your Datapoint type in the list, you can use a generic Datapoint.
Data will need to be encoded/decoded to/from a KNXDataBuffer before you can call write/read functions.

```javascript
const {KNXTunnelSocket, DataPoints, KNXAddress} = require("knx-ip");
const knxClient = new KNXTunnelSocket("1.1.100");
const genericDatapoint = new DataPoints.DataPoint(KNXAddress.createFromString("1.1.15", KNXAddress.TYPE_GROUP));
genericDatapoint.bind(knxClient);

await knxClient.connectAsync(ip, port);
const knxDataBuffer = MyDataEncoder.encode(myValue);
await genericDatapoint.write(knxDataBuffer);
```
