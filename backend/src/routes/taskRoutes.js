import express from 'express';
import { createTask, getMyTasks } from '../controllers/taskController.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/me', protect, asyncHandler(getMyTasks));
router.post('/', protect, asyncHandler(createTask));

export default router;
