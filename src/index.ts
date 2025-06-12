/**
 * Application entry point
 * Starts the Express server
 */

import { createApp } from './app';
import { config } from './config';
import { initializeDatabase, disconnectDatabase } from './config/database';

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
    try {
        // Initialize database connection
        await initializeDatabase();

        // Create Express app
        const app = createApp();

        // Start server
        const server = app.listen(config.PORT, () => {
            console.log(`🚀 Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
            console.log(`📝 API Documentation: http://localhost:${config.PORT}/api/v1`);
            console.log(`❤️  Health Check: http://localhost:${config.PORT}/api/v1/health`);
        });

        // Graceful shutdown handling
        const gracefulShutdown = async (signal: string): Promise<void> => {
            console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

            server.close(async () => {
                console.log('🔌 HTTP server closed');

                try {
                    await disconnectDatabase();
                    console.log('✅ Graceful shutdown completed');
                    process.exit(0);
                } catch (error) {
                    console.error('❌ Error during shutdown:', error);
                    process.exit(1);
                }
            });

            // Force shutdown after 30 seconds
            setTimeout(() => {
                console.error('⏰ Forced shutdown after timeout');
                process.exit(1);
            }, 30000);
        };

        // Handle shutdown signals
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.error('💥 Uncaught Exception:', error);
            process.exit(1);
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
            process.exit(1);
        });

    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();
