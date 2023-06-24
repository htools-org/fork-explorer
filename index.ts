import { Application } from "https://deno.land/x/oak@v10.5.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";

import config from "./frontend/src/config/config.ts";
import router from "./backend/api/index.ts";
import { homeTXT } from "./backend/txt/index.ts";
import { bootstrapBlocks } from "./backend/blocks/index.ts";
import { pageviewsTxt } from "./backend/pageviews/index.ts";

bootstrapBlocks();

const app = new Application();

app.use(oakCors());

app.use(router.routes());

app.use(async (context, next) => {
  const accepts = context.request.accepts();

  if (
    accepts &&
    ((accepts.length === 1 &&
      accepts[0] === "*/*" &&
      /* ultra hack: */ !context.request.url.pathname.toLowerCase().endsWith(".js")) ||
      accepts.includes("text/plain") ||
      context.request.url.pathname === "/index.txt")
  ) {
    await pageviewsTxt();
    context.response.body = homeTXT();
  } else {
    await next();
  }
});

app.addEventListener("listen", ({ hostname, port, secure }) => {
  const host = hostname ?? "localhost";
  const protocol = secure ? "https://" : "http://";
  console.log(`Listening on: ${protocol}${host}:${port}`);
});

await app.listen({
  hostname: config.server.host,
  port: config.server.port,
});
