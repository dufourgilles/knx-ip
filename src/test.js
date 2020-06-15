

const {KNXClient, KNXTunnelSocket, KNXProtocol, DataPoints} = require("../lib/index");

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
    const lampSwitchAddress =  KNXProtocol.KNXAddress.createFromString("1.1.15", KNXProtocol.KNXAddress.TYPE_GROUP);
    const bsoHallAddresss =  KNXProtocol.KNXAddress.createFromString("2.6.4", KNXProtocol.KNXAddress.TYPE_GROUP);
    const lampSwitch = new DataPoints.Switch(lampSwitchAddress);
    const lampStatus = DataPoints.createDataPoint(
        KNXProtocol.KNXAddress.createFromString("1.2.15", KNXProtocol.KNXAddress.TYPE_GROUP),
        "Switch"
        );
    const dateAddress = KNXProtocol.KNXAddress.createFromString("9.1.11", KNXProtocol.KNXAddress.TYPE_GROUP);
    const dateStatus = new DataPoints.Date(dateAddress);
    const bsoHall = DataPoints.createDataPoint(bsoHallAddresss, "Percentage");
    const knxSocket = new KNXTunnelSocket("1.1.100");
    lampSwitch.bind(knxSocket);
    lampStatus.bind(knxSocket);
    dateStatus.bind(knxSocket);
    bsoHall.bind(knxSocket);
    knxSocket.connectAsync(ip, port)
        .then(() => console.log("Connected through channel id ", knxSocket.channelID))
	// .then(() => console.log("Reading date"))
	// .then(() => dateStatus.read())
    // .then(val => console.log("Date: ", val))
    .then(() => {
        console.log("Set BSO");
        bsoHall.set({value: 10});
    })
        // .then(() => console.log("Reading lamp status"))
        // .then(() => lampStatus.read())
        // .then(val => console.log("Lamp status:", val))
        // .then(() => console.log("Sending lamp ON"))
        // .then(() => lampSwitch.setOn())
        // .then(() => wait())
        // .then(() => lampStatus.read())
        // .then(val => console.log("Lamp status:", val))
        // .then(() => lampSwitch.setOff())
        // .then(() => wait(1000))
        // .then(() => lampStatus.read())
        // .then(val => console.log("Lamp status:", val))
        // .then(() => {
        //     console.log("Starting bus monitoring");
        //     knxSocket.on("indication", handleBusEvent);
        //     knxSocket.monitorBus()
        // })
        // .then(() => wait(9000))
        .catch(err => {console.log(err);})
        .then(() => process.exit(0));
};
