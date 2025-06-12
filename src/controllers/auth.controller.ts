/**
 * Authentication controller
 * Handles HTTP requests for authentication endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { sendSuccess, sendError } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }

    /**
     * User registration
     * POST /api/v1/auth/signup
     */
    signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { user, tokens } = await this.authService.signup(req.body);

            sendSuccess(
                res,
                {
                    user,
                    accessToken: tokens.accessToken,
                    refreshToken: tokens.refreshToken,
                },
                'User registered successfully',
                201
            );
        } catch (error) {
            next(error);
        }
    };

    /**
     * User login
     * POST /api/v1/auth/login
     */
    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { user, tokens } = await this.authService.login(req.body);

            sendSuccess(res, {
                user,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            }, 'Login successful');
        } catch (error) {
            next(error);
        }
    };

    /**
     * User logout
     * POST /api/v1/auth/logout
     */
    logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { refreshToken } = req.body;

            if (refreshToken) {
                await this.authService.logout(refreshToken);
            }

            sendSuccess(res, null, 'Logout successful');
        } catch (error) {
            next(error);
        }
    };

    /**
     * Refresh access token
     * POST /api/v1/auth/refresh
     */
    refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { refreshToken } = req.body;
            const tokens = await this.authService.refreshToken(refreshToken);

            sendSuccess(res, {
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            }, 'Token refreshed successfully');
        } catch (error) {
            next(error);
        }
    };

    /**
     * Get user profile
     * GET /api/v1/auth/user/profile
     */
    getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const user = await this.authService.getProfile(userId);

            sendSuccess(res, { user }, 'Profile retrieved successfully');
        } catch (error) {
            next(error);
        }
    };

    /**
     * Update user profile
     * PUT /api/v1/auth/user/profile
     */
    updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user!.userId;
            const user = await this.authService.updateProfile(userId, req.body);

            sendSuccess(res, { user }, 'Profile updated successfully');
        } catch (error) {
            next(error);
        }
    };
}
