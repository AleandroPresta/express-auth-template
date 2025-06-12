/**
 * Authentication service unit tests
 */

import { AuthService } from '../services/auth.service';
import { UserRepository } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { prisma } from './setup';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';

// Mock the repositories
jest.mock('../repositories/user.repository');
jest.mock('../repositories/refreshToken.repository');

const MockedUserRepository = UserRepository as jest.MockedClass<typeof UserRepository>;
const MockedRefreshTokenRepository = RefreshTokenRepository as jest.MockedClass<typeof RefreshTokenRepository>;

describe('AuthService', () => {
    let authService: AuthService;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockRefreshTokenRepository: jest.Mocked<RefreshTokenRepository>;

    beforeEach(() => {
        mockUserRepository = new MockedUserRepository() as jest.Mocked<UserRepository>;
        mockRefreshTokenRepository = new MockedRefreshTokenRepository() as jest.Mocked<RefreshTokenRepository>;
        authService = new AuthService();

        // Replace the repositories in the service
        (authService as any).userRepository = mockUserRepository;
        (authService as any).refreshTokenRepository = mockRefreshTokenRepository;
    });

    describe('signup', () => {
        const mockUser = {
            id: 'user-id',
            email: 'test@example.com',
            username: 'testuser',
            name: 'Test User',
            phone: null,
            password: 'hashed-password',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        beforeEach(() => {
            mockUserRepository.emailExists.mockResolvedValue(false);
            mockUserRepository.usernameExists.mockResolvedValue(false);
            mockUserRepository.create.mockResolvedValue(mockUser);
            mockRefreshTokenRepository.create.mockResolvedValue({
                id: 'token-id',
                token: 'refresh-token',
                userId: 'user-id',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                createdAt: new Date(),
                isRevoked: false,
            });
        });

        it('should register user successfully', async () => {
            const signupData = {
                email: 'test@example.com',
                password: 'TestPassword123!',
                username: 'testuser',
                name: 'Test User',
            };

            const result = await authService.signup(signupData);

            expect(result.user.email).toBe(signupData.email);
            expect(result.user.username).toBe(signupData.username);
            expect(result.tokens.accessToken).toBeDefined();
            expect(result.tokens.refreshToken).toBeDefined();
            expect(mockUserRepository.emailExists).toHaveBeenCalledWith(signupData.email);
            expect(mockUserRepository.usernameExists).toHaveBeenCalledWith(signupData.username);
            expect(mockUserRepository.create).toHaveBeenCalled();
        });

        it('should throw ConflictError for duplicate email', async () => {
            mockUserRepository.emailExists.mockResolvedValue(true);

            const signupData = {
                email: 'existing@example.com',
                password: 'TestPassword123!',
            };

            await expect(authService.signup(signupData)).rejects.toThrow(ConflictError);
            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });

        it('should throw ConflictError for duplicate username', async () => {
            mockUserRepository.usernameExists.mockResolvedValue(true);

            const signupData = {
                email: 'test@example.com',
                password: 'TestPassword123!',
                username: 'existinguser',
            };

            await expect(authService.signup(signupData)).rejects.toThrow(ConflictError);
            expect(mockUserRepository.create).not.toHaveBeenCalled();
        });
    });

    describe('login', () => {
        const mockUser = {
            id: 'user-id',
            email: 'test@example.com',
            username: 'testuser',
            name: 'Test User',
            phone: null,
            password: '$2b$10$SEKGUJpqAd7JiH0SSsCvZuhq8YGtwfNGdWkad/12PcPV12LN601aC', // hash of 'password123'
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should login successfully with valid credentials', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            mockRefreshTokenRepository.create.mockResolvedValue({
                id: 'token-id',
                token: 'refresh-token',
                userId: 'user-id',
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                createdAt: new Date(),
                isRevoked: false,
            });

            const loginData = {
                email: 'test@example.com',
                password: 'password123',
            };

            const result = await authService.login(loginData);

            expect(result.user.email).toBe(loginData.email);
            expect(result.tokens.accessToken).toBeDefined();
            expect(result.tokens.refreshToken).toBeDefined();
            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
        });

        it('should throw UnauthorizedError for non-existent user', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            const loginData = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };

            await expect(authService.login(loginData)).rejects.toThrow(UnauthorizedError);
        });

        it('should throw UnauthorizedError for inactive user', async () => {
            mockUserRepository.findByEmail.mockResolvedValue({
                ...mockUser,
                isActive: false,
            });

            const loginData = {
                email: 'test@example.com',
                password: 'password123',
            };

            await expect(authService.login(loginData)).rejects.toThrow(UnauthorizedError);
        });
    });

    describe('getProfile', () => {
        const mockUser = {
            id: 'user-id',
            email: 'test@example.com',
            username: 'testuser',
            name: 'Test User',
            phone: null,
            password: 'hashed-password',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        it('should return user profile', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);

            const result = await authService.getProfile('user-id');

            expect(result.id).toBe(mockUser.id);
            expect(result.email).toBe(mockUser.email);
            expect(result.username).toBe(mockUser.username);
            expect(mockUserRepository.findById).toHaveBeenCalledWith('user-id');
        });

        it('should throw NotFoundError for non-existent user', async () => {
            mockUserRepository.findById.mockResolvedValue(null);

            await expect(authService.getProfile('nonexistent-id')).rejects.toThrow(NotFoundError);
        });
    });

    describe('updateProfile', () => {
        const mockUser = {
            id: 'user-id',
            email: 'test@example.com',
            username: 'testuser',
            name: 'Test User',
            phone: null,
            password: 'hashed-password',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const updatedUser = {
            ...mockUser,
            name: 'Updated Name',
            username: 'updateduser',
        };

        it('should update user profile successfully', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockUserRepository.usernameExists.mockResolvedValue(false);
            mockUserRepository.updateById.mockResolvedValue(updatedUser);

            const updateData = {
                name: 'Updated Name',
                username: 'updateduser',
            };

            const result = await authService.updateProfile('user-id', updateData);

            expect(result.name).toBe(updateData.name);
            expect(result.username).toBe(updateData.username);
            expect(mockUserRepository.updateById).toHaveBeenCalledWith('user-id', updateData);
        });

        it('should throw ConflictError for duplicate username', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockUserRepository.usernameExists.mockResolvedValue(true);

            const updateData = {
                username: 'existinguser',
            };

            await expect(authService.updateProfile('user-id', updateData)).rejects.toThrow(ConflictError);
            expect(mockUserRepository.updateById).not.toHaveBeenCalled();
        });

        it('should allow same username as current user', async () => {
            mockUserRepository.findById.mockResolvedValue(mockUser);
            mockUserRepository.updateById.mockResolvedValue(mockUser);

            const updateData = {
                username: 'testuser', // Same as current
                name: 'Updated Name',
            };

            const result = await authService.updateProfile('user-id', updateData);

            expect(result.username).toBe('testuser');
            expect(mockUserRepository.usernameExists).not.toHaveBeenCalled();
            expect(mockUserRepository.updateById).toHaveBeenCalledWith('user-id', updateData);
        });
    });
});
