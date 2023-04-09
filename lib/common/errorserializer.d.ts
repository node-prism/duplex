export interface SerializedError {
    name: string;
    message: string;
    stack: string;
    [prop: string]: any;
}
export declare class ErrorSerializer {
    static serialize(error: Error): SerializedError;
    static deserialize(data: SerializedError): Error;
    private static getFactory;
}
