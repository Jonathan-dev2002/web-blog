const client = require('prom-client');

// เริ่มเก็บ default metrics ของ Node.js ทุก 5 วินาที
client.collectDefaultMetrics({ timeout: 5000 });

// สร้าง Histogram สำหรับวัดเวลาในการตอบ HTTP request
const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.1, 0.5, 1, 2, 5]
});

// สร้าง Counter สำหรับนับจำนวน HTTP request
const httpRequestCount = new client.Counter({
    name: 'http_request_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code']
});

exports.healthMetricsPlugin = {
    name: 'healthMetrics',
    version: '1.0.0',
    register: async (server) => {

        //Health-check endpoint
        server.route({
            method: 'GET',
            path: '/health',
            options: { auth: false },
            handler: async (request, h) => {
                try {
                    // เช็กฐานข้อมูลว่าเชื่อมต่อได้
                    await server.app.prisma.$queryRaw`SELECT 1`;
                    return h.response({ status: 'ok' }).code(200);
                } catch (err) {
                    return h.response({ status: 'error', detail: err.message }).code(503);
                }
            }
        });

        //Metrics endpoint สำหรับ Prometheus
        server.route({
            method: 'GET',
            path: '/metrics',
            options: { auth: false },
            handler: async (request, h) => {
                try {
                    const metrics = await client.register.metrics();
                    return h.response(metrics).type(client.register.contentType);
                } catch (err) {
                    console.error('Error collecting metrics:', err);
                    // ส่งกลับข้อความเรียบง่าย ไม่ให้ wrapper ดักเพราะเรสปอนส์ยัง skip อยู่
                    return h.response('Error collecting metrics').code(500);
                }
            }
        });

        //Instrumentation: เริ่มจับเวลาเมื่อรับ request
        server.ext('onRequest', (request, h) => {
            request.plugins = request.plugins || {};
            request.plugins.startTime = process.hrtime();
            return h.continue;
        });

        //หลังเตรียม response แล้ว วัดเวลา+นับ Counter
        server.ext('onPreResponse', (request, h) => {
            const diff = process.hrtime(request.plugins.startTime);
            const duration = diff[0] + diff[1] / 1e9;

            const method = request.method.toUpperCase();
            const route = request.route.path;
            const status = request.response.isBoom
                ? request.response.output.statusCode
                : request.response.statusCode || 200;

            httpRequestDuration.labels(method, route, status).observe(duration);
            httpRequestCount.labels(method, route, status).inc();

            return h.continue;
        });
    }
};