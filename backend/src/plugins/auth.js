const BoomAuth = require("@hapi/boom");
const { verifyToken } = require("../utils/jwt");

exports.authPlugin = {
  name: "auth",
  version: "1.0.0",
  register: async (server, options) => {
    server.auth.scheme("jwt", () => ({
      authenticate: async (request, h) => {
        const authorization = request.headers.authorization;

        if (!authorization) {
          throw BoomAuth.unauthorized(null, "Bearer");
        }

        const [scheme, token] = authorization.split(" ");
        if (scheme !== "Bearer" || !token) {
          throw BoomAuth.unauthorized("Bad auth format", "Bearer");
        }
        try {
          const decoded = verifyToken(token);
          const credentials = {
            sub: decoded.sub,
            role: decoded.role,
            scope: [decoded.role] // สร้าง scope จาก role
          };
          return h.authenticated({
            credentials: {
              ...credentials
            },
          });
        } catch (err) {
          throw BoomAuth.unauthorized("Invalid or expired token", "Bearer");
        }
      },
    }));

    server.auth.strategy("jwt", "jwt");

    server.auth.default("jwt");
  },
};