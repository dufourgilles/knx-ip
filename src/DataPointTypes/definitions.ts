
export type Encoder = (value: any) => Buffer;
export type Decoder = (buffer: Buffer) => any;
export interface DPT {
    decoder: Decoder;
    encoder: Encoder;
    id: string;
    subtypes: {[index: string]: any};
}

export interface DPTActions {
    [index: string]: {
        func: (x?: any) => void;
        parameterType: {[index: string]: any}
    };
}
