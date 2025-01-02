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

export function instanceId(): Middleware {
  const id = crypto.randomUUID();
  return async (ctx, next) => {
    await next();
    ctx.response.headers.set("x-instance-id", id);
  };
}
