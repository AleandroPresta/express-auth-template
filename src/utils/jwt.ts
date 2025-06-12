/**
 * JWT token utilities
 */

import jwt, { SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { UnauthorizedError } from './errors';

export interface TokenPayload {
    userId: string;
    email: string;
    username?: string | undefined;
    tokenId?: string;
    exp?: number;
    iat?: number;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}

/**
 * Generate access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
    return (jwt.sign as any)(
        {
            userId: payload.userId,
            email: payload.email,
            username: payload.username,
        },
        config.JWT_ACCESS_SECRET,
        {
            expiresIn: config.JWT_ACCESS_EXPIRES_IN,
            issuer: 'express-auth-server',
            audience: 'express-auth-client',
        }
    );
};

/**
 * Generate refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
    return (jwt.sign as any)(
        { ...payload, tokenId: uuidv4() },
        config.JWT_REFRESH_SECRET,
        {
            expiresIn: config.JWT_REFRESH_EXPIRES_IN,
            issuer: 'express-auth-server',
            audience: 'express-auth-client',
        }
    );
};

/**
 * Generate token pair
 */
export const generateTokenPair = (payload: TokenPayload): TokenPair => {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return { accessToken, refreshToken };
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, config.JWT_ACCESS_SECRET, {
            issuer: 'express-auth-server',
            audience: 'express-auth-client',
        }) as TokenPayload;
    } catch (error) {
        throw new UnauthorizedError('Invalid access token');
    }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
    try {
        return jwt.verify(token, config.JWT_REFRESH_SECRET, {
            issuer: 'express-auth-server',
            audience: 'express-auth-client',
        }) as TokenPayload;
    } catch (error) {
        throw new UnauthorizedError('Invalid refresh token');
    }
};

/**
 * Decode token without verification (for expired tokens)
 */
export const decodeToken = (token: string): TokenPayload | null => {
    try {
        return jwt.decode(token) as TokenPayload;
    } catch (error) {
        return null;
    }
};
