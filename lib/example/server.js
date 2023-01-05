import { CommandServer } from "../server/commandserver";
const server = new CommandServer({
    host: "localhost",
    port: 3351,
    secure: false,
});
server.command(0, async (payload, connection) => {
    console.log("RECV [0]:", payload);
    return { ok: "OK" };
});
server.on("clientError", (error) => {
    console.log("clientError", error.code);
});
