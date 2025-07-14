const rateLimit = require('hapi-rate-limit');
const headerPlugin = require('hapi-plugin-header');

exports.securityPlugin = {
  name: 'security',
  version: '1.0.0',
  register: async function (server) {

    //Rate limiting: สูงสุด 100 requests ต่อ IP ต่อ 1 นาที
    await server.register({
      plugin: rateLimit,
      options: {
        userLimit: 100,
        userCache: { expiresIn: 60 * 1000 }, // 1 นาที
        addressOnly: true,                   // จำกัดตาม IP
      },
    });

    //Security headers: ตั้งหัวข้อ HTTP Header ต่าง ๆ
    await server.register({
      plugin: headerPlugin,
      options: {

        // บังคับให้ใช้ HTTPS ทุกครั้ง (HSTS)
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',

        // ป้องกัน clickjacking
        'X-Frame-Options': 'DENY',

        // ป้องกัน MIME sniffing
        'X-Content-Type-Options': 'nosniff',

        // ควบคุม referrer
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        
        // จำกัดสิทธิ์ API บนเบราว์เซอร์
        'Permissions-Policy': 'geolocation=()',
        // CSP เบื้องต้น: โหลดเฉพาะจากตัวเอง และอนุญาตรูปเป็น data URI
        'Content-Security-Policy': "default-src 'self'; img-src 'self' data:;"
      },
    });
  }
};