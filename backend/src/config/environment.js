import dotenv from 'dotenv';
dotenv.config();

// Validación defensiva fail-fast
const requiredVars = ['PG_HOST', 'PG_DATABASE', 'PG_USER', 'PG_PASSWORD'];
const missingVars = requiredVars.filter(v => !process.env[v]);

if (missingVars.length > 0) {
    console.warn(`⚠️ [NODOVIAJA ADVERTENCIA] Faltan variables en .env: ${missingVars.join(', ')}`);
}

export const config = {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    postgres: {
        host: process.env.PG_HOST || 'localhost',
        port: parseInt(process.env.PG_PORT || '5432', 10),
        database: process.env.PG_DATABASE || 'DataBase_NodoViaja',
        user: process.env.PG_USER || 'postgres',
        password: process.env.PG_PASSWORD || 'root',
        max: parseInt(process.env.PG_MAX_POOL || '10', 10),
        idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || '30000', 10)
    },
};