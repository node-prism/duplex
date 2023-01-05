import { EventEmitter } from "node:events";
import net from "node:net";
import tls from "node:tls";
import { CodeError } from "../common/codeerror";
import { Command } from "../common/command";
import { Connection } from "../common/connection";
import { ErrorSerializer } from "../common/errorserializer";
import { Status } from "../common/status";
import { IdManager } from "../server/ids";
import { Queue } from "./queue";
class TokenClient extends EventEmitter {
    options;
    socket;
    connection = null;
    hadError;
    status;
    constructor(options) {
        super();
        this.options = options;
        this.connect();
    }
    connect() {
        if (this.status >= Status.CLOSED) {
            return false;
        }
        this.hadError = false;
        this.status = Status.CONNECTING;
        if (this.options.secure) {
            this.socket = tls.connect(this.options);
        }
        else {
            this.socket = net.connect(this.options);
        }
        this.connection = null;
        this.applyListeners();
        return true;
    }
    close() {
        if (this.status <= Status.CLOSED)
            return false;
        this.status = Status.CLOSED;
        this.socket.end();
        this.connection = null;
        return true;
    }
    send(buffer) {
        if (this.connection) {
            return this.connection.send(buffer);
        }
        return false;
    }
    applyListeners() {
        this.socket.on("error", (error) => {
            this.hadError = true;
            this.emit("error", error);
        });
        this.socket.on("close", () => {
            this.status = Status.OFFLINE;
            this.emit("close", this.hadError);
        });
        this.socket.on("secureConnect", () => {
            this.updateConnection();
            this.status = Status.ONLINE;
            this.emit("connect");
        });
        this.socket.on("connect", () => {
            this.updateConnection();
            this.status = Status.ONLINE;
            this.emit("connect");
        });
    }
    updateConnection() {
        const connection = new Connection(this.socket);
        connection.on("token", (token) => {
            this.emit("token", token, connection);
        });
        connection.on("remoteClose", () => {
            this.emit("remoteClose", connection);
        });
        this.connection = connection;
    }
}
class QueueClient extends TokenClient {
    queue = new Queue();
    constructor(options) {
        super(options);
        this.applyEvents();
    }
    sendBuffer(buffer, expiresIn) {
        const success = this.send(buffer);
        if (!success) {
            this.queue.add(buffer, expiresIn);
        }
    }
    applyEvents() {
        this.on("connect", () => {
            while (!this.queue.isEmpty) {
                const item = this.queue.pop();
                this.sendBuffer(item.value, item.expiresIn);
            }
        });
    }
}
export class CommandClient extends QueueClient {
    ids = new IdManager(Math.pow(2, 16) - 1);
    callbacks = {};
    constructor(options) {
        super(options);
        this.init();
    }
    init() {
        this.on("token", (buffer) => {
            try {
                const data = Command.parse(buffer);
                if (this.callbacks[data.id]) {
                    if (data.command === 255) {
                        const error = ErrorSerializer.deserialize(data.payload);
                        this.callbacks[data.id](error, undefined);
                    }
                    else {
                        this.callbacks[data.id](null, data.payload);
                    }
                }
            }
            catch (error) {
                this.emit("error", error);
            }
        });
        this.on("error", (error) => {
            /* console.error(error); */
        });
    }
    async command(command, payload, expiresIn = 30_000, callback = null) {
        if (command === 255) {
            throw new CodeError("Command 255 is reserved.", "ERESERVED", "CommandError");
        }
        const id = this.ids.reserve();
        const buffer = Command.toBuffer({ id, command, payload });
        this.sendBuffer(buffer, expiresIn);
        // No 0, null or Infinity.
        // Fallback to a reasonable default.
        if (expiresIn === 0 || expiresIn === null || expiresIn === Infinity) {
            expiresIn = 60_000;
        }
        const response = this.createResponsePromise(id);
        const timeout = this.createTimeoutPromise(id, expiresIn);
        if (typeof callback === "function") {
            try {
                const ret = await Promise.race([response, timeout]);
                try {
                    callback(ret, null);
                }
                catch (callbackError) { /* */ }
            }
            catch (error) {
                callback(undefined, error);
            }
        }
        else {
            return Promise.race([response, timeout]);
        }
    }
    createTimeoutPromise(id, expiresIn) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.ids.release(id);
                delete this.callbacks[id];
                reject(new CodeError("Command timed out.", "ETIMEOUT", "CommandError"));
            }, expiresIn);
        });
    }
    createResponsePromise(id) {
        return new Promise((resolve, reject) => {
            this.callbacks[id] = (error, result) => {
                this.ids.release(id);
                delete this.callbacks[id];
                if (error) {
                    reject(error);
                }
                else {
                    resolve(result);
                }
            };
        });
    }
}
