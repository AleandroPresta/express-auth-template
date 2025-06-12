/**
 * Global error handling middleware
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
import { config } from '../config';

/**
 * Global error handler middleware
 */
export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    let statusCode = 500;
    let message = 'Internal server error';
    let errors: string[] | undefined;

    // Handle operational errors
    if (error instanceof AppError && error.isOperational) {
        statusCode = error.statusCode;
        message = error.message;
    }

    // Handle JSON parsing errors
    else if (error instanceof SyntaxError && 'body' in error) {
        statusCode = 400;
        message = 'Invalid JSON format';
    }

    // Handle Prisma errors
    else if (error.name === 'PrismaClientKnownRequestError') {
        const prismaError = error as any;

        if (prismaError.code === 'P2002') {
            statusCode = 409;
            message = 'Resource already exists';

            if (prismaError.meta?.target?.includes('email')) {
                message = 'Email address is already registered';
            } else if (prismaError.meta?.target?.includes('username')) {
                message = 'Username is already taken';
            }
        } else if (prismaError.code === 'P2025') {
            statusCode = 404;
            message = 'Resource not found';
        }
    }

    // Handle validation errors
    else if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation failed';
    }

    // Log error details in development
    if (config.NODE_ENV === 'development') {
        console.error('🚨 Error Details:', {
            name: error.name,
            message: error.message,
            stack: error.stack,
            statusCode,
        });
    }

    // Send sanitized error message in production
    if (config.NODE_ENV === 'production' && statusCode === 500) {
        message = 'Something went wrong';
    }

    sendError(res, message, errors, statusCode);
};

/**
 * Handle unhandled routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
    sendError(res, `Route ${req.originalUrl} not found`, undefined, 404);
};
