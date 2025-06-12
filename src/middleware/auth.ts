/**
 * Authentication middleware
 * Verifies JWT tokens and protects routes
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { sendError } from '../utils/response';
import { UnauthorizedError } from '../utils/errors';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        username?: string;
    };
}

/**
 * Authentication middleware
 */
export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            sendError(res, 'Authorization header is required', undefined, 401);
            return;
        }

        const token = authHeader.split(' ')[1];

        if (!token || !authHeader.startsWith('Bearer ')) {
            sendError(res, 'Bearer token is required', undefined, 401);
            return;
        }

        const payload = verifyAccessToken(token);

        req.user = {
            userId: payload.userId,
            email: payload.email,
            username: payload.username,
        };

        next();
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            sendError(res, error.message, undefined, 401);
            return;
        }
        sendError(res, 'Authentication failed', undefined, 401);
    }
};
