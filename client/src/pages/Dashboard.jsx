import { useState, useEffect, useCallback } from 'react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const statusActions = {
  pending: [{ label: 'Approve', next: 'confirmed' }],
  confirmed: [{ label: 'Start Printing', next: 'printing' }],
  printing: [{ label: 'Quality Check', next: 'quality_check' }],
  quality_check: [{ label: 'Mark Ready', next: 'ready' }],
  ready: [{ label: 'Dispatch', next: 'dispatched' }, { label: 'Picked Up', next: 'delivered' }],
  dispatched: [{ label: 'Mark Delivered', next: 'delivered' }],
};

function authHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ ordersToday: 0, ordersWeek: 0, totalOrders: 0, revenueToday: 0, revenueMonth: 0 });
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, jobsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: authHeaders() }),
        fetch(`/api/admin/jobs?limit=50${statusFilter ? `&status=${statusFilter}` : ''}`, { headers: authHeaders() }),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (jobsRes.ok) {
        const jobsData = await jobsRes.json();
        setJobs(jobsData.jobs || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const updateStatus = async (jobId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}/status`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      // Update local state
      setJobs((prev) => prev.map((j) => j._id === jobId ? { ...j, status: newStatus } : j));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ paddingTop: '100px', maxWidth: '1200px', margin: '0 auto', padding: '100px 40px 80px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '0 0 8px',
        }}>
          Admin Dashboard
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--color-text-muted)',
        }}>
          Manage print jobs, materials, and orders
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {[
          { label: 'Orders Today', value: stats.ordersToday, accent: false },
          { label: 'This Week', value: stats.ordersWeek, accent: false },
          { label: 'Total Orders', value: stats.totalOrders, accent: false },
          { label: 'Revenue Today', value: `₹${(stats.revenueToday || 0).toLocaleString('en-IN')}`, accent: true },
          { label: 'Revenue This Month', value: `₹${(stats.revenueMonth || 0).toLocaleString('en-IN')}`, accent: true },
        ].map(({ label, value, accent }) => (
          <div key={label} style={{
            padding: '20px',
            background: accent ? 'rgba(143, 174, 126, 0.06)' : 'var(--color-bg-card)',
            border: accent ? '1px solid rgba(143, 174, 126, 0.15)' : '1px solid rgba(143, 174, 126, 0.06)',
            borderRadius: '10px',
          }}>
            <span style={{
              fontFamily: 'var(--font-label)',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              {label}
            </span>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 700,
              color: accent ? 'var(--color-accent-sage)' : 'var(--color-text-primary)',
              marginTop: '4px',
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Status filter */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {['', 'pending', 'confirmed', 'printing', 'quality_check', 'ready', 'dispatched', 'delivered'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '6px 14px',
              fontFamily: 'var(--font-label)',
              fontSize: '12px',
              color: statusFilter === s ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
              background: statusFilter === s ? 'var(--color-accent-sage)' : 'var(--color-bg-elevated)',
              border: statusFilter === s ? 'none' : '1px solid rgba(143, 174, 126, 0.1)',
              borderRadius: '100px',
              cursor: 'pointer',
            }}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Jobs table */}
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid rgba(143, 174, 126, 0.06)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(143, 174, 126, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            color: 'var(--color-text-primary)',
            margin: 0,
          }}>
            Print Jobs Queue
          </h2>
          <button onClick={fetchData} style={{
            padding: '4px 12px',
            fontFamily: 'var(--font-label)',
            fontSize: '11px',
            color: 'var(--color-accent-sage)',
            background: 'transparent',
            border: '1px solid rgba(143, 174, 126, 0.2)',
            borderRadius: '4px',
            cursor: 'pointer',
          }}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-muted)' }}>Loading...</span>
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-muted)' }}>No jobs found</span>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(143, 174, 126, 0.08)' }}>
                  {['Customer', 'File', 'Material', 'Status', 'Total', 'Date', 'Actions'].map((h) => (
                    <th key={h} style={{
                      padding: '12px 20px',
                      textAlign: 'left',
                      fontFamily: 'var(--font-label)',
                      fontSize: '11px',
                      fontWeight: 500,
                      color: 'var(--color-text-muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      whiteSpace: 'nowrap',
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id} style={{ borderBottom: '1px solid rgba(143, 174, 126, 0.04)' }}>
                    <td style={{ padding: '12px 20px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>
                      {job.customerName}
                    </td>
                    <td style={{ padding: '12px 20px', fontFamily: 'var(--font-label)', fontSize: '13px', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                      {job.originalName}
                    </td>
                    <td style={{ padding: '12px 20px', fontFamily: 'var(--font-label)', fontSize: '13px', color: 'var(--color-accent-sage)', whiteSpace: 'nowrap' }}>
                      {job.material} {job.color}
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <Badge status={job.status} />
                    </td>
                    <td style={{ padding: '12px 20px', fontFamily: 'var(--font-label)', fontSize: '14px', color: 'var(--color-text-primary)', whiteSpace: 'nowrap' }}>
                      ₹{(job.totalCost || 0).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 20px', fontFamily: 'var(--font-label)', fontSize: '12px', color: 'var(--color-text-muted)', whiteSpace: 'nowrap' }}>
                      {new Date(job.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '12px 20px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => setSelectedJob(job)}
                        style={{
                          padding: '4px 10px',
                          fontFamily: 'var(--font-label)',
                          fontSize: '11px',
                          color: 'var(--color-text-secondary)',
                          background: 'var(--color-bg-elevated)',
                          border: '1px solid rgba(143, 174, 126, 0.1)',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                      >
                        View
                      </button>
                      {statusActions[job.status]?.map(({ label, next }) => (
                        <button
                          key={label}
                          onClick={() => updateStatus(job._id, next)}
                          style={{
                            padding: '4px 10px',
                            fontFamily: 'var(--font-label)',
                            fontSize: '11px',
                            fontWeight: 500,
                            color: 'var(--color-text-inverse)',
                            background: 'var(--color-accent-sage)',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Job detail modal */}
      <Modal
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        title={`Job Details — ${selectedJob?.originalName}`}
      >
        {selectedJob && (
          <div>
            {[
              ['Customer', selectedJob.customerName],
              ['Email', selectedJob.customerEmail],
              ['Phone', selectedJob.customerPhone],
              ['File', selectedJob.originalName],
              ['Material', selectedJob.material],
              ['Color', selectedJob.color],
              ['Layer Height', `${selectedJob.layerHeight}mm`],
              ['Infill', `${selectedJob.infill}%`],
              ['Quantity', selectedJob.quantity],
              ['Delivery', selectedJob.deliveryMethod === 'pickup' ? 'Self Pickup' : 'Courier'],
              ['Status', selectedJob.status],
              ['Material Cost', `₹${selectedJob.materialCost}`],
              ['Setup Fee', `₹${selectedJob.setupFee}`],
              ['Delivery', `₹${selectedJob.deliveryCost}`],
              ['GST', `₹${selectedJob.gst}`],
              ['Total', `₹${selectedJob.totalCost?.toLocaleString('en-IN')}`],
              ['Created', new Date(selectedJob.createdAt).toLocaleString()],
            ].map(([label, value]) => (
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
          </div>
        )}
      </Modal>
    </div>
  );
}
