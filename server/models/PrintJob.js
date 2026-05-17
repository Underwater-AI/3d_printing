const mongoose = require('mongoose');

const PrintJobSchema = new mongoose.Schema({
  // Customer
  customerId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName:  { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },

  // File
  fileId:       { type: String, required: true },
  originalName: { type: String, required: true },
  fileSize:     { type: Number },
  filePath:     { type: String },

  // Print Settings
  material:    { type: String, required: true, enum: ['PLA', 'PLA+', 'PETG', 'ABS', 'ASA', 'TPU', 'PA-CF'] },
  color:       { type: String, default: 'White' },
  layerHeight: { type: Number, default: 0.20 },
  infill:      { type: Number, default: 20 },
  supports:    { type: Boolean, default: false },
  brim:        { type: Boolean, default: false },
  multicolor:  { type: Boolean, default: false },
  quantity:    { type: Number, default: 1, min: 1 },

  // Delivery
  deliveryMethod:      { type: String, enum: ['pickup', 'courier'], required: true },
  address:             { type: String },
  city:                { type: String },
  state:               { type: String },
  pincode:             { type: String },
  specialInstructions: { type: String },

  // Pricing (server-calculated)
  estimatedWeight:    { type: Number },
  estimatedPrintTime: { type: Number },
  materialCost:       { type: Number },
  setupFee:           { type: Number, default: 50 },
  deliveryCost:       { type: Number, default: 0 },
  gst:                { type: Number },
  totalCost:          { type: Number },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'printing', 'quality_check', 'ready', 'dispatched', 'delivered', 'cancelled'],
    default: 'pending',
  },

  paidAt:      { type: Date },
  printedAt:   { type: Date },
  deliveredAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('PrintJob', PrintJobSchema);
