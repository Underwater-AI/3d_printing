import PriceTag from '../components/ui/PriceTag';

const materials = [
  { name: 'PLA Standard', rate: '₹2.00/g', min: '₹50', use: 'Prototypes, decor, general purpose' },
  { name: 'PLA+ Premium', rate: '₹2.50/g', min: '₹60', use: 'Stronger functional parts' },
  { name: 'PETG', rate: '₹3.00/g', min: '₹70', use: 'Mechanical parts, food contact' },
  { name: 'ABS / ASA', rate: '₹3.50/g', min: '₹80', use: 'Outdoor, engineering parts' },
  { name: 'TPU 95A', rate: '₹4.00/g', min: '₹80', use: 'Flexible, wearables, gaskets' },
  { name: 'PA-CF (Nylon CF)', rate: '₹8.00/g', min: '₹150', use: 'High-strength, aerospace' },
  { name: 'Multicolor (AMS)', rate: '+₹50 flat', min: '—', use: 'Add to any material' },
];

const fees = [
  { label: 'Setup Fee', value: '₹50 per order' },
  { label: 'Courier — West Bengal', value: '₹80' },
  { label: 'Courier — Metro India', value: '₹120' },
  { label: 'Courier — Remote', value: '₹200' },
  { label: 'Rush Processing (<24h)', value: '+₹100' },
  { label: 'GST', value: '18% on all orders' },
];

export default function Pricing() {
  return (
    <div style={{ paddingTop: '100px', maxWidth: '900px', margin: '0 auto', padding: '100px 24px 80px' }}>
      <div style={{ marginBottom: '48px' }}>
        <p style={{
          fontFamily: 'var(--font-label)',
          fontSize: '12px',
          color: 'var(--color-accent-sage)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '8px',
        }}>
          Transparent Pricing
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '36px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: '0 0 8px',
        }}>
          Material Pricing
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '15px',
          color: 'var(--color-text-secondary)',
          margin: 0,
        }}>
          All prices in INR. Final cost depends on model volume and weight.
        </p>
      </div>

      {/* Quick price cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '48px',
      }}>
        <PriceTag amount="2" label="PLA /g" size="sm" />
        <PriceTag amount="2.5" label="PLA+ /g" size="sm" />
        <PriceTag amount="3" label="PETG /g" size="sm" />
        <PriceTag amount="3.5" label="ABS /g" size="sm" />
        <PriceTag amount="4" label="TPU /g" size="sm" />
        <PriceTag amount="8" label="PA-CF /g" size="sm" accent />
      </div>

      {/* Full pricing table */}
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid rgba(143, 174, 126, 0.06)',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '48px',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(143, 174, 126, 0.08)' }}>
              {['Material', 'Price/gram', 'Min Charge', 'Use Case'].map((h) => (
                <th key={h} style={{
                  padding: '14px 20px',
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
            {materials.map(({ name, rate, min, use }) => (
              <tr key={name} style={{ borderBottom: '1px solid rgba(143, 174, 126, 0.04)' }}>
                <td style={{
                  padding: '14px 20px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--color-text-primary)',
                }}>
                  {name}
                </td>
                <td style={{
                  padding: '14px 20px',
                  fontFamily: 'var(--font-label)',
                  fontSize: '14px',
                  color: 'var(--color-accent-sage)',
                }}>
                  {rate}
                </td>
                <td style={{
                  padding: '14px 20px',
                  fontFamily: 'var(--font-label)',
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                }}>
                  {min}
                </td>
                <td style={{
                  padding: '14px 20px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                }}>
                  {use}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional fees */}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '22px',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        marginBottom: '20px',
      }}>
        Additional Fees
      </h2>
      <div style={{
        background: 'var(--color-bg-card)',
        border: '1px solid rgba(143, 174, 126, 0.06)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}>
        {fees.map(({ label, value }) => (
          <div key={label} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: '1px solid rgba(143, 174, 126, 0.04)',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: 'var(--color-text-secondary)',
            }}>
              {label}
            </span>
            <span style={{
              fontFamily: 'var(--font-label)',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
            }}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
