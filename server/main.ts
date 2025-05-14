import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";

export const app = new Application();


// Set the app to be aware it's running in a subdirectory
app.use(async (ctx, next) => {
  ctx.state.basePath = "/party";
  await next();
});

// When serving static files
app.use(async (context, next) => {
  try {
    await context.send({
      root: `${Deno.cwd()}/static`,
      path: context.request.url.pathname.replace("/party", ""),
    });
  } catch {
    await next();
  }
});

const router = new Router();

app.use(router.routes());
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/client/dist`,
  `${Deno.cwd()}/client/public`,
]));

if (import.meta.main) {
  console.log("Server listening on port http://localhost:8000");
  await app.listen({ port: 8000 });
}

app.use(router.routes());
app.use(router.allowedMethods());
