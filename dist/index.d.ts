import { EventEmitter } from 'node:events';
import net from 'node:net';
import tls from 'node:tls';
import { Duplex } from 'node:stream';

declare enum Status {
    ONLINE = 3,
    CONNECTING = 2,
    CLOSED = 1,
    OFFLINE = 0
}

type TokenClientOptions = tls.ConnectionOptions & net.NetConnectOpts & {
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
    close(): boolean;
}
declare class CommandClient extends QueueClient {
    private ids;
    private callbacks;
    constructor(options: TokenClientOptions);
    private init;
    command(command: number, payload: any, expiresIn?: number, callback?: (result: any, error: Error | null) => void | undefined): Promise<unknown>;
    private createTimeoutPromise;
    private createResponsePromise;
    close(): boolean;
}

declare class Connection extends EventEmitter {
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

type TokenServerOptions = tls.TlsOptions & net.ListenOptions & net.SocketConstructorOpts & {
    secure?: boolean;
};
declare class TokenServer extends EventEmitter {
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
type CommandFn = (payload: any, connection: Connection) => Promise<any>;
declare class CommandServer extends TokenServer {
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

declare class CodeError extends Error {
    code: string;
    name: string;
    constructor(message: string, code?: string, name?: string);
}

export { CodeError, CommandClient, CommandServer, Connection, Status };
