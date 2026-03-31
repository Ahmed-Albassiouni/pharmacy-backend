import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    requestedMedicines: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
