/**
 * Database configuration and Prisma client setup
 */

import { PrismaClient } from '@prisma/client';
import { config } from '../config';

// Create Prisma client with connection pooling
export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: config.DATABASE_URL,
        },
    },
    log: config.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

/**
 * Initialize database connection
 */
export const initializeDatabase = async (): Promise<void> => {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
};

/**
 * Gracefully disconnect from database
 */
export const disconnectDatabase = async (): Promise<void> => {
    try {
        await prisma.$disconnect();
        console.log('✅ Database disconnected successfully');
    } catch (error) {
        console.error('❌ Database disconnection failed:', error);
    }
};
