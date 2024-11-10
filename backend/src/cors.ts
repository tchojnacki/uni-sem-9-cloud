import { Middleware } from "@oak/oak/middleware";

export function insertCors(): Middleware {
  return (ctx, next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Headers", "Authorization");
    return next();
  };
}
