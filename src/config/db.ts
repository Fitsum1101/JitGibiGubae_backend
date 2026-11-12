import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma/client';

const databaseUrl = process.env['DATABASE_URL'];

if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const isProduction = process.env.NODE_ENV === 'Production';

// Initialize the native PostgreSQL connection pool
const pool = new Pool({
  connectionString: databaseUrl,
  max: Number(process.env.DATABASE_CONNECTION_LIMIT) || 10,
  idleTimeoutMillis: 300_000, // 300s (in milliseconds for pg)
  connectionTimeoutMillis: 10_000, // 10s timeout
  ssl: isProduction ? { rejectUnauthorized: true } : false,
});

// Pass the pool into the Prisma PostgreSQL adapter
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
  log: isProduction ? ['error'] : ['query', 'error', 'warn'],
});

let isConnected = false;

/**
 * Connect to the database (singleton).
 * Call once at application startup.
 */
export const connectDB = async (): Promise<PrismaClient> => {
  if (isConnected) {
    console.log('✅ Using existing Prisma connection');
    return prisma;
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    isConnected = true;
    console.log('🎯 Prisma connected to PostgreSQL database');
    return prisma;
  } catch (error: unknown) {
    const err = error as { message?: string; code?: string };
    console.error('❌ Prisma connection error:', err.message);

    if (err.code === 'P1001') {
      console.error(
        '❌ Cannot reach database server. Check if PostgreSQL is running and DATABASE_URL is correct.'
      );
    } else if (err.code === 'P1017') {
      console.error('❌ Database connection was closed. Check your credentials.');
    }

    isConnected = false;
    throw error;
  }
};

/**
 * Get the Prisma client instance.
 */
export const getPrisma = (): PrismaClient => prisma;

/**
 * Health-check: verify the database is reachable.
 */
export const checkConnection = async (): Promise<{
  connected: boolean;
  error?: string;
}> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { connected: true };
  } catch (error: unknown) {
    isConnected = false;
    const err = error as { message?: string };
    return { connected: false, error: err.message ?? 'Unknown error' };
  }
};

/**
 * Gracefully disconnect Prisma and the connection pool.
 * Call on process SIGTERM / SIGINT.
 */
export const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
  await pool.end();
  isConnected = false;
  console.log('✅ Prisma and PostgreSQL pool connections closed');
};

// Graceful shutdown hooks
process.on('SIGTERM', async () => {
  await disconnectDB();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

export { prisma };
