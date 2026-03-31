import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

const ALLOWED_PAYMENT_METHODS = ['vodafone_cash', 'credit_card', 'cash_on_delivery'];

export const createOrder = asyncHandler(async (req, res) => {
  const { products, paymentMethod = 'cash_on_delivery', userId } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    res.status(400);
    throw new Error('Order must include at least one product.');
  }

  if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
    res.status(400);
    throw new Error('Invalid payment method.');
  }

  const orderUserId = req.user.role === 'admin' && userId ? userId : req.user.id;
  const userExists = await User.findById(orderUserId);
  if (!userExists) {
    res.status(404);
    throw new Error('Order user not found.');
  }

  const productIds = [...new Set(products.map((item) => String(item.productId)))];
  const productDocs = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(productDocs.map((doc) => [String(doc._id), doc]));

  let totalPrice = 0;

  for (const item of products) {
    const productDoc = productMap.get(String(item.productId));
    const quantity = Number(item.quantity);

    if (!productDoc) {
      res.status(404);
      throw new Error(`Product not found: ${item.productId}`);
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      res.status(400);
      throw new Error(`Invalid quantity for product: ${item.productId}`);
    }

    if (productDoc.stock < quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${productDoc.name}. Available: ${productDoc.stock}`);
    }

    totalPrice += productDoc.price * quantity;
  }

  const order = await Order.create({
    userId: orderUserId,
    products: products.map((item) => ({
      productId: item.productId,
      quantity: Number(item.quantity),
    })),
    totalPrice,
    paymentMethod,
    paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'pending',
  });

  for (const item of products) {
    const productDoc = productMap.get(String(item.productId));
    productDoc.stock -= Number(item.quantity);
    await productDoc.save();
  }

  const populatedOrder = await Order.findById(order._id)
    .populate('userId', 'name email role')
    .populate('products.productId', 'name category price image status');

  res.status(201).json({
    message: 'Order created successfully.',
    order: populatedOrder,
  });
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('userId', 'name email role')
    .populate('products.productId', 'name category price image status')
    .sort({ createdAt: -1 });

  res.status(200).json({
    count: orders.length,
    orders,
  });
});

export const getOrdersByUserId = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.role !== 'admin' && req.user.id !== id) {
    return res.status(403).json({ message: 'Forbidden. You can only view your own orders.' });
  }

  const orders = await Order.find({ userId: id })
    .populate('products.productId', 'name category price image status')
    .sort({ createdAt: -1 });

  res.status(200).json({
    count: orders.length,
    orders,
  });
});

export const updateOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, paymentStatus } = req.body;

  const order = await Order.findById(id).populate('products.productId');
  if (!order) {
    res.status(404);
    throw new Error('Order not found.');
  }

  const previousStatus = order.status;

  if (status) {
    order.status = status;
  }

  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }

  if (previousStatus !== 'canceled' && order.status === 'canceled') {
    for (const item of order.products) {
      const product = await Product.findById(item.productId._id);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }
  }

  await order.save();

  const populated = await Order.findById(order._id)
    .populate('userId', 'name email role')
    .populate('products.productId', 'name category price image status');

  res.status(200).json({
    message: 'Order updated successfully.',
    order: populated,
  });
});
