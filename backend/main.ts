import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";

const PORT = 8080;
const PREFIX = "/api/v1";

const router = new Router({
  prefix: PREFIX,
});

router.get("/", (ctx) => {
  ctx.response.body = "Hello, world!";
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

if (import.meta.main) {
  console.log(`Backend is running on port ${PORT}!`);
  app.listen({ port: PORT });
}
