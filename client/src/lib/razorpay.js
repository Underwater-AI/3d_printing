let loaded = false;

export function loadRazorpay() {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      loaded = true;
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => { loaded = true; resolve(true); };
    script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
    document.body.appendChild(script);
  });
}

export async function initiatePayment({
  orderId,
  amount,
  currency = 'INR',
  keyId,
  jobId,
  customer,
  onSuccess,
  onError,
}) {
  try {
    await loadRazorpay();
  } catch (err) {
    onError(err.message);
    return;
  }

  const options = {
    key: keyId,
    amount,
    currency,
    name: 'Underwater AI',
    description: '3D Printing Service',
    image: '/assets/ui/logo.png',
    order_id: orderId,
    handler: async (response) => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ ...response, jobId }),
        });
        const data = await res.json();
        if (data.success) onSuccess(data);
        else onError(data.error || 'Payment verification failed');
      } catch (err) {
        onError(err.message);
      }
    },
    prefill: {
      name: customer.name || '',
      email: customer.email || '',
      contact: customer.phone || '',
    },
    notes: { jobId },
    theme: { color: '#00d4ff' },
    modal: {
      ondismiss: () => onError('Payment cancelled'),
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
}
