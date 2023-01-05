export interface SerializedError {
    /** The name of the error (e.g. Error, TypeError, ...). */
    name: string;
    /** The error message. */
    message: string;
    /** The stack trace. */
    stack: string;
    [prop: string]: any;
}
export declare class ErrorSerializer {
    /** Converts an Error into a standard object. */
    static serialize(error: Error): SerializedError;
    /** Converts an object into an Error instance. */
    static deserialize(data: SerializedError): Error;
    /** Tries to find the global class for the error name. Returns Error if none is found. */
    private static getFactory;
}
