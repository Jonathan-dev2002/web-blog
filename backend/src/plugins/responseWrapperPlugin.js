const { successResponse, errorResponse } = require('../utils/responseWrapper');

exports.responseWrapperPlugin = {
  name: 'responseWrapper',
  version: '1.0.0',
  register: async (server) => {
    server.ext('onPreResponse', (request, h) => {

      // Skip wrapping for health & metrics endpoints
      if (request.path === '/health' || request.path === '/metrics') {
        return h.continue;
      }

      const response = request.response;

      // ถ้าเป็น Boom error (isBoom === true) ก็ใช้ errorResponse
      if (response.isBoom) {
        const err = response;
        const message = err.output.payload.message || 'Internal Error';
        const statusCode = err.output.statusCode || 500;
        return errorResponse(h, message, statusCode);
      }

      // ถ้าเป็น JSON response ให้ wrap ด้วย successResponse
      // เช็ก content-type ว่า JSON หรือ plain
      const contentType = response.headers && response.headers['content-type'];
      if (
        response.source != null &&
        ((contentType && contentType.includes('application/json')) ||
          typeof response.source === 'object')
      ) {
        return successResponse(h, response.source);
      }

      // กรณีอื่น (เช่น ไฟล์, สตรีม) ไม่ยุ่ง
      return h.continue;
    });
  }
};