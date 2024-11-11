import { Middleware } from "@oak/oak/middleware";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Database } from "./database.ts";
import { cognitoClientId, cognitoPoolId } from "./env.ts";

const verifier = CognitoJwtVerifier.create({
  userPoolId: cognitoPoolId,
  clientId: cognitoClientId,
  tokenUse: "access",
});

export function extractAuth(database: Database): Middleware {
  return async (ctx, next) => {
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
