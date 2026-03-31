import express from 'express';
import { param } from 'express-validator';
import { deleteUser, getUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/', getUsers);

router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('Invalid user ID.')],
  validateRequest,
  deleteUser,
);

export default router;
