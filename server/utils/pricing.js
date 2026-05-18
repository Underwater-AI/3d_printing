const MATERIAL_RATES = {
  'PLA':   2.00,
  'PLA+':  2.50,
  'PETG':  3.00,
  'ABS':   3.50,
  'ASA':   3.50,
  'TPU':   4.00,
  'PA-CF': 8.00,
};

const WEST_BENGAL_CITIES = ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri', 'Asansol', 'Bardhaman', 'Kharagpur', 'Malda', 'Baharampur', 'Krishnanagar'];

const DELIVERY_RATES = {
  pickup: 0,
  courier: { default: 120, local: 80, remote: 200 },
};

const SETUP_FEE = 50;
const MULTICOLOR_FEE = 50;
const GST_RATE = 0.18;

function getDeliveryCost(deliveryMethod, state, city) {
  if (deliveryMethod === 'pickup') return 0;
  if (state === 'West Bengal' || WEST_BENGAL_CITIES.includes(city)) return DELIVERY_RATES.courier.local;
  const remoteStates = ['Arunachal Pradesh', 'Mizoram', 'Nagaland', 'Manipur', 'Meghalaya', 'Tripura', 'Sikkim', 'Ladakh', 'Jammu & Kashmir'];
  if (remoteStates.includes(state)) return DELIVERY_RATES.courier.remote;
  return DELIVERY_RATES.courier.default;
}

exports.calculateCost = ({ material, quantity = 1, deliveryMethod = 'pickup', multicolor = false, estimatedWeight = 50, state, city }) => {
  const ratePerGram = MATERIAL_RATES[material] || 2.00;
  const totalGrams = estimatedWeight * quantity;
  const materialCost = Math.max(ratePerGram * totalGrams, 50);
  const setupFee = SETUP_FEE;
  const multicolorFee = multicolor ? MULTICOLOR_FEE : 0;
  const deliveryCost = getDeliveryCost(deliveryMethod, state, city);
  const subtotal = materialCost + setupFee + multicolorFee + deliveryCost;
  const gst = Math.round(subtotal * GST_RATE);
  const totalCost = subtotal + gst;

  return { materialCost, setupFee, multicolorFee, deliveryCost, gst, totalCost };
};
