const Boom = require('@hapi/boom');

function requireAdmin(request, h) {
  const { role } = request.auth.credentials;
  if (role !== 'ADMIN') {

    throw Boom.forbidden('Admins only');
  }
  return h.continue;
}

module.exports = { requireAdmin };