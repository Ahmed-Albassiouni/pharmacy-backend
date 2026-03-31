import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getProducts = asyncHandler(async (req, res) => {
  const {
    search = '',
    category,
    status,
    minPrice,
    maxPrice,
    sort = 'newest',
  } = req.query;

  const query = {};

  if (search) {
    query.name = { $regex: String(search), $options: 'i' };
  }

  if (category) {
    query.category = category;
  }

  if (status) {
    query.status = status;
  }

  if (typeof minPrice !== 'undefined' || typeof maxPrice !== 'undefined') {
    query.price = {};
    if (typeof minPrice !== 'undefined') query.price.$gte = Number(minPrice);
    if (typeof maxPrice !== 'undefined') query.price.$lte = Number(maxPrice);
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name_asc: { name: 1 },
  };

  const products = await Product.find(query).sort(sortMap[sort] || sortMap.newest);

  res.status(200).json({
    count: products.length,
    products,
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  res.status(200).json(product);
});

export const createProduct = asyncHandler(async (req, res) => {
  const { name, category, price, stock, description, image } = req.body;

  const product = await Product.create({
    name,
    category,
    price,
    stock,
    description,
    image,
  });

  res.status(201).json({
    message: 'Product created successfully.',
    product,
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  res.status(200).json({
    message: 'Product updated successfully.',
    product,
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found.');
  }

  res.status(200).json({ message: 'Product deleted successfully.' });
});
