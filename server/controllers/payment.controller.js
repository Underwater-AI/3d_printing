const crypto = require('crypto');
const razorpay = require('../config/razorpay');
const Payment = require('../models/Payment');
const PrintJob = require('../models/PrintJob');
const { sendOrderConfirmation, sendAdminAlert } = require('../utils/email');

exports.createOrder = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const job = await PrintJob.findById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const amountPaise = Math.round(job.totalCost * 100);

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `UAI-${jobId}`,
      notes: {
        jobId: jobId.toString(),
        customer: job.customerEmail,
      },
    });

    await Payment.create({
      jobId,
      razorpayOrderId: order.id,
      amount: job.totalCost,
      status: 'created',
    });

    res.json({
      orderId: order.id,
      amount: amountPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, jobId } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature' });
    }

    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { razorpayPaymentId: razorpay_payment_id, status: 'paid' }
    );

    const job = await PrintJob.findByIdAndUpdate(
      jobId,
      { status: 'confirmed', paidAt: new Date() },
      { new: true }
    );

    try {
      await sendOrderConfirmation(job);
      await sendAdminAlert(job);
    } catch (emailErr) {
      console.error('Email notification failed:', emailErr.message);
    }

    res.json({ success: true, message: 'Payment verified. Your print job is confirmed!' });
  } catch (err) {
    next(err);
  }
};

exports.webhook = async (req, res, next) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const body = JSON.stringify(req.body);

    const digest = crypto.createHmac('sha256', secret).update(body).digest('hex');
    if (digest !== signature) return res.status(400).send('Invalid webhook signature');

    const event = req.body.event;
    if (event === 'payment.captured') {
      const { order_id } = req.body.payload.payment.entity;
      await Payment.findOneAndUpdate({ razorpayOrderId: order_id }, { status: 'captured' });
    }

    res.json({ received: true });
  } catch (err) {
    next(err);
  }
};
