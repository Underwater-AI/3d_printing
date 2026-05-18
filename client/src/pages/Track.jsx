import { useState } from 'react';
import Badge from '../components/ui/Badge';

const statusSteps = [
  'pending', 'confirmed', 'printing', 'quality_check', 'ready', 'dispatched', 'delivered',
];

const statusLabels = {
  pending: 'Order Received',
  confirmed: 'Payment Confirmed',
  printing: 'Printing In Progress',
  quality_check: 'Quality Check',
  ready: 'Ready for Pickup',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
};

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) + ', ' +
    d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
}

export default function Track() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;
    setSearched(true);
    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const params = new URLSearchParams();
      if (email.trim()) params.set('email', email.trim());
      const res = await fetch(`/api/jobs/track/${orderId.trim()}?${params}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Order not found');
      }
      const data = await res.json();
      setOrder(data.job);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Build timeline from status history
  const buildTimeline = (job) => {
    const timeline = [];
    const statusOrder = ['pending', 'confirmed', 'printing', 'quality_check', 'ready', 'dispatched', 'delivered'];
    const idx = statusOrder.indexOf(job.status);

    for (let i = 0; i <= idx; i++) {
      const s = statusOrder[i];
      let time = null;
      if (s === 'pending') time = job.createdAt;
      else if (s === 'confirmed' && job.paidAt) time = job.paidAt;
      else if (s === 'printing' && job.printedAt) time = job.printedAt;
      else if (s === 'delivered' && job.deliveredAt) time = job.deliveredAt;
      timeline.push({ status: s, time: formatDate(time) });
    }
    return timeline;
  };

  const currentIdx = order ? statusSteps.indexOf(order.status) : -1;
  const timeline = order ? buildTimeline(order) : [];

  return (
    <div style={{ paddingTop: '100px', maxWidth: '700px', margin: '0 auto', padding: '100px 24px 80px' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{
          fontFamily: 'var(--font-label)',
          fontSize: '12px',
          color: 'var(--color-accent-sage)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Order Tracking
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '0 0 8px',
        }}>
          Track Your Print
        </h1>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} style={{
        background: 'var(--color-bg-card)',
        border: '1px solid rgba(143, 174, 126, 0.08)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-label)',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px',
            }}>
              Order ID
            </label>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Paste your Order ID"
              required
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--color-bg-elevated)',
                border: '1px solid rgba(143, 174, 126, 0.1)',
                borderRadius: '6px',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-label)',
              fontSize: '12px',
              fontWeight: 500,
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px',
            }}>
              Email (optional verification)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--color-bg-elevated)',
                border: '1px solid rgba(143, 174, 126, 0.1)',
                borderRadius: '6px',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
        </div>
        <button type="submit" disabled={loading} style={{
          padding: '10px 24px',
          fontFamily: 'var(--font-label)',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--color-text-inverse)',
          background: loading ? 'rgba(143, 174, 126, 0.5)' : 'var(--color-accent-sage)',
          border: 'none',
          borderRadius: '6px',
          cursor: loading ? 'wait' : 'pointer',
        }}>
          {loading ? 'Searching...' : 'Track Order'}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid rgba(255, 51, 85, 0.2)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-error)' }}>
            {error}
          </p>
        </div>
      )}

      {/* No results */}
      {searched && !order && !loading && !error && (
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid rgba(143, 174, 126, 0.08)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'var(--color-text-muted)' }}>
            No order found. Check your Order ID and try again.
          </p>
        </div>
      )}

      {order && (
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid rgba(143, 174, 126, 0.08)',
          borderRadius: '12px',
          padding: '32px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '20px',
                color: 'var(--color-text-primary)',
                margin: '0 0 4px',
              }}>
                Order #UAI-{order._id.slice(-6).toUpperCase()}
              </h2>
              <p style={{
                fontFamily: 'var(--font-label)',
                fontSize: '13px',
                color: 'var(--color-text-muted)',
              }}>
                {order.material} · {order.layerHeight}mm · {order.infill}% infill x{order.quantity}
              </p>
            </div>
            <Badge status={order.status} />
          </div>

          {/* Timeline */}
          <div style={{ marginBottom: '24px' }}>
            {statusSteps.map((step, i) => {
              const completed = i <= currentIdx;
              const isCurrent = i === currentIdx;
              const entry = timeline.find((t) => t.status === step);

              return (
                <div key={step} style={{
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start',
                  paddingBottom: i < statusSteps.length - 1 ? '16px' : 0,
                  position: 'relative',
                }}>
                  {/* Line */}
                  {i < statusSteps.length - 1 && (
                    <div style={{
                      position: 'absolute',
                      left: '8px',
                      top: '20px',
                      width: '2px',
                      height: 'calc(100% - 4px)',
                      background: completed ? 'var(--color-accent-sage)' : 'rgba(143, 174, 126, 0.1)',
                    }} />
                  )}
                  {/* Dot */}
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: completed ? 'var(--color-accent-sage)' : 'var(--color-bg-elevated)',
                    border: completed ? 'none' : '2px solid rgba(143, 174, 126, 0.15)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}>
                    {completed && i < currentIdx && (
                      <span style={{ fontSize: '10px', color: 'var(--color-text-inverse)' }}>&#10003;</span>
                    )}
                    {isCurrent && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'var(--color-text-inverse)',
                      }} />
                    )}
                  </div>
                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      fontWeight: isCurrent ? 600 : 400,
                      color: completed ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                    }}>
                      {statusLabels[step]}
                    </span>
                    {entry?.time && (
                      <span style={{
                        fontFamily: 'var(--font-label)',
                        fontSize: '12px',
                        color: 'var(--color-text-muted)',
                        marginLeft: '12px',
                      }}>
                        {entry.time}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            padding: '16px',
            background: 'var(--color-bg-elevated)',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <span style={{ fontFamily: 'var(--font-label)', fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Total Paid
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--color-accent-sage)' }}>
              {order.totalCost ? `₹${order.totalCost.toLocaleString('en-IN')}` : '—'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
