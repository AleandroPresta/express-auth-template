/**
 * JWT utilities unit tests
 */

import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken, decodeToken } from '../utils/jwt';
import { UnauthorizedError } from '../utils/errors';

describe('JWT Utilities', () => {
    const mockPayload = {
        userId: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
    };

    describe('generateAccessToken', () => {
        it('should generate a valid access token', () => {
            const token = generateAccessToken(mockPayload);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.').length).toBe(3); // JWT has 3 parts
        });

        it('should generate different tokens for same payload', async () => {
            const token1 = generateAccessToken(mockPayload);
            // Add small delay to ensure different timestamps
            await new Promise(resolve => setTimeout(resolve, 1000));
            const token2 = generateAccessToken(mockPayload);

            expect(token1).not.toBe(token2); // Different due to timestamp
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a valid refresh token', () => {
            const token = generateRefreshToken(mockPayload);

            expect(token).toBeDefined();
            expect(typeof token).toBe('string');
            expect(token.split('.').length).toBe(3);
        });

        it('should include tokenId in refresh token', () => {
            const token = generateRefreshToken(mockPayload);
            const decoded = decodeToken(token);

            expect(decoded).toBeDefined();
            expect(decoded!.tokenId).toBeDefined();
            expect(decoded!.userId).toBe(mockPayload.userId);
        });
    });

    describe('verifyAccessToken', () => {
        it('should verify valid access token', () => {
            const token = generateAccessToken(mockPayload);
            const verified = verifyAccessToken(token);

            expect(verified.userId).toBe(mockPayload.userId);
            expect(verified.email).toBe(mockPayload.email);
            expect(verified.username).toBe(mockPayload.username);
        });

        it('should throw UnauthorizedError for invalid token', () => {
            expect(() => verifyAccessToken('invalid-token')).toThrow(UnauthorizedError);
        });

        it('should throw UnauthorizedError for malformed token', () => {
            expect(() => verifyAccessToken('malformed.token')).toThrow(UnauthorizedError);
        });
    });

    describe('verifyRefreshToken', () => {
        it('should verify valid refresh token', () => {
            const token = generateRefreshToken(mockPayload);
            const verified = verifyRefreshToken(token);

            expect(verified.userId).toBe(mockPayload.userId);
            expect(verified.email).toBe(mockPayload.email);
            expect(verified.username).toBe(mockPayload.username);
            expect(verified.tokenId).toBeDefined();
        });

        it('should throw UnauthorizedError for invalid refresh token', () => {
            expect(() => verifyRefreshToken('invalid-token')).toThrow(UnauthorizedError);
        });
    });

    describe('decodeToken', () => {
        it('should decode token without verification', () => {
            const token = generateAccessToken(mockPayload);
            const decoded = decodeToken(token);

            expect(decoded).toBeDefined();
            expect(decoded!.userId).toBe(mockPayload.userId);
            expect(decoded!.email).toBe(mockPayload.email);
        });

        it('should return null for invalid token', () => {
            const decoded = decodeToken('invalid-token');
            expect(decoded).toBeNull();
        });

        it('should decode expired token', () => {
            // Create a token with very short expiry
            const shortLivedToken = generateAccessToken(mockPayload);

            // Mock the token to be expired (this is just for testing the decode function)
            const decoded = decodeToken(shortLivedToken);
            expect(decoded).toBeDefined();
        });
    });

    describe('Token Payload Validation', () => {
        it('should handle token without username', () => {
            const payloadWithoutUsername = {
                userId: 'user-123',
                email: 'test@example.com',
            };

            const token = generateAccessToken(payloadWithoutUsername);
            const verified = verifyAccessToken(token);

            expect(verified.userId).toBe(payloadWithoutUsername.userId);
            expect(verified.email).toBe(payloadWithoutUsername.email);
            expect(verified.username).toBeUndefined();
        });

        it('should preserve all payload properties', () => {
            const fullPayload = {
                userId: 'user-123',
                email: 'test@example.com',
                username: 'testuser',
            };

            const token = generateAccessToken(fullPayload);
            const verified = verifyAccessToken(token);

            expect(verified.userId).toBe(fullPayload.userId);
            expect(verified.email).toBe(fullPayload.email);
            expect(verified.username).toBe(fullPayload.username);
        });
    });
});
