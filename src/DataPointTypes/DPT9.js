"use strict";

// kudos to http://croquetweak.blogspot.gr/2014/08/deconstructing-floats-frexp-and-ldexp.html
function ldexp(mantissa, exponent) {
    return exponent > 1023 // avoid multiplying by infinity
        ? mantissa * Math.pow(2, 1023) * Math.pow(2, exponent - 1023)
        : exponent < -1074 // avoid multiplying by zero
            ? mantissa * Math.pow(2, -1074) * Math.pow(2, exponent + 1074)
            : mantissa * Math.pow(2, exponent);
}

function frexp(value) {
    if (value === 0) return [value, 0];
    var data = new DataView(new ArrayBuffer(8));
    data.setFloat64(0, value);
    var bits = (data.getUint32(0) >>> 20) & 0x7FF;
    if (bits === 0) {
        data.setFloat64(0, value * Math.pow(2, 64));
        bits = ((data.getUint32(0) >>> 20) & 0x7FF) - 64;
    }
    var exponent = bits - 1022,
        mantissa = ldexp(value, -exponent);
    return [mantissa, exponent];
}


const DPT9 = {
    id: "9",
    subtypes: {
        ids: {
            "001": "temperature",
            "002": "temperaturedifference",
            "003": "kelvin",
            "004": "lux",
            "005": "speed",
            "006": "pressure",
            "007": "humidity",
            "008": "airquality",
            "010": "time1",
            "011": "time2",
            "020": "voltage",
            "021": "current",
            "022": "powerdensity",
            "023": "kelvinpercent",
            "024": "power",
            "025": "volumeflow",
            "026": "rainamount",
            "027": "ftemperature",
            "028": "windspeed"
        },
        "temperature": "001",
        "temperaturedifference": "002",
        "kelvin": "003",
        "lux": "004",
        "speed": "005",
        "pressure": "006",
        "humidity": "007",
        "airquality": "008",
        "time1": "010",
        "time2": "011",
        "voltage": "020",
        "current": "021",
        "powerdensity": "022",
        "kelvinpercent": "023",
        "power": "024",
        "volumeflow": "025",
        "rainamount": "026",
        "ftemperature": "027",
        "windspeed": "028"
    },
    decoder: buffer => {
        if (buffer.length !== 2) {
            throw new Error(`Invalid buffer length ${buffer.length} for DPT9.  Expected 2.`);
        }
        const val = buffer.readUInt8(0);
        const sign = val >> 7;
        const exp = (val & 0b01111000) >> 3;
        const mant =  ((val & 0x07) << 8) + buffer.readUInt8(1);
        const signedMant = sign === 1 ? ~(mant ^ 2047) : mant;
        return ldexp((0.01 * signedMant), exp);
    },
    encoder: value => {
        const buf = Buffer.alloc(2);
        let [mant, exp] = frexp(value);
        const sign = mant < 0 ? 1 : 0;
        let max_mantissa = 0;
        for (let e = exp; e >= -15; e--) {
            max_mantissa = ldexp(100 * mant, e);
            if (max_mantissa > -2048 && max_mantissa < 2047) break;
        }
        mant = (mant < 0) ?  ~(max_mantissa^2047) : max_mantissa;
        exp = exp - e;
        buf.writeUInt8( (sign << 7) + (exp << 3) + (mant >> 8), 0);
        buf.writeUInt8(mant % 256, 1);
        return buf;
    }
};

module.exports = DPT9;