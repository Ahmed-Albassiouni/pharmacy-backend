import express from 'express';
import { body, param } from 'express-validator';
import {
  createPrescription,
  getPrescriptions,
  updatePrescription,
} from '../controllers/prescriptionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post(
  '/',
  protect,
  upload.single('file'),
  [
    body('requestedMedicines')
      .optional()
      .custom((value) => typeof value === 'string' || Array.isArray(value))
      .withMessage('requestedMedicines must be a string or an array.'),
  ],
  validateRequest,
  createPrescription,
);

router.get('/', protect, authorize('admin'), getPrescriptions);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  [
    param('id').isMongoId().withMessage('Invalid prescription ID.'),
    body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid prescription status.'),
  ],
  validateRequest,
  updatePrescription,
);

export default router;
