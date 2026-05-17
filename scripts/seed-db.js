require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Material = require('../server/models/Material');
const User = require('../server/models/User');

const materials = [
  { name: 'PLA', displayName: 'PLA Standard', pricePerGram: 2.00, minCharge: 50, category: 'standard', properties: { tempRange: '180-220°C', bedTemp: '60°C', flexible: false, foodSafe: false } },
  { name: 'PLA+', displayName: 'PLA+ Premium', pricePerGram: 2.50, minCharge: 60, category: 'standard', properties: { tempRange: '190-220°C', bedTemp: '60°C', flexible: false, foodSafe: false } },
  { name: 'PETG', displayName: 'PETG', pricePerGram: 3.00, minCharge: 70, category: 'engineering', properties: { tempRange: '230-250°C', bedTemp: '80°C', flexible: false, foodSafe: true } },
  { name: 'ABS', displayName: 'ABS', pricePerGram: 3.50, minCharge: 80, category: 'engineering', properties: { tempRange: '230-260°C', bedTemp: '100°C', flexible: false, foodSafe: false } },
  { name: 'ASA', displayName: 'ASA', pricePerGram: 3.50, minCharge: 80, category: 'engineering', properties: { tempRange: '235-255°C', bedTemp: '100°C', flexible: false, foodSafe: false } },
  { name: 'TPU', displayName: 'TPU 95A', pricePerGram: 4.00, minCharge: 80, category: 'flexible', properties: { tempRange: '220-240°C', bedTemp: '50°C', flexible: true, foodSafe: false } },
  { name: 'PA-CF', displayName: 'Carbon Fiber Nylon', pricePerGram: 8.00, minCharge: 150, category: 'specialty', properties: { tempRange: '260-280°C', bedTemp: '80°C', flexible: false, foodSafe: false } },
];

const colors = ['White', 'Black', 'Grey', 'Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Pink', 'Transparent'];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  // Seed materials
  await Material.deleteMany({});
  for (const mat of materials) {
    await Material.create({ ...mat, available: true, colors });
    console.log(`Seeded material: ${mat.displayName}`);
  }

  // Seed admin user
  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD || 'changeme',
      role: 'admin',
      phone: '0000000000',
    });
    console.log('Admin user created');
  }

  console.log('Seeding complete');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
