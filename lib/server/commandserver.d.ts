/// <reference types="node" />
/// <reference types="node" />
/// <reference types="node" />
import { EventEmitter } from "node:events";
import net from "node:net";
import tls from "node:tls";
import { Connection } from "../common/connection";
import { Status } from "../common/status";
export declare type TokenServerOptions = tls.TlsOptions & net.ListenOptions & net.SocketConstructorOpts & {
    secure?: boolean;
};
export declare class TokenServer extends EventEmitter {
    connections: Connection[];
    private options;
    private server;
    private hadError;
    status: Status;
    constructor(options: TokenServerOptions);
    connect(): boolean;
    close(): boolean;
    applyListeners(): void;
}
declare type CommandFn = (payload: any, connection: Connection) => Promise<any>;
export declare class CommandServer extends TokenServer {
    private commands;
    constructor(options: TokenServerOptions);
    private init;
    /**
     * @param command - The command number to register, a UInt8 (0-255).
     *                  255 is reserved. You will get an error if you try to use it.
     * @param fn - The function to run when the command is received.
     */
    command(command: number, fn: CommandFn): void;
    private runCommand;
}
export {};
