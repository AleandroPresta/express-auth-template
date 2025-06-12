/**
 * Rate limiting middleware
 * Protects endpoints from abuse
 */

import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { sendError } from '../utils/response';

/**
 * General API rate limiter
 */
export const generalLimiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX_REQUESTS,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        sendError(res, 'Too many requests, please try again later.', undefined, 429);
    },
});

/**
 * Login rate limiter - 5 attempts per 15 minutes (disabled in test)
 */
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: 'Too many login attempts from this IP, please try again after 15 minutes.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    skip: () => process.env.NODE_ENV === 'test', // Skip rate limiting in tests
    handler: (req, res) => {
        sendError(res, 'Too many login attempts, please try again after 15 minutes.', undefined, 429);
    },
});

/**
 * Register rate limiter - 3 attempts per hour (disabled in test)
 */
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    message: 'Too many registration attempts from this IP, please try again after 1 hour.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: () => process.env.NODE_ENV === 'test', // Skip rate limiting in tests
    handler: (req, res) => {
        sendError(res, 'Too many registration attempts, please try again after 1 hour.', undefined, 429);
    },
});
