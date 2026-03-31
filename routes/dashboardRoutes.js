import express from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getDashboard);

export default router;
