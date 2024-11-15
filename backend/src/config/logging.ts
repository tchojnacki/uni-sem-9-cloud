import { Middleware } from "@oak/oak/middleware";

export function logging(): Middleware {
  return (ctx, next) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false });
    const method = ctx.request.method;
    const url = ctx.request.url.pathname;
    const sub = ctx.state.sub;
    console.log(`${time} [${method}] ${url} { sub: ${sub} }`);
    return next();
  };
}
