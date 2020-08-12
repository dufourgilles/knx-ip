'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.DPT2 = void 0;
exports.DPT2 = {
    id: '2',
    subtypes: {
        ids: {
            '001': 'switchcontrol',
            '002': 'booleancontrol',
            '003': 'enablecontrol',
            '004': 'rampcontrol',
            '005': 'alarmcontrol',
            '006': 'binarycontrol',
            '007': 'stepcontrol',
            '008': 'direction1control',
            '009': 'direction2control',
            '010': 'startcontrol',
            '011': 'statecontrol',
            '012': 'invertcontrol'
        },
        'switchcontrol': '001',
        'booleancontrol': '002',
        'enablecontrol': '003',
        'rampcontrol': '004',
        'alarmcontrol': '005',
        'binarycontrol': '006',
        'stepcontrol': '007',
        'direction1control': '008',
        'direction2control': '009',
        'startcontrol': '010',
        'statecontrol': '011',
        'invertcontrol': '012'
    },
    decoder: (buffer) => {
        throw new Error('Not yet implemented');
    },
    encoder: (value) => {
        throw new Error('Not yet implemented');
    }
};
//# sourceMappingURL=DPT2.js.map