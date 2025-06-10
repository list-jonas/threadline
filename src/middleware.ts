import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isAuthRoute = createRouteMatcher(["/auth/signin"]);
const isProtectedRoute = createRouteMatcher(["/chat", "/settings"]);

export default convexAuthNextjsMiddleware(async (req, { convexAuth }) => {
  const isAuthenticated = await convexAuth.isAuthenticated();

  if (isAuthRoute(req) && isAuthenticated) {
    return nextjsMiddlewareRedirect(req, "/chat");
  }

  if (isProtectedRoute(req) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(req, "/auth/signin");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
