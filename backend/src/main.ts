import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";

import { insertCors } from "./cors.ts";
import { extractAuth } from "./auth.ts";
import { Database } from "./database.ts";

const PORT = 8001;
const PREFIX = "/api/v1";

if (import.meta.main) {
  const databaseUrl = Deno.env.get("DATABASE_URL") ?? "";
  const database = await Database.setup(databaseUrl);

  const app = new Application();
  app.use(insertCors(), extractAuth(database));

  const router = new Router({
    prefix: PREFIX,
  });

  router.get("/health", (ctx) => (ctx.response.body = { status: "OK" }));

  router.get("/accounts", async (ctx) => {
    ctx.response.body = await database.getAccounts();
  });

  app.use(router.routes(), router.allowedMethods());

  console.log(`Backend running on http://0.0.0.0:${PORT}`);
  app.listen({ port: PORT });
}
