import { pool, mongoose } from '../config/db.js';

export async function getHealthStatus(req, res) {
    const services = {
        api: { status: 'up', uptime_seconds: Math.floor(process.uptime()) },
        postgres: { status: 'down', latency_ms: null, error: null },
    };

    // 1. Evaluar PostgreSQL Pool
    const pgStart = Date.now();
    try {
        await pool.query('SELECT NOW()');
        services.postgres.latency_ms = Date.now() - pgStart;
        services.postgres.status = 'healthy';
    } catch (err) {
        services.postgres.latency_ms = Date.now() - pgStart;
        services.postgres.error = err.message;
    }

    const isHealthy = services.postgres.status === 'healthy';
    return res.status(isHealthy ? 200 : 503).json({
        status: isHealthy ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        services
    });
}