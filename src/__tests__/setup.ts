/**
 * Test setup configuration
 */

import { PrismaClient } from '@prisma/client';

// Set test environment variables before importing anything else
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://postgres:password@localhost:5432/auth_test_db?schema=public';
process.env.JWT_SECRET = 'test_super_secret_key_for_testing_only';
process.env.JWT_REFRESH_SECRET = 'test_super_secret_refresh_key_for_testing_only';
process.env.BCRYPT_ROUNDS = '10';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'postgresql://postgres:password@localhost:5432/auth_test_db?schema=public',
        },
    },
});

// Setup and teardown for tests
beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

// Clean up database after each test
afterEach(async () => {
    try {
        const deleteUsers = prisma.user.deleteMany();
        const deleteTokens = prisma.refreshToken.deleteMany();

        await prisma.$transaction([deleteTokens, deleteUsers]);
    } catch (error) {
        console.error('Error cleaning up database:', error);
    }
});

export { prisma };
