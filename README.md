# MERN Stack Auth Service

A robust authentication microservice built with Node.js, TypeScript, and PostgreSQL for the MERN stack ecosystem. This service provides secure user registration, authentication, and token management with JWT-based access and refresh tokens.

## 🚀 Features

- **User Registration** - Secure user account creation with validation
- **JWT Authentication** - Access and refresh token management
- **Password Security** - Bcrypt password hashing
- **Cookie-based Sessions** - HTTP-only cookies for secure token storage
- **Database Integration** - PostgreSQL with TypeORM
- **Input Validation** - Express-validator for request validation
- **Logging** - Winston logger for comprehensive logging
- **CORS Support** - Configurable CORS for multiple domains
- **TypeScript** - Full TypeScript support with strict typing
- **Testing** - Jest testing framework setup
- **Code Quality** - ESLint, Prettier, and Husky pre-commit hooks

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
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=auth_service_dev
REFRESH_JWT_SECRET=your_refresh_jwt_secret
REFRESH_JWT_EXPIRES_IN=30d
CLIENT_UI_DOMAIN=http://localhost:3001
ADMIN_UI_DOMAIN=http://localhost:3002
```

### 4. Database Setup

Create the database:

```bash
npm run db:create
```

Run database migrations:

```bash
npm run migration:run
```

### 5. Generate JWT Keys (Optional)

If you need to generate new JWT keys:

```bash
node scripts/generateKeys.mjs
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

## 🗄️ Database Schema

### Users Table

| Column          | Type                | Description                          |
| --------------- | ------------------- | ------------------------------------ |
| id              | SERIAL PRIMARY KEY  | Unique user identifier               |
| name            | VARCHAR(255)        | User's full name (optional)          |
| email           | VARCHAR(255) UNIQUE | User's email address                 |
| password        | VARCHAR(255)        | Hashed password (optional for OAuth) |
| google_id       | VARCHAR(255) UNIQUE | Google OAuth ID (optional)           |
| role            | VARCHAR(255)        | User role (default: 'customer')      |
| last_sign_in_at | TIMESTAMP           | Last sign-in timestamp               |
| created_at      | TIMESTAMP           | Account creation timestamp           |
| updated_at      | TIMESTAMP           | Last update timestamp                |

### Refresh Tokens Table

| Column     | Type             | Description                |
| ---------- | ---------------- | -------------------------- |
| id         | UUID PRIMARY KEY | Unique token identifier    |
| user_id    | INTEGER          | Foreign key to users table |
| token      | VARCHAR(255)     | Hashed refresh token       |
| expires_at | TIMESTAMP        | Token expiration time      |
| created_at | TIMESTAMP        | Token creation timestamp   |

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
├── routes/          # API routes
│   └── auth.ts
├── service/         # Business logic
│   ├── TokenService.ts
│   └── UserService.ts
├── types/           # TypeScript type definitions
│   └── index.ts
├── utils/           # Utility functions
├── validators/      # Input validation
│   └── register-validators.ts
├── app.ts           # Express app configuration
└── server.ts        # Server entry point
```

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **HTTP-Only Cookies**: Prevents XSS attacks
- **CORS Configuration**: Controlled cross-origin requests
- **Input Validation**: Comprehensive request validation
- **SQL Injection Protection**: TypeORM query builder
- **Environment Variables**: Sensitive data protection

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ashutosh S**

- Email: ashudev0987@gmail.com

## 🆘 Support

If you encounter any issues or have questions, please:

1. Check the existing issues
2. Create a new issue with detailed information
3. Contact the maintainer

---

**Note**: This is a microservice designed to work as part of a larger MERN stack application. Make sure to configure the CORS domains and other settings according to your frontend applications.
