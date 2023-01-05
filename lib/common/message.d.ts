/// <reference types="node" />
export declare const NEWLINE: number;
export declare class Message {
    static escape(data: Buffer): Buffer;
    static unescape(data: Buffer): Buffer;
}
