import { setupApp } from "./config/setup.ts";

if (import.meta.main) {
  await setupApp(
    {
      port: 8001,
      prefix: "/api/v1",
    },
    ({ router, database, observer }) => {
      router.get("/health", (ctx) => {
        console.log(`HEALTHCHECK: ${observer.countListeners()} listeners`);
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
        if (ctx.state.sub === ctx.params.id) {
          ctx.response.status = 400;
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
        try {
          const { receiver, content } = await ctx.request.body.json();
          const message = await database.insertMessage(
            ctx.state.sub,
            receiver,
            content
          );
          observer.notifyListener(receiver, "new-message", message);
          ctx.response.status = 201;
          ctx.response.body = message;
        } catch {
          ctx.response.status = 400;
        }
      });
    }
  );
}
