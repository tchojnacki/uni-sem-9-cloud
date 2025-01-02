import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { auth } from "./auth.ts";
import { Bus } from "./bus.ts";
import { cors } from "./cors.ts";
import { Database } from "./database.ts";
import { busUrl, cognitoClientId, cognitoPoolId, databaseUrl } from "./env.ts";
import { logging } from "./logging.ts";
import { setupWs } from "./ws.ts";

type AppConfig = {
  port: number;
  prefix: string;
};

export async function runApp({ port, prefix }: AppConfig) {
  const instanceId = crypto.randomUUID();

  const verifier = CognitoJwtVerifier.create({
    userPoolId: cognitoPoolId,
    clientId: cognitoClientId,
    tokenUse: "access",
  });

  const database = await Database.setup(databaseUrl);

  const bus = await Bus.setup(busUrl);

  const app = new Application();
  app.use(cors());
  app.use(auth({ verifier, database }));
  app.use(logging());
  app.use(async (ctx, next) => {
    await next();
    ctx.response.headers.set("x-instance-id", instanceId);
  });

  const router = new Router({ prefix });

  const ws = setupWs({ router, verifier });

  bus.onMessage((message) => {
    ws.notifyListener(message.receiver, "new-message", message);
    if (message.sender !== message.receiver) {
      ws.notifyListener(message.sender, "new-message", message);
    }
  });

  router.get("/health", (ctx) => {
    console.log(`HEALTHCHECK: ${ws.countListeners()} listeners`);
    ctx.response.body = { status: "OK" };
  });

  router.get("/accounts", async (ctx) => {
    if (!ctx.state.sub) {
      ctx.response.status = 401;
      return;
    }
    ctx.response.body = await database.selectAccounts();
  });

  router.get("/accounts/me", (ctx) => {
    if (!ctx.state.sub) {
      ctx.response.status = 401;
      return;
    }
    ctx.response.body = { id: ctx.state.sub, username: ctx.state.username };
  });

  router.get("/messages/:id", async (ctx) => {
    if (!ctx.state.sub) {
      ctx.response.status = 401;
      return;
    }
    ctx.response.body = await database.selectMessages(
      ctx.state.sub,
      ctx.params.id
    );
  });

  router.post("/messages", async (ctx) => {
    if (!ctx.state.sub) {
      ctx.response.status = 401;
      return;
    }
    const sender = ctx.state.sub;
    try {
      const { receiver, content } = await ctx.request.body.json();
      const message = await database.insertMessage(sender, receiver, content);
      bus.notify(message);
      ctx.response.status = 201;
      ctx.response.body = message;
    } catch {
      ctx.response.status = 400;
    }
  });

  app.use(router.routes(), router.allowedMethods());

  console.log(`Backend running on http://0.0.0.0:${port}`);
  app.listen({ port });
}
