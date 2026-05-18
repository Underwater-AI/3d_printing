export default function PriceTag({ amount, label, size = 'md', accent = false }) {
  const sizes = {
    sm: { value: '16px', label: '11px', padding: '8px 12px' },
    md: { value: '24px', label: '12px', padding: '12px 16px' },
    lg: { value: '36px', label: '13px', padding: '16px 24px' },
    xl: { value: '48px', label: '14px', padding: '20px 32px' },
  };
  const s = sizes[size];

  return (
    <div style={{
      display: 'inline-flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: s.padding,
      background: accent ? 'rgba(143, 174, 126, 0.08)' : 'var(--color-bg-elevated)',
      border: accent ? '1px solid rgba(143, 174, 126, 0.2)' : '1px solid rgba(143, 174, 126, 0.06)',
      borderRadius: '8px',
    }}>
      {label && (
        <span style={{
          fontFamily: 'var(--font-label)',
          fontSize: s.label,
          fontWeight: 500,
          color: 'var(--color-text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {label}
        </span>
      )}
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: s.value,
        fontWeight: 700,
        color: accent ? 'var(--color-accent-sage)' : 'var(--color-text-primary)',
        lineHeight: 1,
      }}>
        ₹{typeof amount === 'number' ? amount.toLocaleString('en-IN') : amount}
      </span>
    </div>
  );
}
