# Task Manager Application

A full-stack task management application built with NestJS (MongoDB) backend and React frontend.

## Features

- User authentication (register, login, JWT)
- Role-based access control (admin/user)
- Task management (create, read, update, delete)
- Task filtering and pagination
- User management (admin only)
- Responsive UI with Material-UI
- Performance optimized

## Performance Optimizations

### Backend
- Database indexing for faster queries
- Lean queries for better MongoDB performance
- Response compression for faster API responses
- Optimized database queries

### Frontend
- Code splitting with React.lazy and Suspense
- Preloading critical resources
- Optimized component rendering
- Centralized API service

## Prerequisites

- Node.js (v14+)
- MongoDB
- npm or yarn

## Installation

### Clone the repository
```bash
git clone <repository-url>
cd task-manager
```

### Backend Setup
```bash
cd task-manager-api

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your MongoDB connection string
# MONGODB_URI=mongodb://localhost:27017/task_manager

# Create database indexes (optional but recommended for performance)
npm run create:indexes

# Create admin user
npm run create:admin

# Start the backend server
npm run start:dev
```

### Frontend Setup
```bash
cd task-manager-client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your API URL
# REACT_APP_API_URL=http://localhost:3001

# Start the frontend server
npm start
```

## Admin Account

The default admin account is:
- Email: admin@example.com
- Password: Admin123!

You can change these defaults by setting environment variables:
- ADMIN_EMAIL
- ADMIN_PASSWORD
- ADMIN_NAME

## API Documentation

Swagger API documentation is available at:
```
http://localhost:3001/api-docs
```

## License

MIT 