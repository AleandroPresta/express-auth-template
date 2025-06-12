# Express Auth Template

A production-ready Express.js authentication server built with TypeScript, PostgreSQL, and Docker.

## 🚀 Features

- **Authentication**: JWT tokens with refresh token rotation
- **Security**: bcrypt password hashing, rate limiting, CORS, Helmet
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Input validation with Joi
- **Architecture**: MVC pattern with repositories and services
- **Containerization**: Docker and Docker Compose support
- **Testing**: Jest with supertest setup
- **Code Quality**: ESLint, Prettier, TypeScript strict mode

## 📋 Prerequisites

- Node.js 18+
- Docker and Docker Compose
- PostgreSQL (if running locally)

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
docker-compose -f docker-compose.dev.yml up
```

### Production with Docker

```bash
# Start production environment
npm run docker:prod

# Or manually
docker-compose up -d
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

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

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
