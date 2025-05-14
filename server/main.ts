import { Application } from "jsr:@oak/oak/application";

import { Router } from "jsr:@oak/oak/router";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";

export const app = new Application();


const router = new Router();

app.use(router.routes());
app.use(router.allowedMethods());

app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/client/dist`,
  `${Deno.cwd()}/client/public`,
]));

// SPA fallback (if you're using React Router)
app.use(async (ctx) => {
  if (!ctx.request.url.pathname.startsWith("/api")) {
    try {
      await ctx.send({
        root: `${Deno.cwd()}/client/dist`,
        path: "index.html",
      });
    } catch (e) {
      console.error("Error serving index.html:", e);
      ctx.response.status = 500;
      ctx.response.body = "Internal server error";
    }
  }
});

if (import.meta.main) {
  console.log("Server listening on port http://localhost:8000");
  await app.listen({ port: 8000 });
}



