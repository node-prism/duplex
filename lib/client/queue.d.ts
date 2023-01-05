export declare class QueueItem<T> {
    value: T;
    private expiration;
    constructor(value: T, expiresIn: number);
    get expiresIn(): number;
    get isExpired(): boolean;
}
export declare class Queue<T> {
    private items;
    add(item: T, expiresIn: number): void;
    get isEmpty(): boolean;
    pop(): QueueItem<T> | null;
}
