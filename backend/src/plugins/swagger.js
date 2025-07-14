const Inert = require("@hapi/inert");
const Vision = require("@hapi/vision");
const HapiSwagger = require("hapi-swagger");
const Package = require("../../package.json"); // ดึง metadata มาใช้ใน Swagger

exports.swaggerPlugin = {
  name: "swagger",
  version: "1.0.0",
  register: async function (server) {
    // Register Swagger Plugins
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: "My API Documentation",
            version: Package.version,
            description: "This is a sample API documentation",
          },
          grouping: "tags", // แสดงกลุ่มตาม tag ใน controller
        },
      },
    ]);
  },
};