import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { auth } from "./auth.ts";
import { Bus } from "./bus.ts";
import { Database } from "./database.ts";
import {
  adminmsgQueueUrl,
  analysisQueueUrl,
  busUrl,
  cognitoClientId,
  cognitoPoolId,
  databaseUrl,
} from "./env.ts";
import { cors, instanceId, logging } from "./middlewares.ts";
import { Queue } from "./queue.ts";
import { setupWs } from "./ws.ts";

if (import.meta.main) {
  const port = 8001;
  const prefix = "/api/v1";

  const verifier = CognitoJwtVerifier.create({
    userPoolId: cognitoPoolId,
    clientId: cognitoClientId,
    tokenUse: "access",
  });

  const database = await Database.setup(databaseUrl);

  const bus = await Bus.setup(busUrl);

  const analysisQueue = new Queue(analysisQueueUrl);
  const adminmsgQueue = new Queue(adminmsgQueueUrl);

  const app = new Application();
  app.use(cors());
  app.use(logging());
  app.use(instanceId());
  app.use(auth({ verifier, database }));

  const router = new Router({ prefix });

  const ws = setupWs({ router, verifier });

  await bus.subMessage((message) => {
    ws.notifyListener(message.receiver, message);
    if (message.sender !== message.receiver) {
      ws.notifyListener(message.sender, message);
    }
  });

  adminmsgQueue.receive((message) => {
    console.log("TODO", message);
  });

  router.get("/health", (ctx) => {
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
      await bus.pubMessage(message);
      await analysisQueue.send(message);
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
