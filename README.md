## Run Locally
Start both apps in separate terminals:
Live_Url: https://invigorating-warmth-production-e098.up.railway.app/
```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```
Default admin login:

- Email: `nikhil.k@ethara.ai`
- Password: `password123`
- Role: `Admin`
=======

# Task Track

Task Track is a full-stack team task management and productivity tracking application built with React, Express, MongoDB Atlas, and JWT authentication. It supports role-based login, admin staff authorization, project creation, punch-in/punch-out tracking, task submission, image upload preview, and daily task logs.

## Features

- Role-based authentication using JWT
- Admin dashboard for staff authorization
- Project Lead, Quality Reviewer, and Tasker role support
- MongoDB Atlas database integration
- Punch In / Punch Out work session tracking
- Task timer with duration calculation
- Task submission and cancellation logs
- Project creation from admin dashboard
- React component-based frontend structure
- Express REST API backend structure
- Separate frontend and backend deployment support

## Tech Stack

**Frontend**

- React
- Vite
- CSS
- Lucide React Icons

**Backend**

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

## Project Structure

```text
task-track/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   └── dashboard/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed.js
│   │   └── server.js
│   └── package.json
│
└── README.md


