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

// Mock order data
const mockOrder = {
  _id: 'UAI-2025-00042',
  status: 'printing',
  customerName: 'Shuvam Banerji Seal',
  material: 'PLA+ White',
  layerHeight: 0.20,
  infill: 20,
  quantity: 2,
  totalCost: 850,
  createdAt: '2025-05-12T09:04:00Z',
  timeline: [
    { status: 'pending', time: 'May 12, 2:34 PM' },
    { status: 'confirmed', time: 'May 12, 2:35 PM' },
    { status: 'printing', time: 'May 12, 3:10 PM' },
  ],
};

export default function Track() {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    // Mock: show order if ID contains "42" or email is provided
    if (orderId.includes('42') || email) {
      setOrder(mockOrder);
    } else {
      setOrder(null);
    }
  };

  const currentIdx = order ? statusSteps.indexOf(order.status) : -1;

  return (
    <div style={{ paddingTop: '100px', maxWidth: '700px', margin: '0 auto', padding: '100px 24px 80px' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{
          fontFamily: 'var(--font-label)',
          fontSize: '12px',
          color: 'var(--color-accent-cyan)',
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
        border: '1px solid rgba(0, 212, 255, 0.08)',
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
              placeholder="UAI-2025-XXXXX"
              style={{
                width: '100%',
                padding: '10px 14px',
                background: 'var(--color-bg-elevated)',
                border: '1px solid rgba(0, 212, 255, 0.1)',
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
              Email
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
                border: '1px solid rgba(0, 212, 255, 0.1)',
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
        <button type="submit" style={{
          padding: '10px 24px',
          fontFamily: 'var(--font-label)',
          fontSize: '13px',
          fontWeight: 500,
          color: '#000814',
          background: 'var(--color-accent-cyan)',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}>
          Track Order
        </button>
      </form>

      {/* Results */}
      {searched && !order && (
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid rgba(0, 212, 255, 0.08)',
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
          border: '1px solid rgba(0, 212, 255, 0.08)',
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
                Order #{order._id}
              </h2>
              <p style={{
                fontFamily: 'var(--font-label)',
                fontSize: '13px',
                color: 'var(--color-text-muted)',
              }}>
                {order.material} · {order.layerHeight}mm · {order.infill}% infill × {order.quantity}
              </p>
            </div>
            <Badge status={order.status} />
          </div>

          {/* Timeline */}
          <div style={{ marginBottom: '24px' }}>
            {statusSteps.map((step, i) => {
              const completed = i <= currentIdx;
              const isCurrent = i === currentIdx;
              const timelineEntry = order.timeline.find((t) => t.status === step);

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
                      background: completed ? 'var(--color-accent-cyan)' : 'rgba(0, 212, 255, 0.1)',
                    }} />
                  )}
                  {/* Dot */}
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    background: completed ? 'var(--color-accent-cyan)' : 'var(--color-bg-elevated)',
                    border: completed ? 'none' : '2px solid rgba(0, 212, 255, 0.15)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}>
                    {completed && i < currentIdx && (
                      <span style={{ fontSize: '10px', color: '#000814' }}>✓</span>
                    )}
                    {isCurrent && (
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#000814',
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
                    {timelineEntry && (
                      <span style={{
                        fontFamily: 'var(--font-label)',
                        fontSize: '12px',
                        color: 'var(--color-text-muted)',
                        marginLeft: '12px',
                      }}>
                        {timelineEntry.time}
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
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--color-accent-cyan)' }}>
              ₹{order.totalCost}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
