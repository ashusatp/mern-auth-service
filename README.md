# MERN Stack Auth Service

A robust authentication microservice built with Node.js, TypeScript, and PostgreSQL for the MERN stack ecosystem. This service provides secure user registration, authentication, and token management with JWT-based access and refresh tokens.

## 🚀 Features

- **User Registration** - Secure user account creation with validation
- **User Login** - Email and password authentication
- **JWT Authentication** - Dual token system (access + refresh tokens)
- **Token Refresh** - Automatic token refresh mechanism
- **User Logout** - Secure logout with token invalidation
- **Self Endpoint** - Get current user information
- **Password Security** - Bcrypt password hashing with salt rounds
- **Cookie-based Sessions** - HTTP-only, SameSite cookies for secure token storage
- **Token Revocation** - Database-backed refresh token management
- **Database Integration** - PostgreSQL with TypeORM and migrations
- **Input Validation** - Express-validator for request validation
- **Logging** - Winston logger for comprehensive logging and audit trails
- **CORS Support** - Configurable CORS for multiple domains
- **TypeScript** - Full TypeScript support with strict typing
- **Testing** - Jest testing framework setup
- **Code Quality** - ESLint, Prettier, and Husky pre-commit hooks
- **RSA Key Generation** - Scripts for generating JWT signing keys

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: TypeORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: express-validator
- **Logging**: Winston
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier, Husky

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd auth-service
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create environment files for different environments:

```bash
# Development environment
cp .env.example .env.dev

# Production environment
cp .env.example .env.prod
```

Configure your `.env.dev` file:

```env
NODE_ENV=dev
PORT=5501
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=auth_service_dev
REFRESH_JWT_SECRET=your_refresh_jwt_secret_min_32_chars
CLIENT_UI_DOMAIN=http://localhost:5173
```

### Environment Variables Explained

| Variable           | Description                                      | Example                       |
| ------------------ | ------------------------------------------------ | ----------------------------- |
| NODE_ENV           | Environment mode                                 | `dev`, `prod`, `test`         |
| PORT               | Port number for the server                       | `5501`                        |
| DB_HOST            | PostgreSQL host                                  | `localhost`                   |
| DB_PORT            | PostgreSQL port                                  | `5432`                        |
| DB_USERNAME        | PostgreSQL username                              | `postgres`                    |
| DB_PASSWORD        | PostgreSQL password                              | `your_password`               |
| DB_NAME            | Database name                                    | `auth_service_dev`            |
| REFRESH_JWT_SECRET | Secret for signing refresh tokens (min 32 chars) | `your_secure_secret_key_here` |
| CLIENT_UI_DOMAIN   | Frontend application URL for CORS                | `http://localhost:5173`       |

### 4. Database Setup

Create the database:

```bash
npm run db:create
```

Run database migrations:

```bash
npm run migration:run
```

### 5. Generate JWT Keys

Generate RSA key pair for signing access tokens:

```bash
node scripts/generateKeys.mjs
```

This will create:

- `certs/private.pem` - Private key for signing access tokens
- `certs/public.pem` - Public key for verifying access tokens

You can also convert the public key to JWK format:

```bash
node scripts/convertPemToJwk.mjs
```

### 6. Start the Application

Development mode with hot reload:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The service will be available at `http://localhost:3000`

## 🔐 Authentication Flow

### Registration/Login Flow

1. User submits credentials (email/password)
2. Server validates input and credentials
3. Server generates two tokens:
    - **Access Token**: Short-lived (1h), signed with RS256, contains user ID and role
    - **Refresh Token**: Long-lived (30d), signed with HS256, stored in database
4. Both tokens are sent as HTTP-only cookies
5. Client uses access token for authenticated requests

### Token Refresh Flow

1. When access token expires, client calls `/auth/refresh` with refresh token
2. Server validates refresh token and checks if it's revoked
3. Server generates new access and refresh tokens
4. Old refresh token is deleted from database
5. New tokens are sent as cookies

### Logout Flow

1. Client calls `/auth/logout` with both tokens
2. Server deletes refresh token from database
3. Server clears both cookies
4. User is logged out

## 📚 API Endpoints

