import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Database } from "../database.ts";
import { cognitoClientId, cognitoPoolId, databaseUrl } from "./env.ts";
import { Application } from "@oak/oak/application";
import { Middleware } from "@oak/oak/middleware";
import { auth } from "./auth.ts";
import { Router } from "@oak/oak/router";

type AppConfig = {
  port: number;
  prefix: string;
};

type DefineArgs = {
  router: Router;
  database: Database;
};

function cors(): Middleware {
  return (ctx, next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set(
      "Access-Control-Allow-Headers",
      ["Authorization", "Content-Type"].join(", ")
    );
    return next();
  };
}

function logging(): Middleware {
  return (ctx, next) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    const method = ctx.request.method;
    const url = ctx.request.url.pathname;
    const sub = ctx.state.sub;
    console.log(`${time} [${method}] ${url} { sub: ${sub} }`);
    return next();
  };
}

export async function setupApp(
  { port, prefix }: AppConfig,
  defineRoutes: (args: DefineArgs) => void
) {
  const verifier = CognitoJwtVerifier.create({
    userPoolId: cognitoPoolId,
    clientId: cognitoClientId,
    tokenUse: "access",
  });

  const database = await Database.setup(databaseUrl);

  const app = new Application();
  app.use(cors());
  app.use(auth(verifier, database));
  app.use(logging());

  const router = new Router({ prefix });

  defineRoutes({ router, database });

  app.use(router.routes(), router.allowedMethods());

  console.log(`Backend running on http://0.0.0.0:${port}`);
  app.listen({ port });
}
