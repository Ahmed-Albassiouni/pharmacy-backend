import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import Prescription from '../models/Prescription.js';
import asyncHandler from '../utils/asyncHandler.js';

function formatCurrencyNumber(value) {
  return Number((value || 0).toFixed(2));
}

export const getDashboard = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    outOfStockMedicines,
    availableMedicines,
    pendingPrescriptions,
  ] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Product.countDocuments({ status: 'out-of-stock' }),
    Product.countDocuments({ status: 'available' }),
    Prescription.countDocuments({ status: 'pending' }),
  ]);

  const salesAgg = await Order.aggregate([
    { $match: { status: { $ne: 'canceled' } } },
    {
      $group: {
        _id: null,
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);

  const totalSales = salesAgg.length ? formatCurrencyNumber(salesAgg[0].totalSales) : 0;

  const dailyRevenue = await Order.aggregate([
    { $match: { status: { $ne: 'canceled' } } },
    {
      $group: {
        _id: {
          day: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        },
        value: { $sum: '$totalPrice' },
      },
    },
    { $sort: { '_id.day': 1 } },
    { $limit: 14 },
  ]);

  const weeklyRevenue = await Order.aggregate([
    { $match: { status: { $ne: 'canceled' } } },
    {
      $group: {
        _id: {
          year: { $isoWeekYear: '$createdAt' },
          week: { $isoWeek: '$createdAt' },
        },
        value: { $sum: '$totalPrice' },
      },
    },
    { $sort: { '_id.year': 1, '_id.week': 1 } },
    { $limit: 12 },
  ]);

  const monthlyRevenue = await Order.aggregate([
    { $match: { status: { $ne: 'canceled' } } },
    {
      $group: {
        _id: {
          month: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        },
        value: { $sum: '$totalPrice' },
      },
    },
    { $sort: { '_id.month': 1 } },
    { $limit: 12 },
  ]);

  const lowStockProducts = await Product.find({ stock: { $lte: 10 } })
    .select('name stock status category price')
    .sort({ stock: 1 })
    .limit(20);

  res.status(200).json({
    overview: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales,
      outOfStockMedicines,
      availableMedicines,
      pendingPrescriptions,
    },
    revenue: {
      daily: dailyRevenue.map((item) => ({ label: item._id.day, value: formatCurrencyNumber(item.value) })),
      weekly: weeklyRevenue.map((item) => ({
        label: `${item._id.year}-W${String(item._id.week).padStart(2, '0')}`,
        value: formatCurrencyNumber(item.value),
      })),
      monthly: monthlyRevenue.map((item) => ({
        label: item._id.month,
        value: formatCurrencyNumber(item.value),
      })),
    },
    stockOverview: lowStockProducts,
  });
});
