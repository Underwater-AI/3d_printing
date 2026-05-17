import { useState, useEffect } from 'react';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const mockJobs = [
  { _id: '1', customerName: 'Rahul Verma', material: 'PLA+', color: 'White', status: 'pending', totalCost: 380, createdAt: '2025-05-17T10:30:00Z', originalName: 'gear-assembly.stl' },
  { _id: '2', customerName: 'Priya Das', material: 'PETG', color: 'Black', status: 'printing', totalCost: 620, createdAt: '2025-05-16T14:00:00Z', originalName: 'phone-case.stl' },
  { _id: '3', customerName: 'Amit Kumar', material: 'PLA', color: 'Blue', status: 'confirmed', totalCost: 250, createdAt: '2025-05-16T09:15:00Z', originalName: 'vase-spiral.stl' },
  { _id: '4', customerName: 'Sneha Roy', material: 'ABS', color: 'Grey', status: 'ready', totalCost: 890, createdAt: '2025-05-15T16:45:00Z', originalName: 'drone-mount.stl' },
];

const statusActions = {
  pending: [{ label: 'Approve', next: 'confirmed' }],
  confirmed: [{ label: 'Start Printing', next: 'printing' }],
  printing: [{ label: 'Quality Check', next: 'quality_check' }],
  quality_check: [{ label: 'Mark Ready', next: 'ready' }],
  ready: [{ label: 'Dispatch', next: 'dispatched' }, { label: 'Picked Up', next: 'delivered' }],
  dispatched: [{ label: 'Mark Delivered', next: 'delivered' }],
};

export default function Dashboard() {
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedJob, setSelectedJob] = useState(null);

  const updateStatus = (jobId, newStatus) => {
    setJobs((prev) => prev.map((j) => j._id === jobId ? { ...j, status: newStatus } : j));
  };

  const stats = {
    today: jobs.filter((j) => new Date(j.createdAt).toDateString() === new Date().toDateString()).length,
    printing: jobs.filter((j) => j.status === 'printing').length,
    pending: jobs.filter((j) => j.status === 'pending').length,
    revenue: jobs.reduce((sum, j) => sum + j.totalCost, 0),
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
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '32px',
      }}>
        {[
          { label: 'Orders Today', value: stats.today, accent: false },
          { label: 'Currently Printing', value: stats.printing, accent: true },
          { label: 'Pending Approval', value: stats.pending, accent: false },
          { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString('en-IN')}`, accent: true },
        ].map(({ label, value, accent }) => (
          <div key={label} style={{
            padding: '20px',
            background: accent ? 'rgba(0, 212, 255, 0.06)' : 'var(--color-bg-card)',
            border: accent ? '1px solid rgba(0, 212, 255, 0.15)' : '1px solid rgba(0, 212, 255, 0.06)',
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
              color: accent ? 'var(--color-accent-cyan)' : 'var(--color-text-primary)',
              marginTop: '4px',
            }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Jobs table */}
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid rgba(0, 212, 255, 0.06)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(0, 212, 255, 0.08)',
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
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0, 212, 255, 0.08)' }}>
              {['Customer', 'File', 'Material', 'Status', 'Total', 'Actions'].map((h) => (
                <th key={h} style={{
                  padding: '12px 20px',
                  textAlign: 'left',
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id} style={{ borderBottom: '1px solid rgba(0, 212, 255, 0.04)' }}>
                <td style={{ padding: '12px 20px', fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-text-primary)' }}>
                  {job.customerName}
                </td>
                <td style={{ padding: '12px 20px', fontFamily: 'var(--font-label)', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                  {job.originalName}
                </td>
                <td style={{ padding: '12px 20px', fontFamily: 'var(--font-label)', fontSize: '13px', color: 'var(--color-accent-cyan)' }}>
                  {job.material} {job.color}
                </td>
                <td style={{ padding: '12px 20px' }}>
                  <Badge status={job.status} />
                </td>
                <td style={{ padding: '12px 20px', fontFamily: 'var(--font-label)', fontSize: '14px', color: 'var(--color-text-primary)' }}>
                  ₹{job.totalCost}
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
                      border: '1px solid rgba(0, 212, 255, 0.1)',
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
                        color: '#000814',
                        background: 'var(--color-accent-cyan)',
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
              ['File', selectedJob.originalName],
              ['Material', selectedJob.material],
              ['Color', selectedJob.color],
              ['Status', selectedJob.status],
              ['Total', `₹${selectedJob.totalCost}`],
              ['Created', new Date(selectedJob.createdAt).toLocaleString()],
            ].map(([label, value]) => (
              <div key={label} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                borderBottom: '1px solid rgba(0, 212, 255, 0.04)',
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
