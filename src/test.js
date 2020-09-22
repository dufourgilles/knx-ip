

const { KNXTunnelSocket, DataPoints, KNXAddress } = require("../lib/index");

const knxSocket = new KNXTunnelSocket("1.1.100");

knxSocket.on(KNXTunnelSocket.KNXTunnelSocketEvents.error, err => {
    if (err) {
        console.log(err);
    }
});

knxSocket.on(KNXTunnelSocket.KNXTunnelSocketEvents.discover, info => {
    const [ip,port] = info.split(":");
    discoverCB(ip,port);
});


knxSocket.bindSocketPortAsync(KNXTunnelSocket.Port, '192.168.1.2').then(() => {
    knxSocket.startDiscovery();
})

const wait = (t=2000) => {
    return new Promise(resolve => {
        setTimeout(() => { resolve(); }, t);
    });
};

const overload = async (dp) => {
    for(let i = 1; i < 10000000; i++) {
        for(let j = 1; j < dp.length; j++) {
            dp[j].read().catch((e) => {
                console.log(e);
            });
        }
        await wait(10);
    }
}

const handleBusEvent = function(srcAddress, dstAddress, npdu) {
    console.log(`${srcAddress.toString()} -> ${dstAddress.toString()} :`, npdu.dataValue);
};

const discoverCB = (ip, port) => {
    console.log("Connecting to ", ip, port);
    try {
        knxSocket.stopDiscovery();
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
        const allReaders = [];
        for(let i = 1; i++; i < 16) {
            allReaders.push(
                DataPoints.createDataPoint(
                    KNXAddress.createFromString(`1.2.${i}`, KNXAddress.TYPE_GROUP),
                    "Switch"
                )
            )
        }
        lampSwitch.bind(knxSocket);
        lampStatus.bind(knxSocket);
        dateStatus.bind(knxSocket);
        bsoHall.bind(knxSocket);
    
        knxSocket.connectAsync(ip, port)
        .then(() => console.log("Connected through channel id ", knxSocket.channelID))
	    .then(() => console.log("Reading date"))
	    //.then(() => dateStatus.read())
        .then(val => console.log("Date: ", val))
        // .then(() => {
        //     console.log("Set BSO");
        //     bsoHall.set({value: 10});
        // })
        // .then(() => console.log("Reading lamp status"))
        .then(() => lampStatus.read())
        // .then(val => console.log("Lamp status:", val))
        // .then(() => console.log("Sending lamp ON"))
        // .then(() => lampSwitch.setOn())
        // .then(() => wait())
        // .then(() => lampStatus.read())
        // .then(val => console.log("Lamp status:", val))
        // .then(() => lampSwitch.setOff())
        //.then(() => wait(100000))
        .then(() => overload(allReaders))
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
    }
    catch(e) {
        console.log(e);
    }
};
