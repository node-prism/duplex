import { EventEmitter } from "node:events";
import { Message, NEWLINE } from "./message";
const CLOSE_TOKEN = Buffer.from("\\\n");
export class Connection extends EventEmitter {
    duplex;
    buffer = Buffer.allocUnsafe(0);
    constructor(duplex) {
        super();
        this.duplex = duplex;
        this.applyListeners();
    }
    applyListeners() {
        this.duplex.on("data", (buffer) => {
            this.buffer = Buffer.concat([this.buffer, buffer]);
            this.parse();
        });
        this.duplex.on("close", () => this.emit("close"));
    }
    parse() {
        while (true) {
            const i = this.buffer.indexOf(NEWLINE);
            if (i === -1)
                break;
            // +1 to include the separating newline.
            const data = this.buffer.subarray(0, i + 1);
            if (data.equals(CLOSE_TOKEN)) {
                this.emit("remoteClose");
            }
            else {
                this.emit("token", Message.unescape(data));
            }
            this.buffer = this.buffer.subarray(i + 1);
        }
    }
    get isDead() {
        return !this.duplex.writable;
    }
    send(buffer) {
        if (this.isDead)
            return false;
        this.duplex.write(Message.escape(buffer));
        return true;
    }
    close() {
        if (this.isDead)
            return false;
        this.duplex.end();
        return true;
    }
    remoteClose() {
        if (this.isDead)
            return false;
        this.duplex.write(CLOSE_TOKEN);
        return true;
    }
}
