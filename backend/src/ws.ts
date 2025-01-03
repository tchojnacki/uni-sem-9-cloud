import { Router } from "@oak/oak/router";
import { Message, Verifier } from "./types.ts";

type WsArgs = {
  router: Router;
  verifier: Verifier;
};

type Client = WebSocket & { sub: string | null };

export function setupWs({ router, verifier }: WsArgs) {
  const clients = new Map<string, Client>();

  router.get("/ws", (ctx) => {
    const client = ctx.upgrade() as Client;
    client.sub = null;

    client.addEventListener("message", async (event) => {
      try {
        const { type, data } = JSON.parse(event.data);
        if (type === "authenticate") {
          const { sub } = await verifier.verify(data);
          console.log(`WS: connected ${sub}`);
          if (client.sub) {
            clients.delete(client.sub);
          }
          client.sub = sub;
          clients.set(sub, client);
        }
      } catch {
        // Ignore
      }
    });

    client.addEventListener("close", () => {
      const { sub } = client;
      if (sub) {
        console.log(`WS: disconnected ${sub}`);
        clients.delete(sub);
      }
    });
  });

  const notifyListener = (sub: string, message: Message) => {
    const client = clients.get(sub);
    if (client) {
      const payload = JSON.stringify({ type: "new-message", data: message });
      client.send(payload);
    }
  };

  return { notifyListener };
}
