import { runApp } from "./setup.ts";

if (import.meta.main) {
  await runApp({
    port: 8001,
    prefix: "/api/v1",
  });
}
