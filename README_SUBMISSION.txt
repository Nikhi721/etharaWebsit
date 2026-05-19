Team Task Manager - Full Stack Assignment

Live Application URL:
https://invigorating-warmth-production-e098.up.railway.app/

GitHub Repository:
https://github.com/Nikhi721/etharaWebsit

Backend API:
https://etharawebsit-production.up.railway.app/api/health

Project Overview:
Task Track is a full-stack team task manager built with React, Node.js, Express, MongoDB Atlas, and JWT authentication. The application allows users to authenticate, manage staff/team members, create projects, track assigned task work, punch in/out, submit task progress, and view task logs.

Key Features:
1. Authentication
- Signup and login functionality
- JWT-based authentication
- Password hashing using bcrypt
- Role-based access support

2. Role-Based Access Control
- Admin role can authorize staff members
- Admin can create projects
- Project Lead, Quality Reviewer, and Tasker roles are supported
- Users can access dashboard functionality based on role

3. Project and Team Management
- Admin can add Project Leads, Quality Reviewers, and Taskers
- Staff authorization flow validates correct email and role
- Admin can create projects with estimated duration

4. Task Tracking
- Users can punch in and punch out
- Users can start tasks only after punch in
- Users can select project, enter task ID, upload image, and submit task
- Task duration is calculated automatically
- Completed and cancelled task logs are stored

5. Dashboard
- Shows completed task count
- Shows total tracked time
- Shows average task time
- Shows today's task log and task status

Tech Stack:
Frontend:
- React
- Vite
- CSS
- Lucide React Icons

Backend:
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

Database:
- MongoDB Atlas
- Collections include users, staff authorizations, projects, and tasks

API Routes:
Auth:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

Staff:
- GET /api/staff
- POST /api/staff
- DELETE /api/staff/:id

Projects:
- GET /api/projects
- POST /api/projects

Tasks:
- GET /api/tasks/me
- POST /api/tasks

Default Admin Login:
Email: nikhil.k@ethara.ai
Password: password123
Role: Admin

Deployment:
- Frontend deployed on Railway
- Backend deployed on Railway
- Database hosted on MongoDB Atlas

Environment Variables:
Backend:
- MONGO_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- CLIENT_URL

Frontend:
- VITE_API_URL

How to Run Locally:
1. Clone the repository
2. Install backend dependencies:
   cd backend
   npm install
3. Install frontend dependencies:
   cd frontend
   npm install
4. Add backend .env file with MongoDB Atlas URI and JWT secret
5. Add frontend .env file with backend API URL
6. Run backend:
   npm run dev
7. Run frontend:
   npm run dev

Author:
Nikhil
