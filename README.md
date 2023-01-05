# duplex

An optionally-secure, full-duplex TCP command server and client.

## Server

```typescript
// An insecure CommandServer
const server = new CommandServer({
  host: "localhost",
  port: 3351,
  secure: false,
});

// A secure CommandServer
// https://nodejs.org/api/tls.html#new-tlstlssocketsocket-options
const server = new CommandServer({
  host: "localhost",
  port: 3351,
  secure: true,
  key: fs.readFileSync("certs/server/server.key"),
  cert: fs.readFileSync("certs/server/server.crt"),
  ca: fs.readFileSync("certs/server/ca.crt"),
  requestCert: true, 
});

server.command(0, async (payload: any, connection: Connection) => {
  return { ok: "OK" };
});
```

## Client

```typescript
// An insecure client
const client = new CommandClient({
  host: "localhost",
  port: 3351,
  secure: false,
});

// A secure client
const client = new CommandClient({
  host: "localhost",
  port: 3351,
  key: fs.readFileSync("certs/client/client.key"),
  cert: fs.readFileSync("certs/client/client.crt"),
  ca: fs.readFileSync("certs/ca/ca.crt"),
});

// Awaiting the response
try {
  const response = await client.command(0, { some: "payload" }, 1000);
  //                             command^  ^payload             ^expiration
  // response: { ok: "OK" };
} catch (error) {
  console.error(error);
}

// Receiving the response in a callback
const callback = (response: any, error: CodeError) => {
  if (error) {
    console.error(error.code);
    return;
  }

  // response is { ok: "OK" }
};

client.command(0, { some: "payload" }, 1000, callback);
```
