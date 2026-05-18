import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import FileUpload from './FileUpload';
import MaterialSelector from './MaterialSelector';
import Button from '../ui/Button';
import PriceTag from '../ui/PriceTag';
import { initiatePayment } from '../../lib/razorpay';

const steps = ['Upload File', 'Print Settings', 'Delivery', 'Review & Pay'];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--color-bg-elevated)',
  border: '1px solid rgba(143, 174, 126, 0.1)',
  borderRadius: '6px',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.15s ease',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-label)',
  fontSize: '12px',
  fontWeight: 500,
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '6px',
};

export default function PrintJobForm({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    file: null,
    material: 'PLA',
    color: 'White',
    layerHeight: 0.20,
    infill: 20,
    supports: false,
    brim: false,
    multicolor: false,
    quantity: 1,
    deliveryMethod: 'pickup',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'West Bengal',
    pincode: '',
    specialInstructions: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [estimate, setEstimate] = useState(null);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (step !== 3) return;
    const token = localStorage.getItem('token');
    fetch('/api/jobs/estimate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        material: form.material,
        quantity: form.quantity,
        deliveryMethod: form.deliveryMethod,
        multicolor: form.multicolor,
        state: form.state,
        city: form.city,
      }),
    })
      .then((r) => r.json())
      .then(setEstimate)
      .catch(() => setEstimate(null));
  }, [step, form.material, form.quantity, form.deliveryMethod, form.multicolor, form.state, form.city]);

  const canProceed = () => {
    if (step === 0) return form.file && !form.file.error;
    if (step === 2) {
      if (!form.name || !form.email || !form.phone) return false;
      if (form.deliveryMethod === 'courier' && (!form.address || !form.city || !form.pincode)) return false;
      return true;
    }
    return true;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fileId: form.file.fileId,
          originalName: form.file.originalName,
          fileSize: form.file.size,
          material: form.material,
          color: form.color,
          layerHeight: form.layerHeight,
          infill: form.infill,
          supports: form.supports,
          brim: form.brim,
          multicolor: form.multicolor,
          quantity: form.quantity,
          deliveryMethod: form.deliveryMethod,
          customerName: form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
          specialInstructions: form.specialInstructions,
        }),
      });

      if (!res.ok) throw new Error('Failed to create job');
      const { job } = await res.json();

      // Create Razorpay order
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId: job._id }),
      });

      if (!orderRes.ok) throw new Error('Failed to create payment order');
      const orderData = await orderRes.json();

      // Open Razorpay checkout
      initiatePayment({
        orderId: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: orderData.keyId,
        jobId: job._id,
        customer: { name: form.name, email: form.email, phone: form.phone },
        onSuccess: () => {
          toast.success('Payment successful! Print job confirmed.');
          onSubmit(job);
        },
        onError: (err) => {
          toast.error(err || 'Payment failed');
          setSubmitting(false);
        },
      });
    } catch (err) {
      toast.error(err.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="print-job-form">
      {/* Step indicator */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '32px',
      }}>
        {steps.map((s, i) => (
          <div key={s} style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-label)',
              fontSize: '12px',
              fontWeight: 500,
              background: i <= step ? 'var(--color-accent-sage)' : 'var(--color-bg-elevated)',
              color: i <= step ? '#000814' : 'var(--color-text-muted)',
              border: i <= step ? 'none' : '1px solid rgba(143, 174, 126, 0.1)',
              flexShrink: 0,
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <span style={{
              fontFamily: 'var(--font-label)',
              fontSize: '12px',
              color: i <= step ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              display: i === step ? 'block' : 'none',
            }}>
              {s}
            </span>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1,
                height: '1px',
                background: i < step ? 'var(--color-accent-sage)' : 'rgba(143, 174, 126, 0.1)',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          {step === 0 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
                Upload Your 3D File
              </h3>
              <FileUpload
                onFileSelect={(f) => update('file', f)}
                selectedFile={form.file}
              />
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
                Print Settings
              </h3>
              <MaterialSelector
                selected={form.material}
                onSelect={(m) => update('material', m)}
                color={form.color}
                onColorChange={(c) => update('color', c)}
              />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
                <div>
                  <label style={labelStyle}>Layer Height</label>
                  <select
                    value={form.layerHeight}
                    onChange={(e) => update('layerHeight', parseFloat(e.target.value))}
                    style={inputStyle}
                  >
                    <option value={0.10}>0.10mm — Ultra fine</option>
                    <option value={0.20}>0.20mm — Standard (recommended)</option>
                    <option value={0.28}>0.28mm — Draft</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Infill Density: {form.infill}%</label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={form.infill}
                    onChange={(e) => update('infill', parseInt(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-accent-sage)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                {[
                  { key: 'supports', label: 'Supports' },
                  { key: 'brim', label: 'Brim' },
                  { key: 'multicolor', label: 'Multicolor (AMS)' },
                ].map(({ key, label }) => (
                  <label key={key} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    background: form[key] ? 'rgba(143, 174, 126, 0.08)' : 'var(--color-bg-elevated)',
                    border: form[key] ? '1px solid rgba(143, 174, 126, 0.3)' : '1px solid rgba(143, 174, 126, 0.06)',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-label)',
                    fontSize: '13px',
                    color: form[key] ? 'var(--color-accent-sage)' : 'var(--color-text-secondary)',
                  }}>
                    <input
                      type="checkbox"
                      checked={form[key]}
                      onChange={(e) => update(key, e.target.checked)}
                      style={{ accentColor: 'var(--color-accent-sage)' }}
                    />
                    {label}
                  </label>
                ))}
              </div>

              <div style={{ marginTop: '16px', maxWidth: '200px' }}>
                <label style={labelStyle}>Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={form.quantity}
                  onChange={(e) => update('quantity', Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                  style={inputStyle}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-text-primary)', marginBottom: '16px' }}>
                Delivery Details
              </h3>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                {[
                  { id: 'pickup', label: 'Self Pickup', desc: 'Free — IISER Kolkata Campus' },
                  { id: 'courier', label: 'Courier', desc: '₹80–₹200 depending on city' },
                ].map(({ id, label, desc }) => (
                  <button
                    key={id}
                    onClick={() => update('deliveryMethod', id)}
                    style={{
                      flex: 1,
                      padding: '16px',
                      background: form.deliveryMethod === id ? 'rgba(143, 174, 126, 0.08)' : 'var(--color-bg-elevated)',
                      border: form.deliveryMethod === id ? '1px solid rgba(143, 174, 126, 0.3)' : '1px solid rgba(143, 174, 126, 0.06)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: form.deliveryMethod === id ? 'var(--color-accent-sage)' : 'var(--color-text-primary)',
                      display: 'block',
                    }}>{label}</span>
                    <span style={{
                      fontFamily: 'var(--font-label)',
                      fontSize: '12px',
                      color: 'var(--color-text-muted)',
                    }}>{desc}</span>
                  </button>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input type="text" value={form.name} onChange={(e) => update('name', e.target.value)} style={inputStyle} placeholder="Your name" />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} style={inputStyle} placeholder="you@email.com" />
                </div>
                <div>
                  <label style={labelStyle}>Phone *</label>
                  <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} style={inputStyle} placeholder="+91 XXXXXXXXXX" />
                </div>
                {form.deliveryMethod === 'courier' && (
                  <>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>Address *</label>
                      <textarea value={form.address} onChange={(e) => update('address', e.target.value)} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Street address" />
                    </div>
                    <div>
                      <label style={labelStyle}>City *</label>
                      <input type="text" value={form.city} onChange={(e) => update('city', e.target.value)} style={inputStyle} placeholder="City" />
                    </div>
                    <div>
                      <label style={labelStyle}>PIN Code *</label>
                      <input type="text" value={form.pincode} onChange={(e) => update('pincode', e.target.value)} style={inputStyle} placeholder="000000" />
                    </div>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={labelStyle}>State</label>
                      <select value={form.state} onChange={(e) => update('state', e.target.value)} style={inputStyle}>
                        {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={labelStyle}>Special Instructions</label>
                <textarea
                  value={form.specialInstructions}
                  onChange={(e) => update('specialInstructions', e.target.value)}
                  style={{ ...inputStyle, minHeight: '60px', resize: 'vertical' }}
                  placeholder="Any special requirements..."
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-text-primary)', marginBottom: '24px' }}>
                Review Your Order
              </h3>

              <div style={{
                background: 'var(--color-bg-elevated)',
                border: '1px solid rgba(143, 174, 126, 0.08)',
                borderRadius: '12px',
                padding: '24px',
              }}>
                {[
                  { label: 'File', value: form.file?.originalName || '—' },
                  { label: 'Material', value: `${form.material}${form.multicolor ? ' + Multicolor' : ''}` },
                  { label: 'Color', value: form.color },
                  { label: 'Layer Height', value: `${form.layerHeight}mm` },
                  { label: 'Infill', value: `${form.infill}%` },
                  { label: 'Supports', value: form.supports ? 'Yes' : 'No' },
                  { label: 'Brim', value: form.brim ? 'Yes' : 'No' },
                  { label: 'Quantity', value: form.quantity },
                  { label: 'Delivery', value: form.deliveryMethod === 'pickup' ? 'Self Pickup — IISER Kolkata' : 'Courier' },
                ].map(({ label, value }) => (
                  <div key={label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(143, 174, 126, 0.04)',
                  }}>
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: '13px', color: 'var(--color-text-muted)' }}>{label}</span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-primary)' }}>{value}</span>
                  </div>
                ))}

                {estimate && (
                  <>
                    {[
                      { label: 'Material Cost', value: `₹${estimate.materialCost?.toLocaleString('en-IN')}` },
                      { label: 'Setup Fee', value: `₹${estimate.setupFee}` },
                      ...(estimate.multicolorFee ? [{ label: 'Multicolor (AMS)', value: `₹${estimate.multicolorFee}` }] : []),
                      { label: 'Delivery', value: estimate.deliveryCost === 0 ? 'Free' : `₹${estimate.deliveryCost}` },
                      { label: 'GST (18%)', value: `₹${estimate.gst?.toLocaleString('en-IN')}` },
                    ].map(({ label, value }) => (
                      <div key={label} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '6px 0',
                      }}>
                        <span style={{ fontFamily: 'var(--font-label)', fontSize: '13px', color: 'var(--color-text-muted)' }}>{label}</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-secondary)' }}>{value}</span>
                      </div>
                    ))}
                  </>
                )}

                <div style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(143, 174, 126, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--color-text-primary)' }}>
                    Total (incl. GST)
                  </span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--color-accent-sage)' }}>
                    {estimate ? `₹${estimate.totalCost?.toLocaleString('en-IN')}` : 'Loading...'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '32px',
        paddingTop: '24px',
        borderTop: '1px solid rgba(143, 174, 126, 0.06)',
      }}>
        <Button
          variant="ghost"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          ← Back
        </Button>

        {step < steps.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
          >
            Continue →
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            loading={submitting}
          >
            Submit & Pay →
          </Button>
        )}
      </div>
    </div>
  );
}
