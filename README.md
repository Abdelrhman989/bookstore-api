# Bookstore API

## New Improvements

### 1. Added Logging

An integrated logging system has been added using Winston and Morgan:

- **Winston**: For logging different events with multiple levels (error, warn, info, http, debug)
- **Morgan**: For logging HTTP requests in a standardized format

Logs are saved in the `logs/` directory and include:
- `error.log`: For errors only
- `all.log`: For all log levels
- Console logs: For real-time log display during development

### 2. Structure Improvements

- **Service Layer**: A service layer has been added to separate business logic from controllers
- **Enhanced Error Handling**: Error handling has been improved to provide more detailed error messages and better error logging
- **More Organized Structure**: Separation of responsibilities between different layers

### 3. Added Rate Limiting

Protection against denial of service attacks has been added using express-rate-limit:

- **General Limit**: 100 requests per IP during 15 minutes for all routes
- **Authentication-specific Limit**: Only 10 attempts per IP during an hour for authentication routes

### 4. Added Unit Tests

Jest framework has been added for unit and integration tests:

- Tests for Logger
- Tests for Rate Limiting
- Integration tests for Books API

## How to Use

### Running the Application

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run in production mode
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookstore
MONGO_URI_TEST=mongodb://localhost:27017/bookstore-test
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=30d
NODE_ENV=development
```

## API Documentation

Swagger documentation can be accessed at:

```
http://localhost:5000/api-docs
```