import { Middleware } from "@oak/oak/middleware";

export function cors(): Middleware {
  return (ctx, next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set(
      "Access-Control-Allow-Headers",
      ["Authorization", "Content-Type"].join(", ")
    );
    return next();
  };
}
