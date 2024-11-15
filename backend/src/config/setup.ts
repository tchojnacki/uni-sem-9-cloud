import { CognitoJwtVerifier } from "aws-jwt-verify";
import { Application } from "@oak/oak/application";
import { Router } from "@oak/oak/router";
import { Observer } from "../types.ts";
import { Database } from "../database.ts";
import { setupWs } from "./ws.ts";
import { auth } from "./auth.ts";
import { cognitoClientId, cognitoPoolId, databaseUrl } from "./env.ts";
import { cors } from "./cors.ts";
import { logging } from "./logging.ts";

type AppConfig = {
  port: number;
  prefix: string;
};

type DefineArgs = {
  router: Router;
  database: Database;
  observer: Observer;
};

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
  app.use(auth({ verifier, database }));
  app.use(logging());

  const router = new Router({ prefix });

  const observer = setupWs({ router, verifier });
  defineRoutes({ router, database, observer });

  app.use(router.routes(), router.allowedMethods());

  console.log(`Backend running on http://0.0.0.0:${port}`);
  app.listen({ port });
}
