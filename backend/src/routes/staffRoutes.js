import express from 'express';
import { createStaff, deleteStaff, getStaff } from '../controllers/staffController.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', asyncHandler(getStaff));
router.post('/', protect, authorize('Admin'), asyncHandler(createStaff));
router.delete('/:id', protect, authorize('Admin'), asyncHandler(deleteStaff));

export default router;
