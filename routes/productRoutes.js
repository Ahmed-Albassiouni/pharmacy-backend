import express from 'express';
import { body, param } from 'express-validator';
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', [param('id').isMongoId().withMessage('Invalid product ID.')], validateRequest, getProductById);

router.post(
  '/',
  protect,
  authorize('admin'),
  [
    body('name').trim().notEmpty().withMessage('Product name is required.'),
    body('category').trim().notEmpty().withMessage('Category is required.'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be >= 0.'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be >= 0.'),
    body('description').optional().isString(),
    body('image').optional().isString(),
  ],
  validateRequest,
  createProduct,
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  [
    param('id').isMongoId().withMessage('Invalid product ID.'),
    body('name').optional().trim().notEmpty(),
    body('category').optional().trim().notEmpty(),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 }),
    body('description').optional().isString(),
    body('image').optional().isString(),
  ],
  validateRequest,
  updateProduct,
);

router.delete(
  '/:id',
  protect,
  authorize('admin'),
  [param('id').isMongoId().withMessage('Invalid product ID.')],
  validateRequest,
  deleteProduct,
);

export default router;
