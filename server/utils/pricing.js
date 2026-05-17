const MATERIAL_RATES = {
  'PLA':   2.00,
  'PLA+':  2.50,
  'PETG':  3.00,
  'ABS':   3.50,
  'ASA':   3.50,
  'TPU':   4.00,
  'PA-CF': 8.00,
};

const DELIVERY_RATES = {
  pickup: 0,
  courier: { default: 120, local: 80, remote: 200 },
};

const SETUP_FEE = 50;
const MULTICOLOR_FEE = 50;
const GST_RATE = 0.18;

exports.calculateCost = ({ material, quantity = 1, deliveryMethod = 'pickup', multicolor = false, estimatedWeight = 50 }) => {
  const ratePerGram = MATERIAL_RATES[material] || 2.00;
  const totalGrams = estimatedWeight * quantity;
  const materialCost = Math.max(ratePerGram * totalGrams, 50);
  const setupFee = SETUP_FEE;
  const multicolorFee = multicolor ? MULTICOLOR_FEE : 0;
  const deliveryCost = deliveryMethod === 'pickup' ? 0 : DELIVERY_RATES.courier.default;
  const subtotal = materialCost + setupFee + multicolorFee + deliveryCost;
  const gst = Math.round(subtotal * GST_RATE);
  const totalCost = subtotal + gst;

  return { materialCost, setupFee, deliveryCost, gst, totalCost };
};
