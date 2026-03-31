import mongoose from 'mongoose';

const uri = "mongodb://pharmacy_user:pharmacy2026@ac-5pbp7sq-shard-00-00.f3mrtzu.mongodb.net:27017,ac-5pbp7sq-shard-00-01.f3mrtzu.mongodb.net:27017,ac-5pbp7sq-shard-00-02.f3mrtzu.mongodb.net:27017/pharmacy_db?ssl=true&replicaSet=atlas-5pbp7sq-shard-0&authSource=admin&retryWrites=true&w=majority";

console.log("Connecting to MongoDB...");

mongoose.connect(uri, { 
  serverSelectionTimeoutMS: 5000, 
  family: 4 
})
.then(() => {
  console.log("✅ Success! Connected to MongoDB");
  process.exit(0);
})
.catch(err => {
  console.error("❌ Failed:", err.message);
  process.exit(1);
});