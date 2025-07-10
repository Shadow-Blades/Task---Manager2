# Task Manager Project

A full-stack web application for task management.

- **Backend:** NestJS with MongoDB
- **Frontend:** React (Material UI)
- **Authentication:** JWT-based

---

## Features
- User registration/login (JWT)
- Role-based access (admin/user)
- Task CRUD, filtering, pagination
- User management (admin)
- API docs via Swagger

---

## Prerequisites
- Node.js v14+
- npm or yarn
- MongoDB
- (Optional) Git

---

## Setup Guide (Windows/Linux/Mac)

### 1. Clone the Repository
```bash
git clone https://github.com/Shadow-Blades/Task---Manager2.git
cd Task---Manager2
```

### 2. Backend Setup
```bash
cd task-manager-api
npm install
cp .env.example .env # (or copy manually on Windows)
# Edit .env as needed (see .env.example)
```
- **Never commit your `.env` file!**
- Start MongoDB (default: mongodb://localhost:27017/task_manager)

#### Start Backend
```bash
npm run start:dev
# or for production
npm run build
npm run start:prod
```

### 3. Frontend Setup
```bash
cd ../task-manager-client
npm install
npm start
```
- App runs at http://localhost:3001 by default

---

## Creating an Admin User
1. Register a user via frontend or API.
2. In MongoDB shell/Compass, run:
   ```
   db.users.updateOne({email: "your-email@example.com"}, {$set: {role: "admin"}})
   ```

---

## API Documentation
- Swagger: http://localhost:3000/api-docs

### Main Endpoints
- `POST /auth/register` — Register
- `POST /auth/login` — Login
- `GET /auth/profile` — Profile
- `GET /users` — List users (admin)
- `GET /tasks` — List tasks (filter/paginate)
- ...see Swagger for full list

---

## Troubleshooting
- **MongoDB not connecting?** Ensure service is running, check `.env` connection string.
- **Port in use?** Change `PORT` in `.env` (backend) or `start` script (frontend).
- **Dependency issues?**
  ```
  npm cache clean --force
  rmdir /s /q node_modules
  npm install
  ```

---

## Security Notes
- Change `JWT_SECRET` in production
- Use HTTPS in production
- Never commit `.env` (already in .gitignore)

---

## Future Enhancements
- Email notifications
- Task comments/logs
- File attachments
- Project grouping
- Team management
- Dark mode

---

## Project Structure
```
task-manager-api/      # Backend (NestJS)
  src/
    auth/ common/ tasks/ users/
  .env.example
  package.json

task-manager-client/   # Frontend (React)
  src/
    components/ context/ pages/ services/ utils/
  package.json
```