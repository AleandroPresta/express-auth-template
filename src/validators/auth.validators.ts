/**
 * Input validation schemas using Joi
 */

import Joi from 'joi';

/**
 * User registration validation schema
 */
export const signupSchema = Joi.object({
    email: Joi.string()
        .email()
        .max(255)
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'string.max': 'Email must not exceed 255 characters',
            'any.required': 'Email is required',
        }),

    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]'))
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.pattern.base': 'Password must include uppercase, lowercase, number and special character',
            'any.required': 'Password is required',
        }),

    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .optional()
        .messages({
            'string.alphanum': 'Username must contain only alphanumeric characters',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username must not exceed 30 characters',
        }),

    name: Joi.string()
        .min(1)
        .max(100)
        .pattern(new RegExp('^[a-zA-Z\\s\\-]+$'))
        .optional()
        .messages({
            'string.min': 'Name must be at least 1 character long',
            'string.max': 'Name must not exceed 100 characters',
            'string.pattern.base': 'Name can only contain letters, spaces, and hyphens',
        }),

    phone: Joi.string()
        .pattern(new RegExp('^\\+[1-9]\\d{1,14}$'))
        .optional()
        .messages({
            'string.pattern.base': 'Phone must be in valid international format (e.g., +1234567890)',
        }),
});

/**
 * User login validation schema
 */
export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required',
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required',
        }),
});

/**
 * Refresh token validation schema
 */
export const refreshTokenSchema = Joi.object({
    refreshToken: Joi.string()
        .required()
        .messages({
            'any.required': 'Refresh token is required',
        }),
});

/**
 * Update profile validation schema
 */
export const updateProfileSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .optional()
        .messages({
            'string.alphanum': 'Username must contain only alphanumeric characters',
            'string.min': 'Username must be at least 3 characters long',
            'string.max': 'Username must not exceed 30 characters',
        }),

    name: Joi.string()
        .min(1)
        .max(100)
        .pattern(new RegExp('^[a-zA-Z\\s\\-]+$'))
        .optional()
        .messages({
            'string.min': 'Name must be at least 1 character long',
            'string.max': 'Name must not exceed 100 characters',
            'string.pattern.base': 'Name can only contain letters, spaces, and hyphens',
        }),

    phone: Joi.string()
        .pattern(new RegExp('^\\+[1-9]\\d{1,14}$'))
        .optional()
        .allow('')
        .messages({
            'string.pattern.base': 'Phone must be in valid international format (e.g., +1234567890)',
        }),
}).min(1).messages({
    'object.min': 'At least one field must be provided for update',
});
