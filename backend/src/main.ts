import { setupApp } from "./config/setup.ts";

if (import.meta.main) {
  await setupApp(
    {
      port: 8001,
      prefix: "/api/v1",
    },
    ({ router, database }) => {
      router.get("/health", (ctx) => (ctx.response.body = { status: "OK" }));

      router.get("/accounts", async (ctx) => {
        ctx.response.body = await database.getAccounts();
      });
    }
  );
}
