

const { KNXTunnelSocket, DataPoints, KNXAddress } = require("../lib/index");

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


const wait = (t=3000) => {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, t);
    });
};

const handleBusEvent = function(srcAddress, dstAddress, npdu) {
    console.log(`${srcAddress.toString()} -> ${dstAddress.toString()} :`, npdu.dataValue);
};

const discoverCB = (ip, port) => {
    console.log("Connecting to ", ip, port);
    try {
        knxClient.stopDiscovery();
        const lampSwitchAddress =  KNXAddress.createFromString("1.1.15", KNXAddress.TYPE_GROUP);
        const bsoHallAddresss =  KNXAddress.createFromString("2.6.4", KNXAddress.TYPE_GROUP);
        const lampSwitch = DataPoints.createDataPoint(lampSwitchAddress, "Switch");
        const lampStatus = DataPoints.createDataPoint(
            KNXAddress.createFromString("1.2.15", KNXAddress.TYPE_GROUP),
            "Switch"
            );
        const dateAddress = KNXAddress.createFromString("9.1.11", KNXAddress.TYPE_GROUP);
        const dateStatus = new DataPoints.Date(dateAddress);
        const bsoHall = new DataPoints.Percentage(bsoHallAddresss);
        // const allReaders = [];
        // for(let i = 1; i < 16; i++) {
        //     allReaders.push(
        //         DataPoints.createDataPoint(
        //             KNXAddress.createFromString(`1.2.${i}`, KNXAddress.TYPE_GROUP),
        //             "Switch"
        //         )
        //     )
        // }
        lampSwitch.bind(knxClient);
        lampStatus.bind(knxClient);
        dateStatus.bind(knxClient);
        bsoHall.bind(knxClient);
    
        knxClient.connectAsync(ip, port)
        .then(() => console.log("Connected through channel id ", knxClient.channelID))
	    .then(() => console.log("Reading date"))
	    //.then(() => dateStatus.read())
        .then(val => console.log("Date: ", val))
        // .then(() => {
        //     console.log("Set BSO");
        //     bsoHall.set({value: 10});
        // })
        .then(() => console.log("Reading lamp status"))
        .then(() => lampStatus.read())
        .then(val => console.log("Lamp status:", val))
        .then(() => console.log("Sending lamp ON"))
        .then(() => lampSwitch.setOn())
        .then(() => wait())
        .then(() => lampStatus.read())
        .then(val => console.log("Lamp status:", val))
        .then(() => lampSwitch.setOff())
        //.then(() => wait(100000))
        //.then(() => overload(allReaders))
        .then(() => lampStatus.read())
        .then(val => console.log("Lamp status:", val))
        .then(() => {
            console.log("Starting bus monitoring");
            knxClient.on("indication", handleBusEvent);
            knxClient.monitorBus()
        })
        // .then(() => wait(9000))
        .catch(err => {console.log(err);})
        .then(() => process.exit(0));
    }
    catch(e) {
        console.log(e);
    }
};

// start auto discovery on interface with ip 192.168.1.99
Promise.resolve().then(() => knxClient.startDiscovery("192.168.1.99")).catch((e) => {
    console.log(e);
});
