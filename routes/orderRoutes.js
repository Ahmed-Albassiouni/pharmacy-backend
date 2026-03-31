import express from 'express';
import { body, param } from 'express-validator';
import {
  createOrder,
  getOrders,
  getOrdersByUserId,
  updateOrder,
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('products').isArray({ min: 1 }).withMessage('Products array is required.'),
    body('products.*.productId').isMongoId().withMessage('Each productId must be valid.'),
    body('products.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1.'),
    body('paymentMethod')
      .optional()
      .isIn(['vodafone_cash', 'credit_card', 'cash_on_delivery'])
      .withMessage('Invalid payment method.'),
    body('userId').optional().isMongoId().withMessage('Invalid userId.'),
  ],
  validateRequest,
  createOrder,
);

router.get('/', protect, authorize('admin'), getOrders);

router.get(
  '/user/:id',
  protect,
  [param('id').isMongoId().withMessage('Invalid user ID.')],
  validateRequest,
  getOrdersByUserId,
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  [
    param('id').isMongoId().withMessage('Invalid order ID.'),
    body('status').optional().isIn(['pending', 'completed', 'canceled']),
    body('paymentStatus').optional().isIn(['pending', 'paid', 'failed']),
  ],
  validateRequest,
  updateOrder,
);

export default router;
