import { motion } from 'framer-motion';

const variants = {
  primary: {
    background: 'var(--color-accent-sage)',
    color: 'var(--color-text-inverse)',
    hoverBg: '#8fae7e',
    hoverShadow: '0 0 24px rgba(143, 174, 126, 0.35)',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--color-accent-sage)',
    hoverBg: 'rgba(143, 174, 126, 0.08)',
    hoverShadow: 'none',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--color-text-secondary)',
    hoverBg: 'rgba(255, 255, 255, 0.04)',
    hoverShadow: 'none',
  },
  danger: {
    background: 'var(--color-error)',
    color: '#fff',
    hoverBg: '#ff4466',
    hoverShadow: '0 0 24px rgba(255, 51, 85, 0.3)',
  },
};

const sizes = {
  sm: { padding: '6px 14px', fontSize: '12px' },
  md: { padding: '10px 20px', fontSize: '13px' },
  lg: { padding: '14px 28px', fontSize: '15px' },
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const v = variants[variant];
  const s = sizes[size];

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`btn ${className}`}
      whileHover={!disabled ? { scale: 1.02 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: s.padding,
        fontSize: s.fontSize,
        fontFamily: 'var(--font-label)',
        fontWeight: 500,
        letterSpacing: '0.02em',
        background: v.background,
        color: v.color,
        border: variant === 'secondary' ? '1px solid rgba(143, 174, 126, 0.3)' : 'none',
        borderRadius: '6px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.15s ease',
        ...props.style,
      }}
      {...props}
    >
      {loading && <span className="btn-spinner" />}
      {children}
      <style>{`
        .btn:hover:not(:disabled) {
          background: ${v.hoverBg} !important;
          box-shadow: ${v.hoverShadow};
        }
        .btn-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </motion.button>
  );
}
