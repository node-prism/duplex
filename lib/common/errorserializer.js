export class ErrorSerializer {
    // Converts an Error into a standard object.
    static serialize(error) {
        const data = {
            message: error.message,
            name: error.name,
            stack: error.stack,
        };
        Object.assign(data, error);
        return data;
    }
    // Converts an object into an Error instance.
    static deserialize(data) {
        const Factory = this.getFactory(data);
        const error = new Factory(data.message);
        Object.assign(error, data);
        return error;
    }
    // Tries to find the global class for the error name and
    // returns Error if none is found.
    static getFactory(data) {
        const name = data.name;
        if (name.endsWith("Error") && global[name]) {
            return global[name];
        }
        return Error;
    }
}
