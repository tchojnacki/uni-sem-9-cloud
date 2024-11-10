import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";

import { insertCors } from "./cors.ts";
import { extractAuth } from "./auth.ts";
import { Database } from "./database.ts";

const PORT = 8001;
const PREFIX = "/api/v1";
const DATABASE_URL = Deno.env.get("DATABASE_URL") ?? "";

if (import.meta.main) {
  const database = await Database.setup(DATABASE_URL);

  const app = new Application();
  app.use(insertCors(), extractAuth(database));

  const router = new Router({
    prefix: PREFIX,
  });

  router.get("/accounts", async (ctx) => {
    ctx.response.body = await database.getAccounts();
  });

  app.use(router.routes(), router.allowedMethods());

  console.log(`Backend running on http://0.0.0.0:${PORT}`);
  app.listen({ port: PORT });
}
