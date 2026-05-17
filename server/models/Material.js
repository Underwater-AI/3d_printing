const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  pricePerGram:{ type: Number, required: true },
  minCharge:   { type: Number, required: true },
  available:   { type: Boolean, default: true },
  category:    { type: String, enum: ['standard', 'engineering', 'flexible', 'specialty'], required: true },
  colors:      [{ type: String }],
  properties: {
    tempRange: { type: String },
    bedTemp:   { type: String },
    flexible:  { type: Boolean, default: false },
    foodSafe:  { type: Boolean, default: false },
  },
}, { timestamps: true });

module.exports = mongoose.model('Material', MaterialSchema);
