export default function Privacy() {
  return (
    <div style={{ paddingTop: '100px', maxWidth: '700px', margin: '0 auto', padding: '100px 24px 80px' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '32px',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        marginBottom: '24px',
      }}>
        Privacy Policy
      </h1>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '15px',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.8,
      }}>
        <p><em>Last updated: May 2025</em></p>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-text-primary)', marginTop: '32px' }}>
          Data We Collect
        </h2>
        <p>We collect only the minimum data necessary to process your 3D print orders:</p>
        <ul>
          <li>Name, email, phone number (for order communication)</li>
          <li>Delivery address (if courier selected)</li>
          <li>3D model files (STL/3MF/OBJ/STEP — deleted after 30 days)</li>
          <li>Payment transaction IDs (processed by Razorpay, we never store card details)</li>
        </ul>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-text-primary)', marginTop: '32px' }}>
          How We Use Your Data
        </h2>
        <ul>
          <li>Process and fulfill your print orders</li>
          <li>Send order status updates via email</li>
          <li>Improve our service quality</li>
        </ul>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-text-primary)', marginTop: '32px' }}>
          Data Sharing
        </h2>
        <p>We do not sell or share your personal data with third parties except:</p>
        <ul>
          <li>Razorpay (for payment processing)</li>
          <li>Courier services (delivery address only, for shipped orders)</li>
        </ul>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-text-primary)', marginTop: '32px' }}>
          Your Rights
        </h2>
        <p>Under India's IT Act 2000 and Digital Personal Data Protection Act 2023, you have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Withdraw consent for data processing</li>
        </ul>
        <p>Contact: <a href="mailto:privacy@underwater-ai.com" style={{ color: 'var(--color-accent-cyan)' }}>privacy@underwater-ai.com</a></p>
      </div>
    </div>
  );
}
