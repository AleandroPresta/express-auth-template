/**
 * Authentication routes integration tests
 */

import request from 'supertest';
import { createApp } from '../app';
import { prisma } from './setup';

const app = createApp();

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
            expect(response.body.data.accessToken).toBeDefined();
            expect(response.body.data.refreshToken).toBeDefined();
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
            expect(response.body.data.accessToken).toBeDefined();
            expect(response.body.data.refreshToken).toBeDefined();
        });

        it('should reject invalid credentials', async () => {
            const loginData = {
                email: 'test@example.com',
                password: 'wrongpassword',
            };

            const response = await request(app)
                .post('/api/v1/auth/login')
                .send(loginData)
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });

    describe('GET /api/v1/auth/user/profile', () => {
        let accessToken: string;

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
        });

        it('should get user profile with valid token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/user/profile')
                .set('Authorization', `Bearer ${accessToken}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('test@example.com');
        });

        it('should reject request without token', async () => {
            const response = await request(app)
                .get('/api/v1/auth/user/profile')
                .expect(401);

            expect(response.body.success).toBe(false);
        });
    });
});
