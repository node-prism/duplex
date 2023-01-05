export class Command {
    /**
     * Converts a command to a token that can be sent via a TokenServer.
     * @param command The data of the command.
     */
    static toBuffer(command) {
        if (typeof command.payload === "undefined") {
            throw new TypeError("The payload must not be undefined!");
        }
        const payloadString = JSON.stringify(command.payload);
        const payload = Buffer.from(payloadString);
        const buffer = Buffer.allocUnsafe(payload.length + 3);
        buffer.writeUInt16LE(command.id, 0);
        buffer.writeUInt8(command.command, 2);
        payload.copy(buffer, 3);
        return buffer;
    }
    /**
     * Parses the data from a command token.
     * @param buffer The raw token buffer.
     */
    static parse(buffer) {
        if (buffer.length < 3) {
            throw new TypeError("Token too short! ${token}");
        }
        const id = buffer.readUInt16LE(0);
        const command = buffer.readUInt8(2);
        const payloadString = buffer.subarray(3).toString();
        const payload = JSON.parse(payloadString);
        return {
            id,
            command,
            payload,
        };
    }
}
