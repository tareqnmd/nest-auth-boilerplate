# Taiyeba Server

A modern, scalable NestJS-based backend server application with comprehensive authentication, user management, and communication features.

## 🚀 Technologies

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT & Google OAuth
- **Validation**: Class Validator & Class Transformer
- **Password Hashing**: Bcrypt
- **File Upload**: Cloudinary integration with Sharp image processing
- **Email**: Nodemailer with Gmail support
- **Security**: Helmet, Rate Limiting (Throttler)
- **Logging**: Pino Logger
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Code Quality**: ESLint, Prettier, Husky

## 📋 Features

- ✅ User authentication and authorization (JWT & OAuth)
- ✅ User management with role-based access control
- ✅ Email communication system
- ✅ File upload with image processing
- ✅ Rate limiting and security headers
- ✅ Health check endpoints
- ✅ API versioning (v1)
- ✅ Comprehensive error handling
- ✅ Request/Response logging
- ✅ Request timeout protection
- ✅ Database migrations and seeding
- ✅ Account lockout mechanism
- ✅ Swagger API documentation

## 📁 Project Structure

```
taiyeba-server/
├── src/
│   ├── common/              # Shared utilities, DTOs, decorators
│   │   ├── constants/       # Application constants
│   │   ├── decorators/      # Custom decorators
│   │   ├── dto/            # Data Transfer Objects
│   │   ├── enum/           # Enumerations
│   │   ├── filters/        # Exception filters
│   │   ├── interceptors/   # Request/Response interceptors
│   │   ├── interfaces/     # TypeScript interfaces
│   │   ├── messages/       # Message templates
│   │   └── utils/          # Utility functions
│   ├── config/             # Configuration files
│   ├── database/           # Database module, migrations, seeds
│   ├── modules/            # Application modules
│   │   ├── auth/          # Authentication module
│   │   ├── communication/ # Communication module
│   │   ├── hashing/       # Password hashing service
│   │   ├── health/        # Health check endpoints
│   │   ├── mail/          # Email service
│   │   ├── message/       # Messaging module
│   │   ├── rate-limit/    # Rate limiting module
│   │   ├── token/         # Token management
│   │   ├── upload/        # File upload service
│   │   └── user/          # User management
│   ├── app.module.ts      # Root application module
│   └── main.ts            # Application entry point
├── test/                   # E2E tests
├── dist/                   # Compiled output
└── docs/                   # Documentation
```

## 🛠️ Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (running instance)
- **Yarn** package manager
- **Cloudinary** account (for file uploads)
- **Gmail** account with App Password (for email)

## 📦 Installation

```bash
# Install dependencies
yarn install
```

## ⚙️ Environment Configuration

Create a `.env` file in the root directory with the following environment variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
REQUEST_TIMEOUT=30000  # Request timeout in milliseconds (default: 30000ms/30s)

# Database
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=taiyeba

# JWT Configuration
JWT_TOKEN_SECRET=your-secret-key-change-in-production
JWT_ACCESS_TOKEN_TTL=3600
USER_TOKEN_TTL=86400
JWT_REFRESH_TOKEN_TTL=604800

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth (optional)
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Gmail Configuration (for sending emails)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-gmail@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_FROM="Your App Name <your-gmail@gmail.com>"
```

### Gmail Setup Instructions

To use Gmail for sending emails:

1. **Enable 2-Step Verification** on your Google account:
   - Go to your [Google Account settings](https://myaccount.google.com/)
   - Navigate to Security > 2-Step Verification
   - Follow the instructions to enable it

2. **Generate App Password**:
   - Go to Google Account > Security > 2-Step Verification > App passwords
   - Select "Mail" and your device
   - Copy the generated 16-character password
   - Use this password as `MAIL_PASSWORD` in your `.env` file

3. **Configure Environment Variables**:
   - Set `MAIL_HOST` to `smtp.gmail.com`
   - Set `MAIL_PORT` to `587` (for TLS) or `465` (for SSL)
   - Set `MAIL_USER` to your Gmail address
   - Set `MAIL_PASSWORD` to the App Password you generated
   - Set `MAIL_FROM` to your sender name and email

### Cloudinary Setup Instructions

1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret from the dashboard
3. Add these credentials to your `.env` file

## 🚀 Running the Application

```bash
# Development mode with hot-reload
yarn start:dev

# Production mode
yarn build
yarn start:prod

# Debug mode
yarn start:debug
```

The server will start on `http://localhost:3000` (or your configured PORT).

## 📚 API Documentation

Once the application is running, access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

The API uses versioning with the prefix `/api/v1/`.

## 🧪 Testing

```bash
# Run unit tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:cov

# Run E2E tests
yarn test:e2e

# Debug tests
yarn test:debug
```

## 🎨 Code Quality

```bash
# Format code with Prettier
yarn format

# Lint code with ESLint
yarn lint

# Lint and fix issues
yarn lint --fix
```

## 📝 Available Scripts

| Script             | Description                          |
| ------------------ | ------------------------------------ |
| `yarn start`       | Start the application                |
| `yarn start:dev`   | Start in development mode with watch |
| `yarn start:debug` | Start in debug mode                  |
| `yarn start:prod`  | Start in production mode             |
| `yarn build`       | Build the application                |
| `yarn format`      | Format code with Prettier            |
| `yarn lint`        | Lint code with ESLint                |
| `yarn test`        | Run unit tests                       |
| `yarn test:watch`  | Run tests in watch mode              |
| `yarn test:cov`    | Run tests with coverage              |
| `yarn test:e2e`    | Run E2E tests                        |

## 🏗️ Current Modules

### Auth Module

- User registration and login
- JWT-based authentication
- Google OAuth integration
- Refresh token management
- Account lockout mechanism

### User Module

- User CRUD operations
- Profile management
- User search and filtering
- Role-based access control

### Token Module

- Token generation and validation
- Token refresh functionality
- Token revocation

### Communication Module

- Email sending functionality
- Message templates
- Gmail integration

### Upload Module

- File upload handling
- Image processing with Sharp
- Cloudinary integration
- Multiple file upload support

### Health Module

- Health check endpoints
- Database connectivity check
- Service status monitoring

## 🔐 Security Features

- **Helmet**: Security headers for Express
- **Rate Limiting**: Request throttling to prevent abuse
- **Request Timeout**: Global timeout interceptor to prevent hanging requests
- **CORS**: Configurable Cross-Origin Resource Sharing
- **JWT**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Validation**: Input validation with class-validator
- **Account Lockout**: Protection against brute force attacks

## 📊 Logging

The application uses Pino logger with pretty printing in development mode for:

- Request/Response logging
- Error tracking
- Performance monitoring

## 🔄 API Versioning

The API uses URI versioning with the format `/api/v1/endpoint`.

To create a new version, add the version decorator to your controller:

```typescript
@Controller({ version: '2' })
export class MyController {}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is [UNLICENSED](LICENSE) and private.

## 👥 Author

- **Tareq**

## 🎯 Future Development

🚧 **More modules and features are coming in the future!**

This project is under active development, and additional features and modules will be added over time:

- [ ] Real-time notifications with WebSockets
- [ ] Advanced analytics and reporting
- [ ] Payment integration
- [ ] Multi-language support
- [ ] Advanced caching with Redis
- [ ] Microservices architecture
- [ ] GraphQL API support

Stay tuned for updates!

---

**Note**: Remember to never commit your `.env` file to version control. Keep your secrets secure!
