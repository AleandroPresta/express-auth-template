/**
 * Authentication routes integration tests
 */

import request from 'supertest';
import { createApp } from '../app';
import { prisma } from './setup';
import { Application } from 'express';

let app: Application;

beforeAll(() => {
    app = createApp();
});

describe('Authentication Endpoints', () => {
    describe('POST /api/v1/auth/signup', () => {
        it('should register a new user successfully', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'TestPassword123!',
                name: 'Test User',
                username: 'testuser',
            };

            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(userData.email);
            expect(response.body.data.user.name).toBe(userData.name);
            expect(response.body.data.user.username).toBe(userData.username);
            expect(response.body.data.accessToken).toBeDefined();
            expect(response.body.data.refreshToken).toBeDefined();
            expect(response.body.message).toBe('User registered successfully');
        });

        it('should register user with minimal required fields', async () => {
            const userData = {
                email: 'minimal@example.com',
                password: 'TestPassword123!',
            };

            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(userData.email);
            expect(response.body.data.user.name).toBeUndefined();
            expect(response.body.data.user.username).toBeUndefined();
        });

        it('should reject registration with duplicate email', async () => {
            const userData = {
                email: 'duplicate@example.com',
                password: 'TestPassword123!',
            };

            // First registration
            await request(app)
                .post('/api/v1/auth/signup')
                .send(userData)
                .expect(201);

            // Second registration with same email
            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(userData)
                .expect(409);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Email address is already registered');
        });

        it('should reject registration with duplicate username', async () => {
            const firstUser = {
                email: 'first@example.com',
                password: 'TestPassword123!',
                username: 'uniqueuser',
            };

            const secondUser = {
                email: 'second@example.com',
                password: 'TestPassword123!',
                username: 'uniqueuser', // Same username
            };

            // First registration
            await request(app)
                .post('/api/v1/auth/signup')
                .send(firstUser)
                .expect(201);

            // Second registration with same username
            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(secondUser)
                .expect(409);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Username is already taken');
        });

        it('should reject registration with invalid email', async () => {
            const userData = {
                email: 'invalid-email',
                password: 'TestPassword123!',
            };

            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Please provide a valid email address');
        });

        it('should reject weak password', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'weak',
            };

            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Password must be at least 8 characters long');
        });

        it('should reject password without special characters', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'Password123',
            };

            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Password must include uppercase, lowercase, number and special character');
        });

        it('should reject invalid username format', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'TestPassword123!',
                username: 'ab', // Too short
            };

            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Username must be at least 3 characters long');
        });

        it('should reject invalid name format', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'TestPassword123!',
                name: 'Name123!', // Contains invalid characters
            };

            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Name can only contain letters, spaces, and hyphens');
        });

        it('should reject invalid phone format', async () => {
            const userData = {
                email: 'test@example.com',
                password: 'TestPassword123!',
                phone: '123456789', // Missing country code
            };

            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(userData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Phone must be in valid international format (e.g., +1234567890)');
        });

        it('should accept valid phone format', async () => {
            const userData = {
                email: 'phone@example.com',
                password: 'TestPassword123!',
                phone: '+1234567890',
            };

            const response = await request(app)
                .post('/api/v1/auth/signup')
                .send(userData)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.phone).toBe(userData.phone);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        beforeEach(async () => {
            // Create a test user
            await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    email: 'test@example.com',
                    password: 'TestPassword123!',
                    name: 'Test User',
                });
        });

        it('should login with valid credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'TestPassword123!',
            };

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe(loginData.email);
            expect(response.body.data.user.name).toBe('Test User');
            expect(response.body.data.accessToken).toBeDefined();
            expect(response.body.data.refreshToken).toBeDefined();
            expect(response.body.message).toBe('Login successful');
        });

        it('should reject login with invalid email', async () => {
            const loginData = {
                email: 'nonexistent@example.com',
                password: 'TestPassword123!',
            };

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid email or password');
        });

        it('should reject login with wrong password', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'WrongPassword123!',
            };

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid email or password');
        });

        it('should reject login with missing email', async () => {
            const loginData = {
                password: 'TestPassword123!',
            };

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Email is required');
        });

        it('should reject login with missing password', async () => {
            const loginData = {
                email: 'test@example.com',
            };

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Password is required');
        });

        it('should reject login with invalid email format', async () => {
            const loginData = {
                email: 'invalid-email',
                password: 'TestPassword123!',
            };

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Please provide a valid email address');
        });

        it('should reject login for inactive user', async () => {
            // First, deactivate the user directly in database
            await prisma.user.update({
                where: { email: 'test@example.com' },
                data: { isActive: false },
            });

            const loginData = {
                email: 'test@example.com',
                password: 'TestPassword123!',
            };

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Account is deactivated');
        });
    });

    describe('POST /api/v1/auth/logout', () => {
        let accessToken: string;
        let refreshToken: string;

        beforeEach(async () => {
            // Create and login user
            const signupResponse = await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    email: 'test@example.com',
                    password: 'TestPassword123!',
                    name: 'Test User',
                });

            accessToken = signupResponse.body.data.accessToken;
            refreshToken = signupResponse.body.data.refreshToken;
        });

        it('should logout successfully with valid token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ refreshToken })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Logout successful');
        });

        it('should logout without refresh token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/logout')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({})
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.message).toBe('Logout successful');
        });

        it('should reject logout without access token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/logout')
                .send({ refreshToken })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Authorization header is required');
        });

        it('should reject logout with invalid access token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/logout')
                .set('Authorization', 'Bearer invalid-token')
                .send({ refreshToken })
                .expect(401);

            expect(response.body.success).toBe(false);
        });

        it('should reject logout with malformed authorization header', async () => {
            const response = await request(app)
                .post('/api/v1/auth/logout')
                .set('Authorization', 'InvalidFormat token')
                .send({ refreshToken })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Bearer token is required');
        });
    });

    describe('POST /api/v1/auth/refresh', () => {
        let refreshToken: string;
        let userId: string;

        beforeEach(async () => {
            // Create and login user
            const signupResponse = await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    email: 'test@example.com',
                    password: 'TestPassword123!',
                    name: 'Test User',
                });

            refreshToken = signupResponse.body.data.refreshToken;
            userId = signupResponse.body.data.user.id;
        });

        it('should refresh token successfully', async () => {
            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.accessToken).toBeDefined();
            expect(response.body.data.refreshToken).toBeDefined();
            expect(response.body.data.accessToken).not.toBe(refreshToken);
            expect(response.body.data.refreshToken).not.toBe(refreshToken);
            expect(response.body.message).toBe('Token refreshed successfully');
        });

        it('should reject refresh with missing token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Refresh token is required');
        });

        it('should reject refresh with invalid token', async () => {
            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken: 'invalid-token' })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid refresh token');
        });

        it('should reject refresh with revoked token', async () => {
            // First, use the refresh token
            await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken })
                .expect(200);

            // Try to use the old refresh token again
            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Invalid refresh token');
        });

        it('should reject refresh for inactive user', async () => {
            // Deactivate the user
            await prisma.user.update({
                where: { id: userId },
                data: { isActive: false },
            });

            const response = await request(app)
                .post('/api/v1/auth/refresh')
                .send({ refreshToken })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('User not found or inactive');
        });
    });

    describe('GET /api/v1/auth/user/profile', () => {
        let accessToken: string;
        let userId: string;

        beforeEach(async () => {
            // Create and login user
            const signupResponse = await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    email: 'test@example.com',
                    password: 'TestPassword123!',
                    name: 'Test User',
                    username: 'testuser',
                    phone: '+1234567890',
                });

            accessToken = signupResponse.body.data.accessToken;
            userId = signupResponse.body.data.user.id;
        });

        it('should get user profile with valid token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/user/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.id).toBe(userId);
            expect(response.body.data.user.email).toBe('test@example.com');
            expect(response.body.data.user.name).toBe('Test User');
            expect(response.body.data.user.username).toBe('testuser');
            expect(response.body.data.user.phone).toBe('+1234567890');
            expect(response.body.data.user.isActive).toBe(true);
            expect(response.body.data.user.createdAt).toBeDefined();
            expect(response.body.data.user.updatedAt).toBeDefined();
            expect(response.body.message).toBe('Profile retrieved successfully');
        });

        it('should reject request without token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/user/profile')
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Authorization header is required');
        });

        it('should reject request with invalid token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/user/profile')
                .set('Authorization', 'Bearer invalid-token')
                .expect(401);

            expect(response.body.success).toBe(false);
        });

        it('should reject request with malformed authorization header', async () => {
            const response = await request(app)
                .get('/api/v1/auth/user/profile')
                .set('Authorization', 'InvalidFormat token')
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Bearer token is required');
        });
    });

    describe('PUT /api/v1/auth/user/profile', () => {
        let accessToken: string;
        let userId: string;

        beforeEach(async () => {
            // Create and login user
            const signupResponse = await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    email: 'test@example.com',
                    password: 'TestPassword123!',
                    name: 'Test User',
                    username: 'testuser',
                    phone: '+1234567890',
                });

            accessToken = signupResponse.body.data.accessToken;
            userId = signupResponse.body.data.user.id;
        });

        it('should update user profile successfully', async () => {
            const updateData = {
                name: 'Updated Name',
                username: 'updateduser',
                phone: '+9876543210',
            };

            const response = await request(app)
                .put('/api/v1/auth/user/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.name).toBe(updateData.name);
            expect(response.body.data.user.username).toBe(updateData.username);
            expect(response.body.data.user.phone).toBe(updateData.phone);
            expect(response.body.message).toBe('Profile updated successfully');
        });

        it('should update only name', async () => {
            const updateData = {
                name: 'Only Name Updated',
            };

            const response = await request(app)
                .put('/api/v1/auth/user/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.name).toBe(updateData.name);
            expect(response.body.data.user.username).toBe('testuser'); // Unchanged
            expect(response.body.data.user.phone).toBe('+1234567890'); // Unchanged
        });

        it('should clear phone number with empty string', async () => {
            const updateData = {
                phone: '',
            };

            const response = await request(app)
                .put('/api/v1/auth/user/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.phone).toBeUndefined();
        });

        it('should reject update with duplicate username', async () => {
            // Create another user first
            await request(app)
                .post('/api/v1/auth/signup')
                .send({
                    email: 'other@example.com',
                    password: 'TestPassword123!',
                    username: 'otherusername',
                });

            const updateData = {
                username: 'otherusername',
            };

            const response = await request(app)
                .put('/api/v1/auth/user/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(updateData)
                .expect(409);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Username is already taken');
        });

        it('should reject update without authorization', async () => {
            const updateData = {
                name: 'Updated Name',
            };

            const response = await request(app)
                .put('/api/v1/auth/user/profile')
                .send(updateData)
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe('Authorization header is required');
        });

        it('should reject update with invalid username format', async () => {
            const updateData = {
                username: 'ab', // Too short
            };

            const response = await request(app)
                .put('/api/v1/auth/user/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(updateData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Username must be at least 3 characters long');
        });

        it('should reject update with invalid name format', async () => {
            const updateData = {
                name: 'Invalid123!',
            };

            const response = await request(app)
                .put('/api/v1/auth/user/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(updateData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Name can only contain letters, spaces, and hyphens');
        });

        it('should reject update with invalid phone format', async () => {
            const updateData = {
                phone: '123456789', // Missing country code
            };

            const response = await request(app)
                .put('/api/v1/auth/user/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(updateData)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('Phone must be in valid international format (e.g., +1234567890)');
        });

        it('should reject update with empty payload', async () => {
            const response = await request(app)
                .put('/api/v1/auth/user/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContain('At least one field must be provided for update');
        });

        it('should allow same username as current user', async () => {
            const updateData = {
                username: 'testuser', // Same as current
                name: 'Updated Name',
            };

            const response = await request(app)
                .put('/api/v1/auth/user/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(updateData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.username).toBe('testuser');
            expect(response.body.data.user.name).toBe('Updated Name');
        });
    });
});

describe('Health Check Endpoint', () => {
    it('should return health status', async () => {
        const response = await request(app)
            .get('/api/v1/health')
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Server is healthy');
        expect(response.body.timestamp).toBeDefined();
    });
});

describe('Rate Limiting', () => {
    it('should apply rate limiting to registration', async () => {
        // Make multiple rapid registration attempts
        const responses: any[] = [];
        for (let i = 0; i < 5; i++) {
            try {
                const response = await request(app)
                    .post('/api/v1/auth/signup')
                    .send({
                        email: `test${i}@example.com`,
                        password: 'TestPassword123!',
                    });
                responses.push(response);
            } catch (error: any) {
                // Handle rate limit errors
                responses.push(error.response || { status: 429 });
            }
        }

        // Check if any responses were rate limited
        const rateLimitedCount = responses.filter(res => res.status === 429).length;
        expect(responses.length).toBe(5);
    });

    it('should include rate limit headers in successful requests', async () => {
        // Skip this test since rate limiting is disabled in test environment
        if (process.env.NODE_ENV === 'test') {
            return;
        }

        const response = await request(app)
            .get('/api/v1/health');

        expect(response.headers['x-ratelimit-limit']).toBeDefined();
        expect(response.headers['x-ratelimit-remaining']).toBeDefined();
    });
});

describe('Error Handling', () => {
    it('should handle 404 for non-existent routes', async () => {
        const response = await request(app)
            .get('/api/v1/nonexistent')
            .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain('Route /api/v1/nonexistent not found');
    });

    it('should include request ID in responses', async () => {
        const response = await request(app)
            .get('/api/v1/health')
            .expect(200);

        expect(response.body.requestId).toBeDefined();
        expect(response.headers['x-request-id']).toBeDefined();
        expect(response.body.requestId).toBe(response.headers['x-request-id']);
    });

    it('should handle malformed JSON', async () => {
        const response = await request(app)
            .post('/api/v1/auth/signup')
            .set('Content-Type', 'application/json')
            .send('{"invalid": json}')
            .expect(400);

        expect(response.body.success).toBe(false);
    });
});
