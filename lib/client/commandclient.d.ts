/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from "node:events";
import net from "node:net";
import tls from "node:tls";
import { Status } from "../common/status";
export declare type TokenClientOptions = tls.ConnectionOptions & net.NetConnectOpts & {
    secure: boolean;
};
declare class TokenClient extends EventEmitter {
    private options;
    private socket;
    private connection;
    private hadError;
    status: Status;
    constructor(options: TokenClientOptions);
    connect(): boolean;
    close(): boolean;
    send(buffer: Buffer): boolean;
    private applyListeners;
    private updateConnection;
}
declare class QueueClient extends TokenClient {
    private queue;
    constructor(options: TokenClientOptions);
    sendBuffer(buffer: Buffer, expiresIn: number): void;
    private applyEvents;
}
export declare class CommandClient extends QueueClient {
    private ids;
    private callbacks;
    constructor(options: TokenClientOptions);
    private init;
    command(command: number, payload: any, expiresIn?: number, callback?: Function | null): Promise<unknown>;
    private createTimeoutPromise;
    private createResponsePromise;
}
export {};
