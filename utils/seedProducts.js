import Product from '../models/Product.js';
import User from '../models/User.js';
import logger from './logger.js';

const sampleProducts = [
  {
    name: 'Paracetamol 500mg Tablets',
    category: 'Medicines',
    price: 58,
    stock: 120,
    description: 'Fast pain and fever relief tablets.',
    image: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Vitamin C 1000mg Effervescent',
    category: 'Vitamins',
    price: 145,
    stock: 80,
    description: 'Daily immunity support with effervescent formula.',
    image: 'https://images.unsplash.com/photo-1576765974234-d3f0bfa5f349?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Omega-3 Fish Oil 1200mg',
    category: 'Vitamins',
    price: 295,
    stock: 55,
    description: 'High-purity omega-3 for heart health.',
    image: 'https://images.unsplash.com/photo-1579165466991-467135ad3110?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Newborn Baby Diapers',
    category: 'Baby',
    price: 379,
    stock: 42,
    description: 'Ultra-soft diapers with leakage protection.',
    image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Hyaluronic Acid Face Serum',
    category: 'Cosmetics',
    price: 319,
    stock: 34,
    description: 'Hydrating serum for smoother skin texture.',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Automatic Blood Pressure Monitor',
    category: 'Medical Devices',
    price: 1320,
    stock: 12,
    description: 'Reliable digital monitor for home blood pressure tracking.',
    image: 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Nebulizer Compressor Kit',
    category: 'Medical Devices',
    price: 990,
    stock: 0,
    description: 'Portable nebulizer kit for respiratory care.',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=900&q=80',
  },
];

export async function seedInitialData() {
  const productCount = await Product.countDocuments();

  if (productCount === 0) {
    await Product.insertMany(sampleProducts);
    logger.info('Sample products seeded successfully.');
  } else {
    logger.info('Products already exist. Skipping product seed.');
  }

  const adminExists = await User.findOne({ email: 'admin@pharmacy.com' });
  if (!adminExists) {
    await User.create({
      name: 'System Admin',
      email: 'admin@pharmacy.com',
      password: 'Admin@12345',
      role: 'admin',
      address: 'Pharmacy HQ',
    });
    logger.info('Default admin user created: admin@pharmacy.com / Admin@12345');
  }

  const userExists = await User.findOne({ email: 'user@pharmacy.com' });
  if (!userExists) {
    await User.create({
      name: 'Demo User',
      email: 'user@pharmacy.com',
      password: 'User@12345',
      role: 'user',
      address: 'Cairo, Egypt',
    });
    logger.info('Default demo user created: user@pharmacy.com / User@12345');
  }
}
