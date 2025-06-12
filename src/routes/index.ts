/**
 * Main routes index
 * Combines all route modules
 */

import { Router } from 'express';
import { authRoutes } from './auth.routes';

const router = Router();

// Mount auth routes
router.use('/auth', authRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        requestId: res.locals['requestId'],
    });
});

export { router as routes };
