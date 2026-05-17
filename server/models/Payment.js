const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  jobId:             { type: mongoose.Schema.Types.ObjectId, ref: 'PrintJob', required: true },
  razorpayOrderId:   { type: String, required: true, unique: true },
  razorpayPaymentId: { type: String },
  amount:            { type: Number, required: true },
  status:            { type: String, enum: ['created', 'paid', 'captured', 'failed', 'refunded'], default: 'created' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
