# LexHub Frontend - API Troubleshooting Guide

## Issue Summary

The application was showing a "500 Internal Server Error" due to syntax errors in the AuthPage.tsx file and mismatched API endpoints.

## Root Causes

1. **Syntax Error in AuthPage.tsx**: There was a duplicate function declaration and missing semicolons causing compilation errors.
2. **API Endpoint Mismatch**: The frontend was making requests to API endpoints that didn't match the backend structure.

## Updates Made

1. **Fixed AuthPage.tsx**: Removed duplicate code and fixed syntax errors.
2. **Created Mock API Server**: Set up a mock server to handle authentication requests.
3. **Updated API Endpoints**: Modified the endpoint URLs to match the expected structure.

## Using the Mock API Server

The mock API server provides endpoints for authentication and can be started with:

```bash
node mock-api.js
```

or

```bash
npm run mock-api
```

### Test Credentials

- **Student Account**:
  - Email: `student@example.com`
  - Password: `password`

- **Lawyer Account**:
  - Email: `lawyer@example.com`
  - Password: `password`

## API Endpoints

The mock server runs on http://localhost:8080 and provides the following endpoints:

### Authentication

- **Login**: `POST /auth/login`
  ```json
  {
    "email": "student@example.com",
    "password": "password"
  }
  ```

- **Register User**: `POST /auth/registerUser`
  ```json
  {
    "name": "New User",
    "email": "newuser@example.com",
    "password": "password"
  }
  ```

- **Register Lawyer**: `POST /auth/registerLawyer`
  ```json
  {
    "name": "New Lawyer",
    "email": "newlawyer@example.com",
    "password": "password",
    "phone": "+94 77 123 4567",
    "licenseNumber": "BAR/2023/001234",
    "specialty": "IP Law"
  }
  ```

## Response Format

The API returns responses in the following format:

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "user_type": "student"
  },
  "token": "your.jwt.token"
}
```

## Starting the Application

1. Start the mock API server in one terminal:
   ```bash
   node mock-api.js
   ```

2. In a separate terminal, start the frontend development server:
   ```bash
   npm run dev
   ```

3. The application should now be able to authenticate using the mock API server.
