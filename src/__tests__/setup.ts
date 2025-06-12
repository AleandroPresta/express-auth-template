/**
 * Test setup configuration
 */

import { PrismaClient } from '@prisma/client';

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
    const deleteUsers = prisma.user.deleteMany();
    const deleteTokens = prisma.refreshToken.deleteMany();

    await prisma.$transaction([deleteTokens, deleteUsers]);
});

export { prisma };
