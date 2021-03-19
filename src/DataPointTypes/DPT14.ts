import { BufferLengthError } from '../errors/BufferLengthError';
import {DPT} from './definitions';

// Datapoint Types “4-Octet Float Value”
/**
 * @typedef {Object} SUBDPT14
 * @property {Object} ids
 * @property {string} angle
 * @property {string} current
 * @property {string} potential
 * @property {string} potentialdifference
 * @property {string} energy
 * @property {string} force
 * @property {string} frequency
 * @property {string} heat
 * @property {string} impedance
 * @property {string} length
 * @property {string} mass
 * @property {string} power
 * @property {string} speed
 * @property {string} stress
 * @property {string} tension
 * @property {string} temperature
 * @property {string} absolutetemperature
 * @property {string} ktemperature
 * @property {string} weight
 * @property {string} work
 */
export const DPT14: DPT = {
    id: '14',
    subtypes: {
        ids: {
            '007': 'angle',
            '019': 'current',
            '027': 'potential',
            '028': 'potentialdifference',
            '031': 'energy',
            '032': 'force',
            '033': 'frequency',
            '037': 'heat',
            '038': 'impedance',
            '039': 'length',
            '051': 'mass',
            '056': 'power',
            '065': 'speed',
            '066': 'stress',
            '067': 'tension',
            '068': 'temperature',
            '069': 'absolutetemperature',
            '070': 'ktemperature',
            '078': 'weight',
            '079': 'work'

        },
        'angle': '007',
        'current': '019',
        'potential': '027',
        'potentialdifference': '028',
        'energy': '031',
        'force': '032',
        'frequency': '033',
        'heat': '037',
        'impedance': '038',
        'length': '039',
        'mass': '051',
        'power': '056',
        'speed': '065',
        'stress': '066',
        'tension': '067',
        'temperature': '068',
        'absolutetemperature': '069',
        'ktemperature': '070',
        'weight': '078',
        'work': '079'
    },
    encoder: (value: number): Buffer => {
        const buf = Buffer.alloc(4);
        buf.writeFloatBE(value, 0);
        return buf;
    },
    decoder: (buffer: Buffer): number => {
        if (buffer.length !== 4) {
            throw new BufferLengthError(`Invalid buffer length ${buffer.length} for DPT14.  Expected 4.`);
        }
        const val = buffer.readFloatBE(0);
        return val;
    }
};
