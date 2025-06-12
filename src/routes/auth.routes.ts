/**
 * Authentication routes
 * Defines all auth-related endpoints
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter';

const router = Router();
const authController = new AuthController();

/**
 * Authentication endpoints
 */
// POST /api/v1/auth/signup - User registration
router.post('/signup',
    registerLimiter,
    validateRequest('signup'),
    authController.signup
);

// POST /api/v1/auth/login - User login
router.post('/login',
    loginLimiter,
    validateRequest('login'),
    authController.login
);

// POST /api/v1/auth/logout - User logout
router.post('/logout',
    authenticate,
    authController.logout
);

// POST /api/v1/auth/refresh - Refresh access token
router.post('/refresh',
    validateRequest('refreshToken'),
    authController.refreshToken
);

/**
 * User management endpoints
 */
// GET /api/v1/auth/user/profile - Get user profile
router.get('/user/profile',
    authenticate,
    authController.getProfile
);

// PUT /api/v1/auth/user/profile - Update user profile
router.put('/user/profile',
    authenticate,
    validateRequest('updateProfile'),
    authController.updateProfile
);

export { router as authRoutes };
