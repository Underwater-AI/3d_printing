const statusColors = {
  pending: { bg: 'rgba(255, 221, 0, 0.12)', color: 'var(--color-pending)', border: 'rgba(255, 221, 0, 0.25)' },
  confirmed: { bg: 'rgba(0, 212, 255, 0.12)', color: 'var(--color-accent-cyan)', border: 'rgba(0, 212, 255, 0.25)' },
  printing: { bg: 'rgba(255, 107, 53, 0.12)', color: 'var(--color-bambu-orange)', border: 'rgba(255, 107, 53, 0.25)' },
  quality_check: { bg: 'rgba(0, 102, 255, 0.12)', color: 'var(--color-accent-blue)', border: 'rgba(0, 102, 255, 0.25)' },
  ready: { bg: 'rgba(0, 255, 136, 0.12)', color: 'var(--color-success)', border: 'rgba(0, 255, 136, 0.25)' },
  dispatched: { bg: 'rgba(0, 212, 255, 0.12)', color: 'var(--color-accent-cyan)', border: 'rgba(0, 212, 255, 0.25)' },
  delivered: { bg: 'rgba(0, 255, 136, 0.12)', color: 'var(--color-success)', border: 'rgba(0, 255, 136, 0.25)' },
  cancelled: { bg: 'rgba(255, 51, 85, 0.12)', color: 'var(--color-error)', border: 'rgba(255, 51, 85, 0.25)' },
};

const labelMap = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  printing: 'Printing',
  quality_check: 'Quality Check',
  ready: 'Ready',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function Badge({ status, className = '' }) {
  const s = statusColors[status] || statusColors.pending;

  return (
    <span
      className={`badge ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 10px',
        fontSize: '11px',
        fontFamily: 'var(--font-label)',
        fontWeight: 500,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        borderRadius: '100px',
      }}
    >
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        background: s.color,
      }} />
      {labelMap[status] || status}
    </span>
  );
}
