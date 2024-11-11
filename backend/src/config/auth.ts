import { Middleware } from "@oak/oak/middleware";
import { Database } from "../database.ts";

type Verifier = {
  verify(token: string): Promise<{ sub: string; username: string }>;
};

export function auth(verifier: Verifier, database: Database): Middleware {
  return async (ctx, next) => {
    ctx.state.sub = null;
    ctx.state.username = null;

    const authHeader = ctx.request.headers.get("Authorization");
    if (!authHeader) {
      return next();
    }

    const authHeaderParts = authHeader.split(" ");
    if (authHeaderParts.length !== 2) {
      return next();
    }

    const [type, token] = authHeaderParts;
    if (type.toLowerCase() !== "bearer") {
      return next();
    }

    try {
      const { sub, username } = await verifier.verify(token);
      ctx.state.sub = sub;
      ctx.state.username = username;
      void database.upsertAccount({ id: sub, username });
    } catch {
      // Ignore
    }

    return next();
  };
}
