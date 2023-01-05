interface CommandData {
	id: number;
	command: number;
	payload: any;
}

export class Command {
  // Converts a CommandData object into a Buffer.
	static toBuffer(command: CommandData): Buffer {
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

  // Converts a Buffer into a CommandData object.
	static parse(buffer: Buffer): CommandData {
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

