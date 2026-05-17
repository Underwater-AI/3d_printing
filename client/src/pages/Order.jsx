import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import PrintJobForm from '../components/forms/PrintJobForm';

export default function Order() {
  const navigate = useNavigate();
  const [job, setJob] = useState(null);

  const handleSubmit = (data) => {
    setJob(data);
    toast.success('Print job submitted successfully!');
    // In production, this would initiate Razorpay payment
    // For now, show confirmation
  };

  return (
    <div style={{ paddingTop: '100px', maxWidth: '800px', margin: '0 auto', padding: '100px 24px 80px' }}>
      <div style={{ marginBottom: '40px' }}>
        <p style={{
          fontFamily: 'var(--font-label)',
          fontSize: '12px',
          color: 'var(--color-accent-cyan)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          3D Print Service
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '0 0 8px',
        }}>
          Submit Print Job
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'var(--color-text-secondary)',
          margin: 0,
        }}>
          Upload your 3D model, choose materials, and get a quote in minutes.
        </p>
      </div>

      {job ? (
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            color: 'var(--color-text-primary)',
            marginBottom: '8px',
          }}>
            Job Submitted!
          </h2>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'var(--color-text-secondary)',
            marginBottom: '24px',
          }}>
            Your print job has been created. You'll receive a confirmation email shortly.
          </p>
          <p style={{
            fontFamily: 'var(--font-label)',
            fontSize: '14px',
            color: 'var(--color-accent-cyan)',
            marginBottom: '24px',
          }}>
            Order ID: UAI-{job._id?.slice(-6).toUpperCase() || 'XXXXXX'}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/track')}
              style={{
                padding: '10px 20px',
                fontFamily: 'var(--font-label)',
                fontSize: '13px',
                fontWeight: 500,
                color: '#000814',
                background: 'var(--color-accent-cyan)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Track Order
            </button>
            <button
              onClick={() => { setJob(null); }}
              style={{
                padding: '10px 20px',
                fontFamily: 'var(--font-label)',
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-accent-cyan)',
                background: 'transparent',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              Submit Another
            </button>
          </div>
        </div>
      ) : (
        <div style={{
          background: 'var(--color-bg-card)',
          border: '1px solid rgba(0, 212, 255, 0.08)',
          borderRadius: '12px',
          padding: '32px',
        }}>
          <PrintJobForm onSubmit={handleSubmit} />
        </div>
      )}
    </div>
  );
}
