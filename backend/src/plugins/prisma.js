const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.prismaPlugin = {
  name: 'prisma',
  version: '1.0.0',
  register: async function (server) {
    server.app.prisma = prisma;

    server.ext('onPostStop', async () => {
      await prisma.$disconnect();
    });
  }
};