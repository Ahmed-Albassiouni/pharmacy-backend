import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';

function formatAuthResponse(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    address: user.address,
  };
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, address } = req.body;

  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    res.status(400);
    throw new Error('Email is already registered.');
  }

  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    role: 'user',
    address: address || '',
  });

  const token = generateToken({
    id: user._id,
    role: user.role,
    email: user.email,
  });

  res.status(201).json({
    message: 'User registered successfully.',
    user: formatAuthResponse(user),
    token,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  const validPassword = await user.comparePassword(password);
  if (!validPassword) {
    res.status(401);
    throw new Error('Invalid email or password.');
  }

  const token = generateToken({
    id: user._id,
    role: user.role,
    email: user.email,
  });

  res.status(200).json({
    message: 'Login successful.',
    user: formatAuthResponse(user),
    token,
  });
});
