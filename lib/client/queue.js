export class QueueItem {
    value;
    expiration;
    constructor(value, expiresIn) {
        this.value = value;
        this.expiration = Date.now() + expiresIn;
    }
    get expiresIn() {
        return this.expiration - Date.now();
    }
    get isExpired() {
        return Date.now() > this.expiration;
    }
}
export class Queue {
    items = [];
    add(item, expiresIn) {
        this.items.push(new QueueItem(item, expiresIn));
    }
    get isEmpty() {
        let i = this.items.length;
        while (i--) {
            if (this.items[i].isExpired) {
                this.items.splice(i, 1);
            }
            else {
                return false;
            }
        }
        return true;
    }
    pop() {
        while (this.items.length) {
            const item = this.items.shift();
            if (!item.isExpired) {
                return item;
            }
        }
        return null;
    }
}
