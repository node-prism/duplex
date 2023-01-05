export const NEWLINE = Buffer.from("\n")[0];
const ESC = Buffer.from("\\")[0];
const ESC_N = Buffer.from("n")[0];
export class Message {
    // escape all newlines and backslashes in a Buffer.
    static escape(data) {
        const result = [];
        for (const char of data) {
            switch (char) {
                case ESC:
                    // escape the escaped backslash
                    result.push(ESC);
                    result.push(ESC);
                    break;
                case NEWLINE:
                    // escape newline
                    result.push(ESC);
                    result.push(ESC_N);
                    break;
                default:
                    result.push(char);
                    break;
            }
        }
        result.push(NEWLINE);
        return Buffer.from(result);
    }
    // undoes what the escape method does.
    static unescape(data) {
        const result = [];
        // ignore last byte because it's the separating newline.
        for (let i = 0; i < data.length - 1; i++) {
            const char = data[i];
            const next = data[i + 1];
            if (char === ESC) {
                switch (next) {
                    case ESC:
                        // escaped escaped backslash.
                        result.push(ESC);
                        i += 1;
                        break;
                    case ESC_N:
                        // escaped newline.
                        result.push(NEWLINE);
                        i += 1;
                        break;
                    default:
                        throw new Error("Unescaped backslash detected!");
                }
            }
            else {
                result.push(char);
            }
        }
        return Buffer.from(result);
    }
}
