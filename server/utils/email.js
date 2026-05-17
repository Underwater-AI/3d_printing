const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOrderConfirmation = async (job) => {
  if (!process.env.EMAIL_USER) return;

  const orderId = `UAI-${job._id.toString().slice(-6).toUpperCase()}`;

  await transporter.sendMail({
    from: `"Underwater AI 3D Prints" <${process.env.EMAIL_USER}>`,
    to: job.customerEmail,
    subject: `Order Confirmed — #${orderId}`,
    html: `
      <div style="font-family: 'DM Sans', sans-serif; background: #000814; color: #f0f4ff; padding: 32px; max-width: 600px; margin: auto;">
        <h2 style="color: #00d4ff; margin-bottom: 16px;">Your 3D Print Order is Confirmed!</h2>
        <p>Hi ${job.customerName},</p>
        <p>We've received your print job and payment. Here's your summary:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #111d35; color: #8899bb;">Order ID</td><td style="padding: 8px; border-bottom: 1px solid #111d35;">${orderId}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #111d35; color: #8899bb;">Material</td><td style="padding: 8px; border-bottom: 1px solid #111d35;">${job.material}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #111d35; color: #8899bb;">Quantity</td><td style="padding: 8px; border-bottom: 1px solid #111d35;">${job.quantity}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #111d35; color: #8899bb;">Total Paid</td><td style="padding: 8px; border-bottom: 1px solid #111d35; color: #00d4ff; font-weight: bold;">₹${job.totalCost}</td></tr>
          <tr><td style="padding: 8px; color: #8899bb;">Delivery</td><td style="padding: 8px;">${job.deliveryMethod === 'pickup' ? 'Self Pickup — IISER Kolkata Campus' : 'Courier'}</td></tr>
        </table>
        <p style="margin-top: 24px;">— Underwater AI Team<br/>IISER Kolkata Campus, Mohanpur, Nadia, West Bengal</p>
      </div>
    `,
  });
};

exports.sendAdminAlert = async (job) => {
  if (!process.env.EMAIL_USER || !process.env.ADMIN_EMAIL) return;

  const orderId = `UAI-${job._id.toString().slice(-6).toUpperCase()}`;

  await transporter.sendMail({
    from: `"UAI Print System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `[NEW ORDER] ${job.material} × ${job.quantity} — ₹${job.totalCost}`,
    html: `
      <div style="font-family: monospace; background: #000814; color: #f0f4ff; padding: 24px;">
        <h3 style="color: #00d4ff;">New Print Job #${orderId}</h3>
        <p><b>Customer:</b> ${job.customerName} (${job.customerEmail})</p>
        <p><b>File:</b> ${job.originalName}</p>
        <p><b>Settings:</b> ${job.material}, ${job.layerHeight}mm, ${job.infill}% infill</p>
        <p><b>Total:</b> ₹${job.totalCost}</p>
      </div>
    `,
  });
};
