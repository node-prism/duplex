export declare class CodeError extends Error {
    code: string;
    name: string;
    constructor(message: string, code?: string, name?: string);
}
