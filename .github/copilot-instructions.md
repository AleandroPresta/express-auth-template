# Express Auth Server Project Instructions

## Tech Stack

-   **Backend**: Express.js with TypeScript
-   **Database**: PostgreSQL with Prisma ORM
-   **Authentication**: JWT tokens with refresh token rotation
-   **Containerization**: Docker & Docker Compose
-   **Testing**: Jest with supertest

## Architecture Preferences

-   Use MVC pattern with separate controllers, services, and repositories
-   Implement middleware for authentication, validation, and error handling
-   Use environment variables for all configuration
-   Follow RESTful API conventions

## Security Requirements

-   Hash passwords with bcrypt (min 12 rounds)
-   Implement rate limiting
-   Use helmet for security headers
-   Validate all inputs with Joi or Zod
-   Implement CORS properly

## Code Style

-   Use async/await over promises
-   Prefer explicit error handling
-   Use TypeScript strict mode
-   Follow ESLint + Prettier configuration
-   Use meaningful variable names and JSDoc comments

## Database

-   Use Prisma for database operations
-   Implement proper database migrations
-   Use connection pooling
-   Handle database errors gracefully

## Docker Setup

-   Multi-stage builds for optimization
-   Non-root user in containers
-   Health checks for services
-   Development and production configurations

## API Endpoints Structure

### Authentication Endpoints (`/api/v1/auth`)

-   **POST** `/signup` - User registration
-   **POST** `/login` - User login with credentials
-   **POST** `/logout` - User logout (invalidate current session)
-   **POST** `/refresh` - Refresh access token using refresh token

### User Management (`/api/v1/auth/user`)

-   **GET** `/profile` - Get current user profile information
-   **PUT** `/profile` - Update current user profile

## API Response Standards

-   Use consistent response format with `success`, `data`, `message`, `errors`
-   Implement proper HTTP status codes
-   Include request ID for tracking
-   Provide detailed error messages for development
-   Sanitize error messages for production

## Rate Limiting Strategy

-   **Login**: 5 attempts per 15 minutes per IP
-   **Register**: 3 attempts per hour per IP
-   **Password Reset**: 3 attempts per hour per email
-   **Email Verification**: 5 attempts per hour per email
-   **General API**: 100 requests per 15 minutes per user

## Validation Rules

-   **Email**: Valid email format, max 255 characters
-   **Password**: Min 8 characters, include uppercase, lowercase, number, special char
-   **Username**: 3-30 characters, alphanumeric and underscore only
-   **Phone**: Valid international format (optional)
-   **Name**: 1-100 characters, no special characters except spaces and hyphens