### Authentication

#### POST `/auth/register`

Register a new user account.

**Request Body:**

```json
{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "securePassword123"
}
```

**Response:**

```json
{
    "message": "User registered successfully",
    "userId": 1
}
```

**Cookies Set:**

- `access_token` - JWT access token (1 hour expiry)
- `refresh_token` - JWT refresh token (30 days expiry)

---

#### POST `/auth/login`

Authenticate an existing user.

**Request Body:**

```json
{
    "email": "john.doe@example.com",
    "password": "securePassword123"
}
```

**Response:**

```json
{
    "message": "User logged in successfully",
    "userId": 1
}
```

**Cookies Set:**

- `access_token` - JWT access token (1 hour expiry)
- `refresh_token` - JWT refresh token (30 days expiry)

---

#### GET `/auth/self`

Get current authenticated user details.

**Headers:**

- Requires valid `access_token` cookie

**Response:**

```json
{
    "message": "User details fetched successfully",
    "user": {
        "id": 1,
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "role": "customer",
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
}
```

---

#### POST `/auth/refresh`

Refresh access token using refresh token.

**Headers:**

- Requires valid `refresh_token` cookie

**Response:**

```json
{
    "message": "Token refreshed successfully",
    "userId": 1
}
```

**Cookies Set:**

- `access_token` - New JWT access token (1 hour expiry)
- `refresh_token` - New JWT refresh token (30 days expiry)

**Note:** Old refresh token is automatically deleted from the database.

---

#### POST `/auth/logout`

Logout the current user and invalidate tokens.

**Headers:**

- Requires valid `access_token` cookie
- Requires valid `refresh_token` cookie

**Response:**

```json
{
    "message": "User logged out successfully"
}
```

**Cookies Cleared:**

- `access_token`
- `refresh_token`

**Note:** Refresh token is deleted from the database.

## 🗄️ Database Schema

### Users Table

| Column     | Type                | Description                     |
| ---------- | ------------------- | ------------------------------- |
| id         | SERIAL PRIMARY KEY  | Unique user identifier          |
| firstName  | VARCHAR(255)        | User's first name               |
| lastName   | VARCHAR(255)        | User's last name                |
| email      | VARCHAR(255) UNIQUE | User's email address            |
| password   | VARCHAR(255)        | Hashed password (bcrypt)        |
| role       | VARCHAR(255)        | User role (default: 'customer') |
| created_at | TIMESTAMP           | Account creation timestamp      |
| updated_at | TIMESTAMP           | Last update timestamp           |

### Refresh Tokens Table

| Column     | Type               | Description                |
| ---------- | ------------------ | -------------------------- |
| id         | SERIAL PRIMARY KEY | Unique token identifier    |
| user_id    | INTEGER            | Foreign key to users table |
| expires_at | TIMESTAMP          | Token expiration time      |
| created_at | TIMESTAMP          | Token creation timestamp   |
| updated_at | TIMESTAMP          | Last update timestamp      |

## 🧪 Testing

Run tests in watch mode:

```bash
npm test
```

Run tests once:

```bash
npm run test -- --watchAll=false
```

## 🔧 Development Scripts

| Script                       | Description                              |
| ---------------------------- | ---------------------------------------- |
| `npm run dev`                | Start development server with hot reload |
| `npm start`                  | Start production server                  |
| `npm test`                   | Run tests in watch mode                  |
| `npm run format:fix`         | Format code with Prettier                |
| `npm run format:check`       | Check code formatting                    |
| `npm run lint:fix`           | Fix ESLint errors                        |
| `npm run lint:check`         | Check for linting errors                 |
| `npm run migration:generate` | Generate new migration                   |
| `npm run migration:run`      | Run pending migrations                   |
| `npm run migration:revert`   | Revert last migration                    |
| `npm run db:create`          | Create database                          |
| `npm run db:drop`            | Drop database                            |

## 🏗️ Project Structure

