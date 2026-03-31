import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.status(200).json({
    count: users.length,
    users,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user.id === id) {
    res.status(400);
    throw new Error('Admin cannot delete own account from this endpoint.');
  }

  const deleted = await User.findByIdAndDelete(id);
  if (!deleted) {
    res.status(404);
    throw new Error('User not found.');
  }

  res.status(200).json({ message: 'User deleted successfully.' });
});
