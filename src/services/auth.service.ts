/**
 * Authentication service
 * Business logic for authentication operations
 */

import bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UserRepository, CreateUserData, UpdateUserData } from '../repositories/user.repository';
import { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import { generateTokenPair, verifyRefreshToken, TokenPair } from '../utils/jwt';
import { config } from '../config';
import {
    ConflictError,
    UnauthorizedError,
    NotFoundError,
    ValidationError,
} from '../utils/errors';

export interface SignupRequest {
    email: string;
    password: string;
    username?: string;
    name?: string;
    phone?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserProfile {
    id: string;
    email: string;
    username?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export class AuthService {
    private userRepository: UserRepository;
    private refreshTokenRepository: RefreshTokenRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.refreshTokenRepository = new RefreshTokenRepository();
    }

    /**
     * Register a new user
     */
    async signup(signupData: SignupRequest): Promise<{ user: UserProfile; tokens: TokenPair }> {
        const { email, password, username, name, phone } = signupData;

        // Check if email already exists
        if (await this.userRepository.emailExists(email)) {
            throw new ConflictError('Email address is already registered');
        }

        // Check if username already exists (if provided)
        if (username && await this.userRepository.usernameExists(username)) {
            throw new ConflictError('Username is already taken');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

        // Create user
        const userData: CreateUserData = {
            email,
            password: hashedPassword,
            username,
            name,
            phone,
        };

        const user = await this.userRepository.create(userData);

        // Generate tokens
        const tokens = generateTokenPair({
            userId: user.id,
            email: user.email,
            username: user.username || undefined,
        });

        // Store refresh token
        await this.storeRefreshToken(tokens.refreshToken, user.id);

        return {
            user: this.mapUserToProfile(user),
            tokens,
        };
    }

    /**
     * Login user
     */
    async login(loginData: LoginRequest): Promise<{ user: UserProfile; tokens: TokenPair }> {
        const { email, password } = loginData;

        // Find user by email
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Check if user is active
        if (!user.isActive) {
            throw new UnauthorizedError('Account is deactivated');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedError('Invalid email or password');
        }

        // Generate tokens
        const tokens = generateTokenPair({
            userId: user.id,
            email: user.email,
            username: user.username || undefined,
        });

        // Store refresh token
        await this.storeRefreshToken(tokens.refreshToken, user.id);

        return {
            user: this.mapUserToProfile(user),
            tokens,
        };
    }

    /**
     * Logout user
     */
    async logout(refreshToken: string): Promise<void> {
        try {
            await this.refreshTokenRepository.deleteToken(refreshToken);
        } catch (error) {
            // Token might not exist, which is fine for logout
        }
    }

    /**
     * Refresh access token
     */
    async refreshToken(refreshToken: string): Promise<TokenPair> {
        // Verify refresh token
        const payload = verifyRefreshToken(refreshToken);

        // Check if token exists and is not revoked
        const storedToken = await this.refreshTokenRepository.findByToken(refreshToken);
        if (!storedToken || storedToken.isRevoked) {
            throw new UnauthorizedError('Invalid refresh token');
        }

        // Check if token is expired
        if (storedToken.expiresAt < new Date()) {
            await this.refreshTokenRepository.deleteToken(refreshToken);
            throw new UnauthorizedError('Refresh token has expired');
        }

        // Verify user still exists and is active
        const user = await this.userRepository.findById(payload.userId);
        if (!user || !user.isActive) {
            throw new UnauthorizedError('User not found or inactive');
        }

        // Generate new tokens
        const newTokens = generateTokenPair({
            userId: user.id,
            email: user.email,
            username: user.username || undefined,
        });

        // Revoke old refresh token and store new one
        await this.refreshTokenRepository.revokeToken(refreshToken);
        await this.storeRefreshToken(newTokens.refreshToken, user.id);

        return newTokens;
    }

    /**
     * Get user profile
     */
    async getProfile(userId: string): Promise<UserProfile> {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError('User not found');
        }

        return this.mapUserToProfile(user);
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, updateData: UpdateUserData): Promise<UserProfile> {
        // Check if user exists
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new NotFoundError('User not found');
        }

        // Check if username is being updated and already exists
        if (updateData.username && updateData.username !== existingUser.username) {
            if (await this.userRepository.usernameExists(updateData.username)) {
                throw new ConflictError('Username is already taken');
            }
        }

        // Update user
        const updatedUser = await this.userRepository.updateById(userId, updateData);

        return this.mapUserToProfile(updatedUser);
    }

    /**
     * Store refresh token in database
     */
    private async storeRefreshToken(token: string, userId: string): Promise<void> {
        const payload = verifyRefreshToken(token);
        const expiresAt = new Date(payload.exp! * 1000);

        await this.refreshTokenRepository.create({
            token,
            userId,
            expiresAt,
        });
    }

    /**
     * Map user entity to profile
     */
    private mapUserToProfile(user: User): UserProfile {
        return {
            id: user.id,
            email: user.email,
            username: user.username || undefined,
            name: user.name || undefined,
            phone: user.phone || undefined,
            isActive: user.isActive,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
