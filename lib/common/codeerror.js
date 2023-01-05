export class CodeError extends Error {
    code;
    name;
    constructor(message, code, name) {
        super(message);
        if (typeof code === "string") {
            this.code = code;
        }
        if (typeof name === "string") {
            this.name = name;
        }
    }
}
