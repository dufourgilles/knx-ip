import { KNXAddress } from '../protocol/KNXAddress';
import { DataPoint } from './DataPoint';

export class DataPointFactory {
    /**
     *
     * @param {KNXAddress} ga
     * @param {string} typeName
     * @returns {DataPoint}
     */
    static createDataPoint(ga: KNXAddress, typeName: string): DataPoint {
        /** @type {string} */
        const DataPointClassName = `${typeName[0].toUpperCase()}${typeName.slice(1).toLowerCase()}`;
        let DataPointClass;
        try {
            DataPointClass = require(`./${DataPointClassName}`);
        } catch (e) {
            throw new Error(`Unknown DataPoint type ${typeName}`);
        }
        return new DataPointClass(ga);
    }
}
