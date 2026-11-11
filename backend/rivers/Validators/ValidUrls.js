// api endpoints exempt from token verification
// Each entry is METHOD:/path and must match the request path exactly (query string ignored).
const publicRoutes = new Set(
  [
    // services
    "GET:/services/initial",
    "GET:/services/verify",
    "GET:/favicon.ico",
    // adventures
    "GET:/adventures/all",
    "GET:/adventures/details",
    "GET:/adventures/distance",
    // zones
    "GET:/zones/all",
    "GET:/zones/details",
    "GET:/zones/distance",
    // users
    "GET:/users/emailOptOut",
    "POST:/users",
    "POST:/users/login",
    "POST:/users/passwordResetLink",
    "POST:/users/newPassword",
    // search
    "GET:/search/users",
    "GET:/search/adventures",
    "GET:/search/zones",
  ].map((route) => route.toLowerCase()),
);

const publicPrefixes = ["GET:/images/"].map((route) => route.toLowerCase());

const isPublicRoute = (method, path) => {
  const normalizedPath = path.length > 1 ? path.replace(/\/+$/, "") : path;
  const key = `${method.toUpperCase()}:${normalizedPath}`.toLowerCase();

  return (
    publicRoutes.has(key) ||
    publicPrefixes.some((prefix) => key.startsWith(prefix))
  );
};

module.exports = { isPublicRoute };
