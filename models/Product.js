import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 2000,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['available', 'out-of-stock'],
      default: 'available',
    },
  },
  { timestamps: true },
);

function deriveStatus(stock) {
  return Number(stock) > 0 ? 'available' : 'out-of-stock';
}

productSchema.pre('save', function setStatus(next) {
  if (this.isModified('stock') || this.isNew) {
    this.status = deriveStatus(this.stock);
  }
  next();
});

productSchema.pre('findOneAndUpdate', function setStatusOnUpdate(next) {
  const update = this.getUpdate() || {};
  const directStock = update.stock;
  const setStock = update.$set?.stock;
  const nextStock = typeof setStock !== 'undefined' ? setStock : directStock;

  if (typeof nextStock !== 'undefined') {
    update.$set = update.$set || {};
    update.$set.status = deriveStatus(nextStock);
    this.setUpdate(update);
  }

  next();
});

const Product = mongoose.model('Product', productSchema);

export default Product;
