import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import routeStaticFilesFrom from "./util/routeStaticFilesFrom.ts";

// Create the application
export const app = new Application();

// Create the router
const router = new Router();

// Define your routes here
// router.get("/api/...", ...);
// router.post("/api/...", ...);

// Middleware to handle base path
app.use(async (ctx, next) => {
  // Store base path in context state for use in your handlers
  ctx.state.basePath = "/party";

  // Rewrite the URL path by removing the /party prefix if present
  const originalPath = ctx.request.url.pathname;
  if (originalPath.startsWith("/party")) {
    ctx.request.url.pathname = originalPath.substring(6) || "/";
  }

  await next();
});

// Register routes
app.use(router.routes());
app.use(router.allowedMethods());

// Handle static files from client/dist and client/public
// Note: If your routeStaticFilesFrom function doesn't handle the base path,
// you might need to modify it or replace with direct implementation
app.use(routeStaticFilesFrom([
  `${Deno.cwd()}/client/dist`,
  `${Deno.cwd()}/client/public`,
]));

// Fallback static file handler for other static assets
app.use(async (ctx, next) => {
  try {
    await ctx.send({
      root: `${Deno.cwd()}/static`,
      path: ctx.request.url.pathname,
    });
  } catch {
    await next();
  }
});

// Start the server if this is the main module
if (import.meta.main) {
  console.log("Server listening on port http://localhost:8000");
  await app.listen({ port: 8000 });
}
