import { CommandClient } from "../client/commandclient";
const client = new CommandClient({
    host: "localhost",
    port: 3351,
    secure: false,
});
const payload = { things: "stuff", numbers: [1, 2, 3] };
async function main() {
    const callback = (result, error) => {
        if (error) {
            console.log("ERR [0]", error.code);
            return;
        }
        console.log("RECV [0]", result);
    };
    client.command(0, payload, 10, callback);
}
main();
