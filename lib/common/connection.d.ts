/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from "node:events";
import { Duplex } from "node:stream";
export declare class Connection extends EventEmitter {
    private readonly duplex;
    private buffer;
    constructor(duplex: Duplex);
    private applyListeners;
    private parse;
    get isDead(): boolean;
    send(buffer: Buffer): boolean;
    close(): boolean;
    remoteClose(): boolean;
}
