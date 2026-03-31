import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { seedInitialData } from '../utils/seedProducts.js';

dotenv.config();

async function runSeed() {
  try {
    await connectDB();
    await seedInitialData();
    console.log('Seed completed successfully.');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

runSeed();
