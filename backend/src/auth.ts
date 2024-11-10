import { Middleware } from "@oak/oak/middleware";
import { decode, getNumericDate } from "@zaubrik/djwt";
import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Database } from "./database.ts";

type Payload = {
  sub: string;
  token_use: "access" | "id";
  username: string;
  exp: number;
};

const userPoolId = Deno.env.get("COGNITO_USER_POOL_ID") ?? null;
const clientId = Deno.env.get("COGNITO_CLIENT_ID") ?? null;
const verifier =
  userPoolId && clientId
    ? CognitoJwtVerifier.create({ userPoolId, clientId, tokenUse: "access" })
    : null;

const extractToken = async (
  token: string
): Promise<[string, string] | null> => {
  try {
    if (verifier) {
      const payload = await verifier.verify(token);
      return [payload.sub, payload.username];
    } else {
      console.warn("Using development mode for JWT verification!");
      const [_header, payload, _signature] = decode<Payload>(token);
      if (payload.token_use !== "access") {
        return null;
      }
      if (getNumericDate(0) > payload.exp) {
        return null;
      }
      return [payload.sub, payload.username];
    }
  } catch {
    return null;
  }
};

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

    const payload = await extractToken(token);
    if (!payload) {
      return next();
    }

    const [sub, username] = payload;
    ctx.state.sub = sub;
    ctx.state.username = username;
    void database.upsertAccount({ id: sub, username });
    return next();
  };
}