```
src/
├── config/           # Configuration files
│   ├── data-source.ts    # TypeORM data source
│   ├── index.ts          # Environment configuration
│   └── logger.ts         # Winston logger setup
├── controller/       # Request handlers
│   └── AuthController.ts
├── entity/          # Database entities
│   ├── User.ts
│   └── RefreshToken.ts
├── middleware/      # Express middleware
│   ├── authenticate.ts           # Access token validation
│   ├── validateRefreshToken.ts   # Refresh token validation
│   └── parseRefreshToken.ts      # Refresh token parser
├── migrations/      # Database migrations
├── routes/          # API routes
│   └── auth.ts
├── service/         # Business logic
│   ├── TokenService.ts       # JWT token generation & management
│   ├── UserService.ts        # User CRUD operations
│   └── CredentialService.ts  # Password hashing & comparison
├── types/           # TypeScript type definitions
│   └── index.ts
├── validators/      # Input validation
│   ├── register-validators.ts
│   └── login-validators.ts
├── app.ts           # Express app configuration
└── server.ts        # Server entry point
```

## 🔒 Security Features

- **Password Hashing**: Bcrypt with configurable salt rounds for secure password storage
- **JWT Tokens**:
    - Access tokens signed with RS256 (RSA asymmetric encryption)
    - Refresh tokens signed with HS256 (HMAC symmetric encryption)
    - Short-lived access tokens (1 hour) for security
    - Long-lived refresh tokens (30 days) stored in database
- **Token Revocation**: Refresh tokens can be invalidated and are deleted on logout
- **HTTP-Only Cookies**: Prevents XSS attacks by making tokens inaccessible to JavaScript
- **SameSite Cookies**: Protection against CSRF attacks
- **CORS Configuration**: Controlled cross-origin requests with configurable domains
- **Input Validation**: Express-validator for comprehensive request validation
- **SQL Injection Protection**: TypeORM parameterized queries
- **Environment Variables**: Sensitive data protection with dotenv
- **Error Handling**: Centralized error handling with http-errors
- **Logging**: Winston logger for security audit trails

## 🚀 Deployment

### Docker

Build and run with Docker:

```bash
# Development
docker build -f docker/dev/Dockerfile -t auth-service:dev .

# Production
docker build -f docker/prod/Dockerfile -t auth-service:prod .
```

### Environment Variables

Ensure all required environment variables are set in your production environment:

- Database connection details
- JWT secrets
- CORS domains
- Port configuration

## 🔧 Troubleshooting

### Common Issues

#### Database Connection Error

Make sure PostgreSQL is running and the database exists:

```bash
# Check if PostgreSQL is running
pg_isready

# Create the database if it doesn't exist
npm run db:create
```

#### Missing JWT Keys

If you get errors about missing private/public keys:

```bash
node scripts/generateKeys.mjs
```

#### Port Already in Use

Change the `PORT` in your `.env.dev` file or kill the process using the port:

```bash
# Find process using port 3000
lsof -ti:3000

# Kill the process
kill -9 $(lsof -ti:3000)
```

#### Migration Errors

If migrations fail, try reverting and running again:

```bash
npm run migration:revert
npm run migration:run
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow the existing code style
- Run `npm run format:fix` before committing
- Run `npm run lint:fix` to fix linting errors
- All commits are automatically checked with Husky pre-commit hooks

## 👨‍💻 Author

**Ashutosh S**

- Email: ashudev0987@gmail.com

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the maintainer

## 📝 Quick Reference

### Common Commands

```bash
# Development
npm run dev                    # Start dev server with hot reload
npm run format:fix             # Format code with Prettier
npm run lint:fix               # Fix linting errors

# Database
npm run db:create              # Create database
npm run db:drop                # Drop database
npm run migration:generate     # Generate migration from entities
npm run migration:run          # Run pending migrations
npm run migration:revert       # Revert last migration

# Testing
npm test                       # Run tests in watch mode
npm run test -- --watchAll=false  # Run tests once

# Production
npm start                      # Start production server
```

### API Base URL

- Development: `http://localhost:5501/api`
- All auth endpoints are prefixed with `/auth`

### Default User Role

- New users are assigned the `customer` role by default
- Roles can be extended in the User entity

---

**Note**: This is a microservice designed to work as part of a larger MERN stack application. Make sure to configure the CORS domains and other settings according to your frontend applications.
