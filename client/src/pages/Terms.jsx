export default function Terms() {
  return (
    <div style={{ paddingTop: '100px', maxWidth: '700px', margin: '0 auto', padding: '100px 24px 80px' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '32px',
        fontWeight: 700,
        color: 'var(--color-text-primary)',
        marginBottom: '24px',
      }}>
        Terms of Service
      </h1>
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '15px',
        color: 'var(--color-text-secondary)',
        lineHeight: 1.8,
      }}>
        <p><em>Last updated: May 2025</em></p>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-text-primary)', marginTop: '32px' }}>
          Service Description
        </h2>
        <p>Underwater AI provides 3D printing services using Bambu Lab P2S printers. We print models submitted by customers in various materials and deliver via pickup or courier.</p>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-text-primary)', marginTop: '32px' }}>
          Orders & Payment
        </h2>
        <ul>
          <li>All prices are in INR and include 18% GST</li>
          <li>Payment is processed via Razorpay at the time of order</li>
          <li>Orders can be cancelled before printing begins for a full refund</li>
          <li>Estimated print times are approximate and may vary</li>
        </ul>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-text-primary)', marginTop: '32px' }}>
          File Submissions
        </h2>
        <ul>
          <li>You retain full ownership of your uploaded 3D model files</li>
          <li>Files are deleted from our servers 30 days after order completion</li>
          <li>You are responsible for ensuring your files do not infringe on any patents or copyrights</li>
          <li>We reserve the right to refuse prints that are illegal, harmful, or violate IP rights</li>
        </ul>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-text-primary)', marginTop: '32px' }}>
          Liability
        </h2>
        <p>3D printed parts may have variations in dimensions, strength, and surface finish compared to the digital model. We are not liable for functional failures of printed parts in end-use applications unless explicitly agreed upon.</p>
      </div>
    </div>
  );
}
