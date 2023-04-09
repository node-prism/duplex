/// <reference types="node" />
interface CommandData {
    id: number;
    command: number;
    payload: any;
}
export declare class Command {
    static toBuffer({ payload, id, command }: CommandData): Buffer;
    static parse(buffer: Buffer): CommandData;
}
export {};
