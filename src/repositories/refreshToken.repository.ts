/**
 * Refresh token repository
 * Handles database operations for refresh tokens
 */

import { RefreshToken } from '@prisma/client';
import { prisma } from '../config/database';

export interface CreateRefreshTokenData {
    token: string;
    userId: string;
    expiresAt: Date;
}

export class RefreshTokenRepository {
    /**
     * Create a new refresh token
     */
    async create(tokenData: CreateRefreshTokenData): Promise<RefreshToken> {
        return prisma.refreshToken.create({
            data: tokenData,
        });
    }

    /**
     * Find refresh token by token string
     */
    async findByToken(token: string): Promise<RefreshToken | null> {
        return prisma.refreshToken.findUnique({
            where: { token },
            include: { user: true },
        });
    }

    /**
     * Find all refresh tokens for a user
     */
    async findByUserId(userId: string): Promise<RefreshToken[]> {
        return prisma.refreshToken.findMany({
            where: { userId },
        });
    }

    /**
     * Revoke refresh token
     */
    async revokeToken(token: string): Promise<RefreshToken> {
        return prisma.refreshToken.update({
            where: { token },
            data: { isRevoked: true },
        });
    }

    /**
     * Delete refresh token
     */
    async deleteToken(token: string): Promise<RefreshToken> {
        return prisma.refreshToken.delete({
            where: { token },
        });
    }

    /**
     * Delete all refresh tokens for a user
     */
    async deleteAllUserTokens(userId: string): Promise<void> {
        await prisma.refreshToken.deleteMany({
            where: { userId },
        });
    }

    /**
     * Clean up expired tokens
     */
    async cleanupExpiredTokens(): Promise<void> {
        await prisma.refreshToken.deleteMany({
            where: {
                OR: [
                    { expiresAt: { lt: new Date() } },
                    { isRevoked: true },
                ],
            },
        });
    }
}
