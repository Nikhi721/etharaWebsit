import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import staffRoutes from './routes/staffRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'task-track-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err.code === 11000) return res.status(409).json({ message: 'Duplicate record' });
  res.status(500).json({
    message: process.env.NODE_ENV === 'production' ? 'Server error' : err.message
  });
});

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`API running on port ${port}`));
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
