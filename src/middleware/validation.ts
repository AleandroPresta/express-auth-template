/**
 * Request validation middleware
 * Validates request body against Joi schemas
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { sendError } from '../utils/response';
import { ValidationError } from '../utils/errors';
import {
    signupSchema,
    loginSchema,
    refreshTokenSchema,
    updateProfileSchema,
} from '../validators/auth.validators';

const schemas = {
    signup: signupSchema,
    login: loginSchema,
    refreshToken: refreshTokenSchema,
    updateProfile: updateProfileSchema,
} as const;

type SchemaName = keyof typeof schemas;

/**
 * Validate request middleware factory
 */
export const validateRequest = (schemaName: SchemaName) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const schema = schemas[schemaName];

        if (!schema) {
            return next(new ValidationError('Invalid validation schema'));
        }

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });

        if (error) {
            const errors = error.details.map((detail) => detail.message);
            sendError(res, 'Validation failed', errors, 400);
            return;
        }

        // Replace req.body with validated and sanitized data
        req.body = value;
        next();
    };
};
