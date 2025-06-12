/**
 * Environment configuration utility
 * Validates and provides type-safe access to environment variables
 */

import dotenv from 'dotenv';

dotenv.config();

interface Config {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
    JWT_ACCESS_EXPIRES_IN: string;
    JWT_REFRESH_EXPIRES_IN: string;
    RATE_LIMIT_WINDOW_MS: number;
    RATE_LIMIT_MAX_REQUESTS: number;
    CORS_ORIGIN: string[];
    BCRYPT_ROUNDS: number;
}

const getConfig = (): Config => {
    const requiredEnvVars = [
        'DATABASE_URL',
        'JWT_ACCESS_SECRET',
        'JWT_REFRESH_SECRET',
    ];

    // Check for required environment variables
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing required environment variable: ${envVar}`);
        }
    }

    return {
        NODE_ENV: process.env['NODE_ENV'] || 'development',
        PORT: parseInt(process.env['PORT'] || '3000', 10),
        DATABASE_URL: process.env['DATABASE_URL']!,
        JWT_ACCESS_SECRET: process.env['JWT_ACCESS_SECRET']!,
        JWT_REFRESH_SECRET: process.env['JWT_REFRESH_SECRET']!,
        JWT_ACCESS_EXPIRES_IN: process.env['JWT_ACCESS_EXPIRES_IN'] || '15m',
        JWT_REFRESH_EXPIRES_IN: process.env['JWT_REFRESH_EXPIRES_IN'] || '7d',
        RATE_LIMIT_WINDOW_MS: parseInt(process.env['RATE_LIMIT_WINDOW_MS'] || '900000', 10),
        RATE_LIMIT_MAX_REQUESTS: parseInt(process.env['RATE_LIMIT_MAX_REQUESTS'] || '100', 10),
        CORS_ORIGIN: process.env['CORS_ORIGIN']?.split(',') || ['http://localhost:3000'],
        BCRYPT_ROUNDS: parseInt(process.env['BCRYPT_ROUNDS'] || '12', 10),
    };
};

export const config = getConfig();
