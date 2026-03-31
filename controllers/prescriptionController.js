import Prescription from '../models/Prescription.js';
import asyncHandler from '../utils/asyncHandler.js';

function normalizeRequestedMedicines(input) {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof input === 'string') {
    const trimmed = input.trim();

    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => String(item).trim()).filter(Boolean);
      }
    } catch {
      // Fallback to comma-separated parsing
    }

    return trimmed
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

export const createPrescription = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('Prescription file is required.');
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const requestedMedicines = normalizeRequestedMedicines(req.body.requestedMedicines);

  const prescription = await Prescription.create({
    userId: req.user.id,
    fileUrl,
    requestedMedicines,
  });

  res.status(201).json({
    message: 'Prescription uploaded successfully.',
    prescription,
  });
});

export const getPrescriptions = asyncHandler(async (req, res) => {
  const prescriptions = await Prescription.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  res.status(200).json({
    count: prescriptions.length,
    prescriptions,
  });
});

export const updatePrescription = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const prescription = await Prescription.findById(id);
  if (!prescription) {
    res.status(404);
    throw new Error('Prescription not found.');
  }

  prescription.status = status;
  await prescription.save();

  res.status(200).json({
    message: 'Prescription updated successfully.',
    prescription,
  });
});
