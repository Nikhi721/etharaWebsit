import express from 'express';
import { createProject, getProjects } from '../controllers/projectController.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', asyncHandler(getProjects));
router.post('/', protect, authorize('Admin', 'Project Lead'), asyncHandler(createProject));

export default router;
