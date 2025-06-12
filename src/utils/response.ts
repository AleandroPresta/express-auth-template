/**
 * Standardized API response utility
 */

import { Response } from 'express';

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
    requestId?: string;
}

/**
 * Send success response
 */
export const sendSuccess = <T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200
): Response<ApiResponse<T>> => {
    const response: ApiResponse<T> = {
        success: true,
        ...(data !== undefined && { data }),
        ...(message && { message }),
        requestId: res.locals['requestId'],
    };

    return res.status(statusCode).json(response);
};

/**
 * Send error response
 */
export const sendError = (
    res: Response,
    message: string,
    errors?: string[],
    statusCode: number = 500
): Response<ApiResponse> => {
    const response: ApiResponse = {
        success: false,
        message,
        ...(errors && { errors }),
        requestId: res.locals['requestId'],
    };

    return res.status(statusCode).json(response);
};
