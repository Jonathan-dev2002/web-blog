require("dotenv").config({ path: ".env" });

const Hapi = require("@hapi/hapi");
const { prismaPlugin } = require("./src/plugins/prisma");
const routes = require("./src/routes");
const { swaggerPlugin } = require("./src/plugins/swagger");
const { authPlugin } = require("./src/plugins/auth");
const { responseWrapperPlugin } = require('./src/plugins/responseWrapperPlugin');
const { securityPlugin } = require('./src/plugins/securityPlugin');
const { healthMetricsPlugin } = require("./src/plugins/healthMetricsPlugin");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    // host: "localhost",
    host: "0.0.0.0",
    routes: {
      validate: {
        failAction: async (request, h, err) => {
          throw err;
        },
      },
      cors: {
        // origin: ["http://localhost:3001",
        //   "https://loquacious-bavarois-dc74cd.netlify.app"
        // ],
        origin:['*'],
        credentials: true,
      },
    },
  });

  await server.register(prismaPlugin);
  await server.register(swaggerPlugin); // url: '/documentation',
  await server.register(authPlugin);
  await server.register(securityPlugin);
  await server.register(healthMetricsPlugin);
  await server.register(responseWrapperPlugin);
  

  server.route(routes);

  await server.start();
  console.log(`🚀 Server running at: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.error(err);
  process.exit(1);
});

init();