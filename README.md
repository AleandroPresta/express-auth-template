# Express Auth Template - Complete Learning Guide

> **A comprehensive educational resource for learning authentication servers, backend development, and modern web technologies**

This project is a production-ready Express.js authentication server that serves as a complete learning platform for beginners who want to understand how authentication works in modern web applications. Every concept, technology, and implementation detail is explained to help you master backend development.

## 📚 Table of Contents

1. [What is an Authentication Server?](#what-is-an-authentication-server)
2. [Core Concepts](#core-concepts)
3. [Technology Stack Deep Dive](#technology-stack-deep-dive)
4. [Project Architecture](#project-architecture)
5. [File Structure Explained](#file-structure-explained)
6. [Security Concepts](#security-concepts)
7. [Database Design](#database-design)
8. [API Design Patterns](#api-design-patterns)
9. [Prerequisites & Setup](#prerequisites--setup)
10. [Installation & Running](#installation--running)
11. [API Documentation](#api-documentation)
12. [Testing Strategy](#testing-strategy)
13. [Docker & Containerization](#docker--containerization)
14. [Development Workflow](#development-workflow)
15. [Extending the Project](#extending-the-project)
16. [Best Practices & Patterns](#best-practices--patterns)
17. [Troubleshooting](#troubleshooting)
18. [Further Learning](#further-learning)

---

## What is an Authentication Server?

An **authentication server** is a specialized backend service that handles user identity verification and session management. Think of it as a digital bouncer for your applications - it checks who users are, verifies their credentials, and manages their access permissions.

### Why Do We Need Authentication?

1. **Security**: Protect sensitive data and operations
2. **Personalization**: Provide user-specific content and settings
3. **Access Control**: Different users have different permissions
4. **Audit Trail**: Track who did what and when
5. **Legal Compliance**: Meet regulatory requirements for data protection

### How Authentication Works (Simplified)

```
1. User provides credentials (email/password)
2. Server verifies credentials against database
3. If valid, server generates a secure token
4. Token is sent back to user's browser/app
5. User includes token in future requests
6. Server validates token for each protected request
```

---

## Core Concepts

### 1. Authentication vs Authorization

- **Authentication**: "Who are you?" - Verifying user identity
- **Authorization**: "What can you do?" - Determining user permissions

### 2. Tokens vs Sessions

**Sessions (Traditional)**:

- Server stores user state in memory/database
- Client receives a session ID cookie
- Server looks up session data for each request
- Stateful (server remembers user state)

**Tokens (Modern - JWT)**:

- Server creates a signed token with user data
- Client stores token and sends it with requests
- Server validates token without database lookup
- Stateless (server doesn't store user state)

### 3. JWT (JSON Web Tokens)

A JWT is like a digital passport that contains:

- **Header**: Token type and signing algorithm
- **Payload**: User data and claims
- **Signature**: Cryptographic proof of authenticity

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20ifQ.signature
```

### 4. Refresh Token Rotation

**Problem**: JWT tokens should be short-lived for security, but asking users to login frequently is bad UX.

**Solution**: Use two tokens:

- **Access Token**: Short-lived (15 minutes), used for API requests
- **Refresh Token**: Long-lived (7 days), used to get new access tokens

When access token expires, use refresh token to get a new pair without re-authentication.

---

## Technology Stack Deep Dive

### Backend Framework: Express.js

**What is Express.js?**
Express is a minimal web framework for Node.js that provides:

- HTTP server functionality
- Routing (URL handling)
- Middleware support
- Request/response handling

**Why Express?**

- Lightweight and fast
- Huge ecosystem
- Great for APIs
- Industry standard

**Key Concepts**:

```javascript
// Middleware: Functions that run before your route handlers
app.use(express.json()); // Parses JSON request bodies

// Routes: Define how app responds to client requests
app.get('/users', (req, res) => {
  // Handle GET request to /users
});

// Error Handling: Catch and respond to errors
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});
```

### Language: TypeScript

**What is TypeScript?**
TypeScript is JavaScript with static type checking. It compiles to plain JavaScript.

**Benefits**:

- **Type Safety**: Catch errors at compile-time, not runtime
- **Better IDE Support**: Autocomplete, refactoring, navigation
- **Self-Documenting**: Types serve as inline documentation
- **Easier Refactoring**: Compiler ensures all references are updated

**Example**:

```typescript
// JavaScript (no type safety)
function createUser(email, password) {
  // Could accidentally pass wrong types
}

// TypeScript (with type safety)
interface CreateUserData {
  email: string;
  password: string;
}

function createUser(userData: CreateUserData): Promise<User> {
  // Compiler ensures correct types
}
```

### Database: PostgreSQL

**What is PostgreSQL?**
PostgreSQL (Postgres) is a powerful, open-source relational database that supports:

- ACID transactions (data integrity)
- Complex queries with SQL
- JSON data types
- Full-text search
- Advanced indexing

**Why PostgreSQL?**

- Reliable and proven
- Excellent performance
- Strong consistency
- Rich feature set
- Great tooling

### ORM: Prisma

**What is an ORM?**
Object-Relational Mapping (ORM) is a technique that lets you query and manipulate data using an object-oriented paradigm instead of SQL.

**What is Prisma?**
Prisma is a modern ORM that provides:

- **Type-safe database client**: Generated based on your schema
- **Migrations**: Version control for database changes
- **Introspection**: Generate schema from existing database
- **Query builder**: Compose complex queries with JavaScript/TypeScript

**Benefits**:

```typescript
// Instead of raw SQL:
const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

// Use type-safe Prisma client:
const user = await prisma.user.findUnique({
  where: { email },
});
// TypeScript knows exactly what properties 'user' has!
```

### Containerization: Docker

**What is Docker?**
Docker packages applications and their dependencies into containers - lightweight, portable environments that run consistently across different systems.

**Key Concepts**:

- **Image**: Template for creating containers
- **Container**: Running instance of an image
- **Dockerfile**: Instructions for building an image
- **Docker Compose**: Tool for running multi-container applications

**Benefits**:

- **Consistency**: "Works on my machine" → "Works everywhere"
- **Isolation**: Apps don't interfere with each other
- **Portability**: Run anywhere Docker is supported
- **Scalability**: Easy to replicate and scale

### Testing: Jest & Supertest

**What is Jest?**
Jest is a JavaScript testing framework that provides:

- Test runner
- Assertion library
- Mocking capabilities
- Code coverage reports

**What is Supertest?**
Supertest is a library for testing HTTP endpoints:

- Makes HTTP requests to your app
- Provides assertions for responses
- Integrates with Jest

---

## Project Architecture

This project follows the **MVC (Model-View-Controller)** pattern with additional layers:

```
┌─────────────────┐
│   Controllers   │  ← Handle HTTP requests/responses
├─────────────────┤
│    Services     │  ← Business logic
├─────────────────┤
│  Repositories   │  ← Database access layer
├─────────────────┤
│     Models      │  ← Data structures (Prisma)
└─────────────────┘
```

### Layer Responsibilities

**Controllers** (`src/controllers/`):

- Receive HTTP requests
- Validate input (with middleware)
- Call appropriate service methods
- Format and send responses
- Handle errors

**Services** (`src/services/`):

- Contain business logic
- Orchestrate operations
- Call repository methods
- Transform data
- Enforce business rules

**Repositories** (`src/repositories/`):

- Abstract database operations
- Provide clean API for data access
- Handle database-specific logic
- Can be easily mocked for testing

**Models** (`prisma/schema.prisma`):

- Define data structure
- Specify relationships
- Database schema

### Benefits of This Architecture

1. **Separation of Concerns**: Each layer has a specific responsibility
2. **Testability**: Easy to unit test each layer independently
3. **Maintainability**: Changes in one layer don't affect others
4. **Reusability**: Services can be used by different controllers

---

## File Structure Explained

Let's walk through every important file and understand its purpose:

### Root Configuration Files

**`package.json`**

- Defines project metadata, dependencies, and scripts
- Lists all npm packages the project needs
- Contains scripts for development, building, testing

**`tsconfig.json`**

- TypeScript compiler configuration
- Defines how TypeScript code is compiled to JavaScript
- Sets strict type checking rules

**`jest.config.js`**

- Jest testing framework configuration
- Defines test file patterns, coverage settings
- Sets up test environment

**`nodemon.json`**

- Configuration for nodemon (development tool)
- Automatically restarts server when files change
- Watches specific file types and directories

### Docker Files

**`Dockerfile`**

- Instructions to build production Docker image
- Multi-stage build for optimization
- Security best practices (non-root user)

**`Dockerfile.dev`**

- Development-specific Docker configuration
- Includes development dependencies
- Optimized for development workflow

**`docker-compose.yml`**

- Production multi-container setup
- Defines services (app, database)
- Networks and volume configuration

**`docker-compose.dev.yml`**

- Development environment setup
- File watching and hot reload
- Development database configuration

### Source Code Structure

**`src/index.ts`** - Application Entry Point

```typescript
// This is where everything starts
// 1. Initialize database connection
// 2. Create Express app
// 3. Start server
// 4. Handle graceful shutdown
```

**`src/app.ts`** - Express App Configuration

```typescript
// Sets up the Express application:
// - Security middleware (helmet, CORS)
// - Request parsing (JSON, URL-encoded)
// - Rate limiting
// - Routes
// - Error handling
```

**`src/config/`** - Configuration Management

- `index.ts`: Environment variable validation and type-safe config
- `database.ts`: Prisma client setup and connection management

**`src/controllers/`** - HTTP Request Handlers

Controllers receive HTTP requests and send responses:

```typescript
export class AuthController {
  signup = async (req: Request, res: Response, next: NextFunction) => {
    // 1. Extract data from request body
    // 2. Call service method
    // 3. Send success response
    // 4. Pass errors to error handler
  };
}
```

**`src/services/`** - Business Logic

Services contain the core business logic:

```typescript
export class AuthService {
  async signup(signupData: SignupRequest) {
    // 1. Validate business rules
    // 2. Hash password
    // 3. Create user in database
    // 4. Generate JWT tokens
    // 5. Return user data and tokens
  }
}
```

**`src/repositories/`** - Database Access Layer

Repositories handle all database operations:

```typescript
export class UserRepository {
  async create(userData: CreateUserData): Promise<User> {
    return prisma.user.create({ data: userData });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }
}
```

**`src/middleware/`** - Express Middleware

Middleware functions run before your route handlers:

- `auth.ts`: JWT token validation
- `rateLimiter.ts`: Prevent abuse by limiting requests
- `validation.ts`: Input validation using Joi schemas
- `errorHandler.ts`: Centralized error handling
- `requestId.ts`: Adds unique ID to each request for tracking

**`src/routes/`** - URL Route Definitions

Routes define which controller method handles which URL:

```typescript
router.post(
  '/signup',
  validateSignup, // Validate input first
  authController.signup // Then handle request
);
```

**`src/validators/`** - Input Validation Schemas

Joi schemas define what valid input looks like:

```typescript
export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  username: Joi.string().alphanum().min(3).max(30),
});
```

**`src/utils/`** - Utility Functions

Helper functions used throughout the application:

- `jwt.ts`: JWT token generation and validation
- `response.ts`: Standardized API response formatting
- `errors.ts`: Custom error classes

**`src/__tests__/`** - Test Files

- `setup.ts`: Test environment configuration
- `*.test.ts`: Test files for different components

### Database Files

**`prisma/schema.prisma`** - Database Schema
Defines your database structure in Prisma's schema language:

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  createdAt DateTime @default(now())
}
```

**`prisma/seed.ts`** - Database Seeding
Script to populate database with initial data for development/testing.

---

## Security Concepts

### 1. Password Security

**Problem**: Storing plain text passwords is extremely dangerous.

**Solution**: Password Hashing with bcrypt

```typescript
// Never store this:
const user = { password: 'mypassword123' };

// Always store this:
const hashedPassword = await bcrypt.hash('mypassword123', 12);
const user = { password: hashedPassword };

// To verify:
const isValid = await bcrypt.compare('mypassword123', hashedPassword);
```

**Why bcrypt?**

- **Slow by design**: Prevents brute force attacks
- **Salt included**: Prevents rainbow table attacks
- **Adaptive**: Can increase difficulty over time

### 2. JWT Security

**Best Practices**:

- **Short expiration**: Access tokens expire in 15 minutes
- **Secure storage**: Never store JWT in localStorage (XSS risk)
- **HttpOnly cookies**: Store refresh tokens in secure cookies
- **Strong secrets**: Use cryptographically secure random secrets

### 3. Rate Limiting

**Purpose**: Prevent abuse and brute force attacks

**Implementation**:

```typescript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts',
});
```

### 4. Input Validation

**Why validate?**

- Prevent injection attacks
- Ensure data quality
- Provide clear error messages

**Joi Validation Example**:

```typescript
const schema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'any.required': 'Email is required',
  }),
});
```

### 5. CORS (Cross-Origin Resource Sharing)

**Problem**: Browsers block requests from one domain to another by default.

**Solution**: Configure CORS to allow specific origins:

```typescript
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://myapp.com'],
    credentials: true, // Allow cookies
  })
);
```

### 6. Helmet.js

Helmet sets various HTTP headers to secure your app:

- `X-Content-Type-Options`: Prevent MIME sniffing
- `X-Frame-Options`: Prevent clickjacking
- `X-XSS-Protection`: Enable XSS filtering
- And many more...

---

## Database Design

### Schema Explanation

**Users Table**:

```prisma
model User {
  id        String   @id @default(cuid())  // Unique identifier
  email     String   @unique               // Login credential
  username  String?  @unique               // Optional display name
  name      String?                        // Full name
  phone     String?                        // Contact info
  password  String                         // Hashed password
  isActive  Boolean  @default(true)        // Soft delete flag
  createdAt DateTime @default(now())       // Registration date
  updatedAt DateTime @updatedAt            // Last update

  // Relations
  refreshTokens RefreshToken[]             // One user, many tokens
}
```

**Refresh Tokens Table**:

```prisma
model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique               // The actual token
  userId    String                         // Foreign key to User
  expiresAt DateTime                       // Expiration date
  createdAt DateTime @default(now())
  isRevoked Boolean  @default(false)       // Manual invalidation

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### Design Decisions

**CUID vs UUID vs Auto-increment**:

- **CUID**: Collision-resistant, URL-safe, sortable
- **UUID**: Standard, but not sortable
- **Auto-increment**: Predictable, security risk

**Soft Delete** (`isActive` field):

- Don't actually delete user records
- Set `isActive = false` instead
- Preserves data integrity and audit trail

**Refresh Token Storage**:

- Store in database for revocation capability
- Each token has expiration date
- Can be manually revoked for security

---

## API Design Patterns

### RESTful API Design

**REST Principles**:

1. **Stateless**: Each request contains all needed information
2. **Resource-based**: URLs represent resources, not actions
3. **HTTP methods**: Use appropriate HTTP verbs
4. **Consistent**: Follow predictable patterns

**URL Structure**:

```
/api/v1/auth/signup     POST   - Create new user
/api/v1/auth/login      POST   - Authenticate user
/api/v1/auth/logout     POST   - End session
/api/v1/auth/refresh    POST   - Refresh tokens
/api/v1/auth/user/profile GET   - Read user profile
/api/v1/auth/user/profile PUT   - Update user profile
```

### Response Format Standardization

**Consistent Response Structure**:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  errors?: ValidationError[];
  requestId: string;
  timestamp: string;
}
```

**Success Response**:

```json
{
  "success": true,
  "data": {
    "user": { "id": "123", "email": "user@example.com" },
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  },
  "message": "Login successful",
  "requestId": "req_123456",
  "timestamp": "2023-12-01T10:00:00Z"
}
```

**Error Response**:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ],
  "requestId": "req_123456",
  "timestamp": "2023-12-01T10:00:00Z"
}
```

### HTTP Status Codes

**Common Status Codes Used**:

- `200 OK`: Successful GET, PUT
- `201 Created`: Successful POST (signup)
- `400 Bad Request`: Invalid input
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Valid credentials, insufficient permissions
- `404 Not Found`: Resource doesn't exist
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

---

## Prerequisites & Setup

### System Requirements

**Node.js 18+**

- JavaScript runtime for server-side development
- Includes npm (Node Package Manager)
- Download from: https://nodejs.org/

**Docker & Docker Compose**

- Container platform for consistent environments
- Docker Compose for multi-container applications
- Download from: https://docker.com/

**PostgreSQL** (if running locally)

- Relational database system
- Only needed if not using Docker
- Download from: https://postgresql.org/

### Development Tools (Recommended)

**Visual Studio Code**

- Excellent TypeScript support
- Great debugging capabilities
- Rich extension ecosystem

**Useful VS Code Extensions**:

- Prisma (database schema support)
- Thunder Client (API testing)
- Docker (container management)
- ESLint (code quality)
- Prettier (code formatting)

**Database Tools**:

- pgAdmin (PostgreSQL administration)
- DBeaver (universal database tool)
- Prisma Studio (visual database browser)

---

## Installation & Running

### Quick Start with Docker (Recommended)

The easiest way to get started is using Docker, which handles all dependencies automatically.

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd express-auth-template
```

#### 2. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your configuration
nano .env  # or use your preferred editor
```

**Required Environment Variables**:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/auth_db"

# JWT Secrets (use strong, random strings)
JWT_ACCESS_SECRET="your-super-secret-access-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"

# Optional configurations
PORT=3000
NODE_ENV=development
BCRYPT_ROUNDS=12
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

#### 3. Start with Docker Compose

```bash
# For development (with hot reload)
npm run docker:dev

# For production
npm run docker:prod

# Or manually
docker compose -f docker-compose.dev.yml up
```

This will start:

- PostgreSQL database (port 5432)
- Express server (port 3000)
- Automatic file watching and restart

#### 4. Verify Installation

Visit `http://localhost:3000` - you should see the API welcome message.

### Local Development Setup (Without Docker)

If you prefer running everything locally:

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Set Up PostgreSQL

**Option A: Install PostgreSQL locally**

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# macOS with Homebrew
brew install postgresql
brew services start postgresql

# Create database
createdb auth_db
```

**Option B: Use Docker for database only**

```bash
# Start only PostgreSQL
docker run --name postgres-auth \
  -e POSTGRES_DB=auth_db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15
```

#### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Seed with sample data
npm run db:seed
```

#### 4. Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000` with hot reload enabled.

---

## API Documentation

### Authentication Flow

#### 1. User Registration

**Endpoint**: `POST /api/v1/auth/signup`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "username": "johndoe",
  "name": "John Doe",
  "phone": "+1234567890"
}
```

**Response** (201 Created):

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "clp123abc",
      "email": "user@example.com",
      "username": "johndoe",
      "name": "John Doe",
      "phone": "+1234567890",
      "isActive": true,
      "createdAt": "2023-12-01T10:00:00Z",
      "updatedAt": "2023-12-01T10:00:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

#### 2. User Login

**Endpoint**: `POST /api/v1/auth/login`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):

```json
{
  "success": true,
  "data": {
    "user": {
      /* user object */
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

#### 3. Access Protected Resources

**Include JWT in Authorization header**:

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     http://localhost:3000/api/v1/auth/user/profile
```

#### 4. Refresh Tokens

**Endpoint**: `POST /api/v1/auth/refresh`

**Request Body**:

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response**:

```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Token refreshed successfully"
}
```

### Complete Endpoint Reference

| Method | Endpoint                    | Description         | Auth Required | Rate Limit |
| ------ | --------------------------- | ------------------- | ------------- | ---------- |
| GET    | `/`                         | API information     | ❌            | 100/15min  |
| GET    | `/api/v1/health`            | Health check        | ❌            | 100/15min  |
| POST   | `/api/v1/auth/signup`       | User registration   | ❌            | 3/hour     |
| POST   | `/api/v1/auth/login`        | User login          | ❌            | 5/15min    |
| POST   | `/api/v1/auth/logout`       | User logout         | ✅            | 100/15min  |
| POST   | `/api/v1/auth/refresh`      | Refresh tokens      | ❌            | 10/15min   |
| GET    | `/api/v1/auth/user/profile` | Get user profile    | ✅            | 100/15min  |
| PUT    | `/api/v1/auth/user/profile` | Update user profile | ✅            | 100/15min  |

### Error Responses

**Validation Error** (400 Bad Request):

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address"
    },
    {
      "field": "password",
      "message": "Password must be at least 8 characters long"
    }
  ]
}
```

**Authentication Error** (401 Unauthorized):

```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Rate Limit Error** (429 Too Many Requests):

```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```

---

## Testing Strategy

This project includes comprehensive testing at multiple levels:

### Test Structure

```
src/__tests__/
├── setup.ts              # Test configuration
├── jwt.test.ts           # JWT utility tests
├── auth.service.test.ts  # Service layer tests
└── auth.test.ts          # Integration tests
```

### Types of Tests

#### 1. Unit Tests (`jwt.test.ts`, `auth.service.test.ts`)

Test individual functions and classes in isolation:

```typescript
describe('JWT Utilities', () => {
  test('should generate valid access token', () => {
    const payload = { userId: '123', email: 'test@example.com' };
    const token = generateAccessToken(payload);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });
});
```

#### 2. Integration Tests (`auth.test.ts`)

Test complete API endpoints with real database:

```typescript
describe('POST /api/v1/auth/signup', () => {
  test('should register new user successfully', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'SecurePass123!',
      username: 'testuser',
    };

    const response = await request(app).post('/api/v1/auth/signup').send(userData).expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userData.email);
  });
});
```

### Test Environment

**Separate Test Database**:

- Uses `auth_test_db` database
- Automatically created and cleaned up
- Isolated from development data

**Configuration**:

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/__tests__/**', '!src/index.ts'],
};
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (reruns on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test jwt.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="should login"

# Run tests for specific describe block
npm test -- --testNamePattern="Auth Service"
```

### Test Coverage

The project maintains high test coverage:

- **JWT utilities**: 14 tests covering token generation, verification, and validation
- **Authentication service**: 11 tests covering business logic and error handling
- **API integration**: 48 tests covering all endpoints, validation, and security

**Coverage Report**:

```
File                    | % Stmts | % Branch | % Funcs | % Lines
------------------------|---------|----------|---------|--------
src/utils/jwt.ts        |   100   |   100    |   100   |   100
src/services/auth.ts    |   95.2  |   88.9   |   100   |   95.1
src/controllers/auth.ts |   92.3  |   85.7   |   100   |   92.3
```

### Writing New Tests

**Test File Naming**:

- Unit tests: `filename.test.ts`
- Integration tests: `feature.test.ts`
- Place in `src/__tests__/` directory

**Test Structure**:

```typescript
describe('Feature/Component Name', () => {
  beforeEach(async () => {
    // Setup before each test
    await cleanupDatabase();
  });

  afterEach(async () => {
    // Cleanup after each test
  });

  describe('specific functionality', () => {
    test('should do something specific', async () => {
      // Arrange
      const input = {
        /* test data */
      };

      // Act
      const result = await functionUnderTest(input);

      // Assert
      expect(result).toEqual(expectedOutput);
    });

    test('should handle error case', async () => {
      // Test error scenarios
      await expect(functionUnderTest(invalidInput)).rejects.toThrow('Expected error message');
    });
  });
});
```

---

## Docker & Containerization

### Why Containerization?

**Problems Docker Solves**:

1. **"Works on my machine"**: Consistent environment across all systems
2. **Dependency conflicts**: Each container has its own dependencies
3. **Setup complexity**: One command to run entire stack
4. **Environment parity**: Development matches production

### Docker Configuration

#### Production Dockerfile

```dockerfile
# Multi-stage build for optimization
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS production
# Security: run as non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

USER nodejs
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

#### Development Dockerfile

```dockerfile
FROM node:18-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run db:generate

# Development server with hot reload
CMD ["npm", "run", "dev"]
```

### Docker Compose Configurations

#### Development Setup (`docker-compose.dev.yml`)

```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://user:password@db:5432/auth_db
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: auth_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

#### Production Setup (`docker-compose.yml`)

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@db:5432/auth_db
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: auth_db
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Docker Commands Reference

```bash
# Build and start development environment
docker compose -f docker-compose.dev.yml up --build

# Start in background
docker compose -f docker-compose.dev.yml up -d

# View logs
docker compose logs app
docker compose logs -f app  # Follow logs

# Stop services
docker compose down

# Stop and remove volumes (deletes database)
docker compose down -v

# Execute commands in running container
docker compose exec app npm test
docker compose exec app bash

# Database operations
docker compose exec db psql -U user -d auth_db
```

### Docker Best Practices Used

1. **Multi-stage builds**: Smaller production images
2. **Non-root user**: Security best practice
3. **Layer caching**: Optimize build speed
4. **Health checks**: Monitor container health
5. **.dockerignore**: Exclude unnecessary files
6. **Alpine images**: Smaller, more secure base images

---

## Development Workflow

### Daily Development Cycle

#### 1. Start Development Environment

```bash
# Option A: Docker (recommended)
npm run docker:dev

# Option B: Local development
npm run dev
```

#### 2. Make Code Changes

The development server automatically restarts when you save files thanks to **nodemon**.

#### 3. Run Tests

```bash
# Run tests after changes
npm test

# Keep tests running while developing
npm run test:watch
```

#### 4. Database Changes

When you modify the database schema:

```bash
# Update Prisma schema in prisma/schema.prisma
# Then generate migration
npx prisma migrate dev --name describe_your_change

# Regenerate Prisma client
npm run db:generate
```

#### 5. Code Quality Checks

```bash
# Lint code
npm run lint

# Format code
npm run format

# Type checking
npx tsc --noEmit
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/add-email-verification

# Make changes and commit
git add .
git commit -m "feat: add email verification endpoint"

# Push and create pull request
git push origin feature/add-email-verification
```

### Environment Management

**Environment Files**:

- `.env.example`: Template with all required variables
- `.env`: Local development configuration (git-ignored)
- `.env.test`: Test environment configuration
- `.env.production`: Production configuration

**Best Practices**:

- Never commit `.env` files to git
- Use strong, unique secrets for each environment
- Document all environment variables in `.env.example`

### Debugging

#### 1. Application Debugging

**Using VS Code**:

1. Set breakpoints in your code
2. Press F5 or use Debug panel
3. Configure `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug App",
  "program": "${workspaceFolder}/src/index.ts",
  "outFiles": ["${workspaceFolder}/dist/**/*.js"],
  "runtimeArgs": ["-r", "ts-node/register"]
}
```

#### 2. Database Debugging

**Prisma Studio** (Visual Database Browser):

```bash
npx prisma studio
```

**Direct Database Access**:

```bash
# Local PostgreSQL
psql -U user -d auth_db

# Docker PostgreSQL
docker compose exec db psql -U user -d auth_db
```

#### 3. API Debugging

**Using Thunder Client** (VS Code Extension):

1. Install Thunder Client extension
2. Create new request
3. Set URL: `http://localhost:3000/api/v1/auth/login`
4. Set headers and body
5. Send request

**Using curl**:

```bash
# Test signup
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123!"}' \
  -v  # Verbose output for debugging
```

---

## Extending the Project

### Adding New Features

#### 1. Email Verification

**Database Schema Update**:

```prisma
model User {
  // ... existing fields
  isEmailVerified Boolean @default(false)
  emailVerificationToken String?
  emailVerificationExpires DateTime?
}
```

**New Endpoints**:

- `POST /api/v1/auth/send-verification` - Send verification email
- `POST /api/v1/auth/verify-email` - Verify email with token

**Implementation Steps**:

1. Update Prisma schema
2. Create migration: `npx prisma migrate dev --name add_email_verification`
3. Add validation schemas in `src/validators/`
4. Implement service methods in `src/services/auth.service.ts`
5. Add controller methods in `src/controllers/auth.controller.ts`
6. Define routes in `src/routes/auth.routes.ts`
7. Write tests

#### 2. Password Reset

**New Endpoints**:

- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset with token

#### 3. Social Authentication (OAuth)

**Technologies to Add**:

- Passport.js for OAuth strategies
- Google, GitHub, Facebook providers

**Implementation**:

```bash
npm install passport passport-google-oauth20 passport-github2
```

#### 4. Role-Based Access Control (RBAC)

**Database Schema**:

```prisma
model Role {
  id   String @id @default(cuid())
  name String @unique
  users User[]
}

model User {
  // ... existing fields
  roleId String?
  role   Role?   @relation(fields: [roleId], references: [id])
}
```

**Middleware**:

```typescript
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
};
```

### Adding New Middleware

Create new middleware in `src/middleware/`:

```typescript
// src/middleware/logging.ts
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });

  next();
};
```

Register in `src/app.ts`:

```typescript
import { requestLogger } from './middleware/logging';
app.use(requestLogger);
```

### Database Schema Migrations

When modifying the database schema:

1. **Update schema**: Edit `prisma/schema.prisma`
2. **Create migration**: `npx prisma migrate dev --name your_migration_name`
3. **Generate client**: `npm run db:generate`
4. **Update TypeScript types**: Restart TypeScript server

**Migration Best Practices**:

- Use descriptive migration names
- Test migrations on development data
- Backup production database before applying
- Review generated SQL before applying

### Adding New API Endpoints

**Step-by-step Process**:

1. **Define Validation Schema** (`src/validators/`):

```typescript
export const createPostSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  content: Joi.string().min(1).required(),
  tags: Joi.array().items(Joi.string()),
});
```

2. **Create Repository Methods** (`src/repositories/`):

```typescript
export class PostRepository {
  async create(data: CreatePostData): Promise<Post> {
    return prisma.post.create({ data });
  }
}
```

3. **Implement Service Logic** (`src/services/`):

```typescript
export class PostService {
  async createPost(userId: string, postData: CreatePostData): Promise<Post> {
    // Business logic here
    return this.postRepository.create({ ...postData, userId });
  }
}
```

4. **Add Controller Method** (`src/controllers/`):

```typescript
export class PostController {
  createPost = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const post = await this.postService.createPost(req.user!.userId, req.body);
      sendSuccess(res, { post }, 'Post created successfully', 201);
    } catch (error) {
      next(error);
    }
  };
}
```

5. **Define Routes** (`src/routes/`):

```typescript
const postController = new PostController();

router.post('/posts', authenticate, validate(createPostSchema), postController.createPost);
```

6. **Write Tests**:

```typescript
describe('POST /api/v1/posts', () => {
  test('should create post successfully', async () => {
    const postData = { title: 'Test Post', content: 'Test content' };

    const response = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(postData)
      .expect(201);

    expect(response.body.data.post.title).toBe(postData.title);
  });
});
```

---

## Best Practices & Patterns

### Code Organization

#### 1. Single Responsibility Principle

Each class/function should have one reason to change:

```typescript
// ❌ Bad: UserService does too many things
class UserService {
  async createUser() {
    /* ... */
  }
  async sendWelcomeEmail() {
    /* ... */
  }
  async generateReport() {
    /* ... */
  }
}

// ✅ Good: Separate concerns
class UserService {
  async createUser() {
    /* ... */
  }
}

class EmailService {
  async sendWelcomeEmail() {
    /* ... */
  }
}

class ReportService {
  async generateUserReport() {
    /* ... */
  }
}
```

#### 2. Dependency Injection

Make dependencies explicit and testable:

```typescript
// ✅ Good: Dependencies injected
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}
}

// Easy to test with mocks
const mockUserRepo = jest.mocked(UserRepository);
const mockEmailService = jest.mocked(EmailService);
const authService = new AuthService(mockUserRepo, mockEmailService);
```

### Error Handling

#### 1. Custom Error Classes

Create specific error types:

```typescript
export class ValidationError extends Error {
  constructor(
    public field: string,
    message: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(resource: string, id: string) {
    super(`${resource} with ID ${id} not found`);
    this.name = 'NotFoundError';
  }
}
```

#### 2. Centralized Error Handling

Handle all errors in one place:

```typescript
export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: [{ field: error.field, message: error.message }],
    });
  }

  if (error instanceof NotFoundError) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }

  // Default error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
```

### Security Best Practices

#### 1. Input Validation

Always validate and sanitize input:

```typescript
// ✅ Validate all inputs
const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])'))
    .required()
    .messages({
      'string.pattern.base':
        'Password must contain uppercase, lowercase, number, and special character',
    }),
});
```

#### 2. Secure Headers

Use Helmet.js for security headers:

```typescript
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
  })
);
```

#### 3. Rate Limiting

Implement rate limiting for all endpoints:

```typescript
const createAccountLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 accounts per hour
  message: 'Too many accounts created from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/v1/auth/signup', createAccountLimiter);
```

### Database Best Practices

#### 1. Efficient Queries

Use Prisma's select and include wisely:

```typescript
// ❌ Don't fetch unnecessary data
const user = await prisma.user.findUnique({
  where: { id },
  // This fetches ALL fields including password hash
});

// ✅ Select only needed fields
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    email: true,
    username: true,
    name: true,
    createdAt: true,
  },
});
```

#### 2. Transactions for Data Integrity

Use transactions for multi-step operations:

```typescript
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({ data: userData });
  await tx.refreshToken.create({
    data: { token, userId: user.id },
  });
  return user;
});
```

#### 3. Connection Management

Properly handle database connections:

```typescript
// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
```

### Testing Best Practices

#### 1. Test Structure (AAA Pattern)

```typescript
test('should create user successfully', async () => {
  // Arrange
  const userData = {
    email: 'test@example.com',
    password: 'SecurePass123!',
  };

  // Act
  const result = await authService.signup(userData);

  // Assert
  expect(result.user.email).toBe(userData.email);
  expect(result.tokens.accessToken).toBeDefined();
});
```

#### 2. Test Data Management

```typescript
// Use factories for test data
const createTestUser = (overrides = {}) => ({
  email: 'test@example.com',
  password: 'SecurePass123!',
  username: 'testuser',
  ...overrides,
});

// Clean state between tests
beforeEach(async () => {
  await prisma.user.deleteMany();
  await prisma.refreshToken.deleteMany();
});
```

#### 3. Mock External Dependencies

```typescript
// Mock email service
jest.mock('../services/email.service', () => ({
  EmailService: jest.fn().mockImplementation(() => ({
    sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  })),
}));
```

---

## Troubleshooting

### Common Issues and Solutions

#### 1. Database Connection Issues

**Problem**: `Error: Can't reach database server`

**Solutions**:

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Check if Docker container is running
docker ps

# Verify DATABASE_URL in .env
echo $DATABASE_URL

# Test connection
psql postgresql://user:password@localhost:5432/auth_db
```

#### 2. Port Already in Use

**Problem**: `EADDRINUSE: address already in use :::3000`

**Solutions**:

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### 3. Prisma Client Out of Sync

**Problem**: `PrismaClientValidationError: Unknown field`

**Solution**:

```bash
# Regenerate Prisma client after schema changes
npm run db:generate

# If issues persist, reset database
npm run db:reset
```

#### 4. JWT Token Issues

**Problem**: `JsonWebTokenError: invalid signature`

**Causes & Solutions**:

- **Different JWT secrets**: Ensure consistent JWT_ACCESS_SECRET
- **Token corruption**: Check token transmission
- **Clock skew**: Verify server time is correct

#### 5. Rate Limiting in Development

**Problem**: Getting rate limited during development

**Solution**:

```typescript
// Disable rate limiting in development
if (process.env.NODE_ENV !== 'production') {
  app.use('/api', (req, res, next) => next());
} else {
  app.use('/api', rateLimiter);
}
```

#### 6. CORS Issues

**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:

```typescript
// Update CORS configuration
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://yourdomain.com'],
    credentials: true,
  })
);
```

### Debugging Techniques

#### 1. Enable Debug Logging

```typescript
// Add to development environment
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, req.body);
    next();
  });
}
```

#### 2. Prisma Query Logging

```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

#### 3. Use Debug Module

```bash
# Install debug
npm install debug

# Use in code
const debug = require('debug')('app:auth');
debug('User login attempt:', email);

# Run with debug output
DEBUG=app:* npm run dev
```

### Performance Monitoring

#### 1. Request Timing

```typescript
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) {
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  next();
});
```

#### 2. Database Query Performance

```typescript
// Monitor slow queries
const prisma = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }],
});

prisma.$on('query', (e) => {
  if (e.duration > 1000) {
    console.warn('Slow query:', e.query, `${e.duration}ms`);
  }
});
```

---

## Further Learning

### Advanced Topics to Explore

#### 1. Microservices Architecture

Learn how to split this monolithic application into smaller services:

- User service (authentication)
- Email service (notifications)
- API Gateway (routing)
- Service discovery

#### 2. Advanced Security

- **OAuth 2.0 / OpenID Connect**: Industry standard protocols
- **SAML**: Enterprise authentication
- **Multi-factor Authentication**: Additional security layer
- **Web Application Firewall**: Protection against attacks

#### 3. Scalability and Performance

- **Horizontal scaling**: Multiple server instances
- **Load balancing**: Distribute traffic
- **Caching**: Redis for session storage
- **Database optimization**: Indexing, query optimization

#### 4. Monitoring and Observability

- **Logging**: Structured logging with Winston
- **Metrics**: Prometheus and Grafana
- **Tracing**: Distributed tracing with Jaeger
- **Error tracking**: Sentry for error monitoring

#### 5. DevOps and Deployment

- **CI/CD pipelines**: GitHub Actions, GitLab CI
- **Infrastructure as Code**: Terraform, Ansible
- **Container orchestration**: Kubernetes
- **Cloud platforms**: AWS, GCP, Azure

### Recommended Resources

#### Books

- **"Node.js Design Patterns"** by Mario Casciaro
- **"Building Microservices"** by Sam Newman
- **"Clean Code"** by Robert C. Martin
- **"System Design Interview"** by Alex Xu

#### Online Courses

- **Node.js** - The Complete Guide (Maximilian Schwarzmüller)
- **Docker & Kubernetes** - The Complete Guide (Stephen Grider)
- **System Design** - Grokking the System Design Interview

#### Documentation

- [Express.js Official Docs](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

#### Practice Projects

1. **Blog API**: Add posts, comments, categories
2. **E-commerce API**: Products, orders, payments
3. **Chat Application**: Real-time messaging with WebSockets
4. **File Upload Service**: Image processing and storage

### Community and Support

- **Stack Overflow**: Tag questions with `express`, `prisma`, `typescript`
- **Discord Communities**: Node.js, TypeScript, Prisma communities
- **GitHub**: Explore similar projects and contribute to open source
- **Reddit**: r/node, r/typescript, r/webdev

---

## Contributing

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Ensure tests pass**: `npm test`
6. **Commit changes**: `git commit -m 'Add amazing feature'`
7. **Push to branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and patterns
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure TypeScript compilation passes

### Areas for Contribution

- **Features**: Email verification, password reset, social auth
- **Security**: Additional security headers, audit logging
- **Performance**: Query optimization, caching
- **Documentation**: Tutorials, examples, API docs
- **Testing**: Additional test cases, E2E tests

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- **Express.js community** for the robust web framework
- **Prisma team** for the excellent ORM and developer experience
- **PostgreSQL contributors** for the reliable database system
- **TypeScript team** for bringing type safety to JavaScript
- **Open source community** for countless libraries and inspiration

---

_Happy coding! 🚀_

> This project serves as both a production-ready authentication server and a comprehensive learning resource. Feel free to explore, modify, and extend it as you learn. Remember, the best way to learn is by building and experimenting!

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd express-auth-template
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Generate Prisma client**
   ```bash
   npm run db:generate
   ```

## 🐳 Docker Setup

### Development with Docker

```bash
# Start development environment
npm run docker:dev

# Or manually
docker compose -f docker-compose.dev.yml up
```

### Production with Docker

```bash
# Start production environment
npm run docker:prod

# Or manually
docker compose up -d
```

## 🏃‍♂️ Running Locally

1. **Start PostgreSQL** (if not using Docker)

   ```bash
   # Make sure PostgreSQL is running on localhost:5432
   ```

2. **Run database migrations**

   ```bash
   npm run db:migrate
   ```

3. **Seed the database** (optional)

   ```bash
   npm run db:seed
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The server will be available at `http://localhost:3000`

## 📚 API Endpoints

### Authentication

| Method | Endpoint               | Description          | Auth Required |
| ------ | ---------------------- | -------------------- | ------------- |
| POST   | `/api/v1/auth/signup`  | User registration    | ❌            |
| POST   | `/api/v1/auth/login`   | User login           | ❌            |
| POST   | `/api/v1/auth/logout`  | User logout          | ✅            |
| POST   | `/api/v1/auth/refresh` | Refresh access token | ❌            |

### User Management

| Method | Endpoint                    | Description         | Auth Required |
| ------ | --------------------------- | ------------------- | ------------- |
| GET    | `/api/v1/auth/user/profile` | Get user profile    | ✅            |
| PUT    | `/api/v1/auth/user/profile` | Update user profile | ✅            |

### Health Check

| Method | Endpoint         | Description  | Auth Required |
| ------ | ---------------- | ------------ | ------------- |
| GET    | `/api/v1/health` | Health check | ❌            |

## 📝 API Usage Examples

### Register User

```bash
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe",
    "username": "johndoe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Get Profile

```bash
curl -X GET http://localhost:3000/api/v1/auth/user/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token

```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

## 🧪 Testing

### Test Results ✅

- **73 tests passing** across 3 test suites
- **JWT utilities**: 14 tests (token generation, verification, validation)
- **Authentication service**: 11 tests (business logic, error handling)
- **API integration**: 48 tests (all endpoints, validation, security)

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test auth.test.ts

# Run specific test pattern
npm test -- --testNamePattern="should login"
```

### Test Environment

- Uses separate test database (`auth_test_db`)
- Rate limiting disabled during tests
- Automatic database cleanup after each test
- Mock services for unit testing

## 🏗️ Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # HTTP request handlers
├── middleware/       # Express middleware
├── repositories/     # Database access layer
├── routes/          # Route definitions
├── services/        # Business logic
├── utils/           # Utility functions
├── validators/      # Input validation schemas
├── app.ts           # Express app setup
└── index.ts         # Application entry point
```

## 🔐 Security Features

- **Password Security**: bcrypt with 12+ rounds
- **JWT Security**: Access and refresh token rotation
- **Rate Limiting**:
  - Login: 5 attempts per 15 minutes
  - Register: 3 attempts per hour
  - General API: 100 requests per 15 minutes
- **Input Validation**: Comprehensive validation with Joi
- **Security Headers**: Helmet middleware
- **CORS**: Configurable cross-origin requests

## ⚙️ Environment Variables

| Variable                 | Description                  | Default                 |
| ------------------------ | ---------------------------- | ----------------------- |
| `NODE_ENV`               | Environment mode             | `development`           |
| `PORT`                   | Server port                  | `3000`                  |
| `DATABASE_URL`           | PostgreSQL connection string | Required                |
| `JWT_ACCESS_SECRET`      | JWT access token secret      | Required                |
| `JWT_REFRESH_SECRET`     | JWT refresh token secret     | Required                |
| `JWT_ACCESS_EXPIRES_IN`  | Access token expiry          | `15m`                   |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry         | `7d`                    |
| `BCRYPT_ROUNDS`          | bcrypt hash rounds           | `12`                    |
| `CORS_ORIGIN`            | Allowed CORS origins         | `http://localhost:3000` |

## 🔧 Available Scripts

| Script                | Description                     |
| --------------------- | ------------------------------- |
| `npm run dev`         | Start development server        |
| `npm run build`       | Build for production            |
| `npm start`           | Start production server         |
| `npm test`            | Run tests                       |
| `npm run db:generate` | Generate Prisma client          |
| `npm run db:migrate`  | Run database migrations         |
| `npm run db:seed`     | Seed database                   |
| `npm run docker:dev`  | Start with Docker (development) |
| `npm run docker:prod` | Start with Docker (production)  |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Express.js and TypeScript
- Database powered by PostgreSQL and Prisma
- Security best practices implemented
- Docker containerization support
- Comprehensive testing setup
