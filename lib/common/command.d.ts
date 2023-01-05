/// <reference types="node" />
interface CommandData {
    id: number;
    command: number;
    payload: any;
}
export declare class Command {
    /**
     * Converts a command to a token that can be sent via a TokenServer.
     * @param command The data of the command.
     */
    static toBuffer(command: CommandData): Buffer;
    /**
     * Parses the data from a command token.
     * @param buffer The raw token buffer.
     */
    static parse(buffer: Buffer): CommandData;
}
export {};
