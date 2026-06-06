import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone } from 'react-dropzone';

const PLA_PRICE_PER_GRAM = 4.5;
const PLA_DENSITY = 1.24;
const SETUP_FEE = 50;
const GST_RATE = 0.18;
const IISER_DOMAIN = 'iiserkol.ac.in';
const FIRST_DISCOUNT = 0.50;
const REPEAT_DISCOUNT = 0.30;

function signedTetraVol(v1, v2, v3) {
  return (v1[0] * (v2[1] * v3[2] - v2[2] * v3[1]) -
    v1[1] * (v2[0] * v3[2] - v2[2] * v3[0]) +
    v1[2] * (v2[0] * v3[1] - v2[1] * v3[0])) / 6;
}

function parseBinarySTL(buffer) {
  const view = new DataView(buffer);
  const triangleCount = view.getUint32(80, true);
  const vertices = [];

  for (let i = 0; i < triangleCount; i++) {
    const offset = 84 + i * 50;
    const nx = view.getFloat32(offset, true);
    const ny = view.getFloat32(offset + 4, true);
    const nz = view.getFloat32(offset + 8, true);
    const x1 = view.getFloat32(offset + 12, true);
    const y1 = view.getFloat32(offset + 16, true);
    const z1 = view.getFloat32(offset + 20, true);
    const x2 = view.getFloat32(offset + 24, true);
    const y2 = view.getFloat32(offset + 28, true);
    const z2 = view.getFloat32(offset + 32, true);
    const x3 = view.getFloat32(offset + 36, true);
    const y3 = view.getFloat32(offset + 40, true);
    const z3 = view.getFloat32(offset + 44, true);
    vertices.push([x1, y1, z1], [x2, y2, z2], [x3, y3, z3]);
  }

  return { vertices, triangleCount };
}

function parseAsciiSTL(text) {
  const vertexRegex = /vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g;
  const vertices = [];
  let match;
  while ((match = vertexRegex.exec(text)) !== null) {
    vertices.push([parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3])]);
  }
  const triangleCount = vertices.length / 3;
  return { vertices, triangleCount };
}

function calculateVolume(vertices, triangleCount) {
  let total = 0;
  for (let i = 0; i < triangleCount; i++) {
    const v1 = vertices[i * 3];
    const v2 = vertices[i * 3 + 1];
    const v3 = vertices[i * 3 + 2];
    total += signedTetraVol(v1, v2, v3);
  }
  return Math.abs(total);
}

function calcQuote({ weightG, qty, email, printNum }) {
  const isIISER = email.toLowerCase().endsWith(`@${IISER_DOMAIN}`);
  const materialCost = weightG * PLA_PRICE_PER_GRAM * qty;
  const subtotal = materialCost + SETUP_FEE;
  const discRate = isIISER ? (printNum === 1 ? FIRST_DISCOUNT : REPEAT_DISCOUNT) : 0;
  const discAmt = subtotal * discRate;
  const afterDisc = subtotal - discAmt;
  const gst = afterDisc * GST_RATE;
  const total = afterDisc + gst;

  return {
    isIISER,
    materialCost,
    setupFee: SETUP_FEE,
    subtotal,
    discRate,
    discAmt,
    afterDisc,
    gst,
    total,
  };
}

function formatINR(amount) {
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function generateQuoteText(quote, weightG, qty, email, printNum) {
  const ref = `UAI-Q-${Date.now().toString(36).toUpperCase()}`;
  const date = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  const isIISER = email.toLowerCase().endsWith(`@${IISER_DOMAIN}`);

  let text = `═══════════════════════════════════════════
UNDERWATER AI · 3D PRINT QUOTATION
═══════════════════════════════════════════
Ref: ${ref}
Date: ${date} | Valid 7 days
───────────────────────────────────────────
MATERIAL SPECIFICATIONS
───────────────────────────────────────────
Material     : PLA
Weight       : ${weightG.toFixed(1)}g
Quantity     : ${qty} piece(s)
Price/gram   : ₹${PLA_PRICE_PER_GRAM}
───────────────────────────────────────────
COST BREAKDOWN
───────────────────────────────────────────
Material Cost (${qty}x): ${formatINR(quote.materialCost)}
Setup Fee           : ${formatINR(quote.setupFee)}
Subtotal            : ${formatINR(quote.subtotal)}
`;

  if (quote.discAmt > 0) {
    const discLabel = isIISER && printNum === 1 ? '50% First Print Discount' : '30% Repeat Print Discount';
    text += `───────────────────────────────────────────
DISCOUNT APPLIED
${discLabel}: -${formatINR(quote.discAmt)}
After Discount     : ${formatINR(quote.afterDisc)}
`;
  }

  text += `───────────────────────────────────────────
GST (18%)           : ${formatINR(quote.gst)}
═══════════════════════════════════════════
TOTAL PAYABLE       : ${formatINR(quote.total)}
═══════════════════════════════════════════
Estimate based on ${weightG > 0 ? 'STL mesh analysis' : 'entered weight'}.
Final cost confirmed after slicing.

UNDERWATER AI · 3D PRINTING SERVICE
IISER Kolkata | underwater-ai@iiserkol.ac.in
`;

  return text;
}

const dropzoneStyles = {
  border: '2px dashed rgba(143, 174, 126, 0.2)',
  borderRadius: '8px',
  padding: '32px 16px',
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  background: 'rgba(143, 174, 126, 0.03)',
};

const dropzoneActiveStyles = {
  border: '2px dashed rgba(143, 174, 126, 0.5)',
  background: 'rgba(143, 174, 126, 0.08)',
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--color-bg-elevated)',
  border: '1px solid rgba(143, 174, 126, 0.1)',
  borderRadius: '6px',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  outline: 'none',
  transition: 'border-color 0.15s ease',
  boxSizing: 'border-box',
};

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-label)',
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '6px',
};

export default function QuotationCalculator() {
  const [mode, setMode] = useState('upload');
  const [stlFile, setStlFile] = useState(null);
  const [stlData, setStlData] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [manualWeight, setManualWeight] = useState('');
  const [infill, setInfill] = useState(20);
  const [supports, setSupports] = useState(false);
  const [qty, setQty] = useState(1);
  const [email, setEmail] = useState('');
  const [printNum, setPrintNum] = useState(1);
  const [quote, setQuote] = useState(null);
  const [copied, setCopied] = useState(false);

  const isIISER = useMemo(() => email.toLowerCase().endsWith(`@${IISER_DOMAIN}`), [email]);

  const derivedWeight = useMemo(() => {
    if (mode === 'upload' && stlData) {
      const volumeCM3 = stlData.volumeMM3 / 1000;
      const materialFactor = 0.25 + (infill / 100) * 0.75;
      const weightG = volumeCM3 * PLA_DENSITY * materialFactor * (supports ? 1.15 : 1);
      return Math.max(weightG, 1);
    }
    return parseFloat(manualWeight) || 0;
  }, [mode, stlData, infill, supports, manualWeight]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setStlFile(file);
    setParsing(true);
    setQuote(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target.result;
      let result;

      if (buffer.slice(0, 5) === 'solid') {
        const text = new TextDecoder().decode(buffer);
        if (text.includes('facet normal')) {
          result = parseAsciiSTL(text);
        } else {
          const binaryBuffer = buffer.slice(0, 84 + 50);
          result = parseBinarySTL(binaryBuffer);
        }
      } else {
        result = parseBinarySTL(buffer);
      }

      const volumeMM3 = calculateVolume(result.vertices, result.triangleCount);
      setStlData({
        volumeMM3,
        triangleCount: result.triangleCount,
        fileName: file.name,
        volumeCM3: volumeMM3 / 1000,
      });
      setParsing(false);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/sla': ['.stl'],
      'application/octet-stream': ['.stl'],
    },
    maxFiles: 1,
  });

  const handleGenerateQuote = () => {
    const q = calcQuote({ weightG: derivedWeight, qty, email, printNum });
    setQuote(q);
  };

  const handleCopyQuote = () => {
    if (!quote) return;
    const text = generateQuoteText(quote, derivedWeight, qty, email, printNum);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setStlFile(null);
    setStlData(null);
    setManualWeight('');
    setInfill(20);
    setSupports(false);
    setQty(1);
    setEmail('');
    setPrintNum(1);
    setQuote(null);
  };

  return (
    <div style={{
      background: 'var(--color-bg-card)',
      border: '1px solid rgba(143, 174, 126, 0.08)',
      borderRadius: '12px',
      padding: '24px',
      position: 'sticky',
      top: '108px',
    }}>
      <h3 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '18px',
        color: 'var(--color-text-primary)',
        marginBottom: '20px',
      }}>
        Price Calculator
      </h3>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['upload', 'manual'].map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setQuote(null); }}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontFamily: 'var(--font-label)',
              fontSize: '12px',
              fontWeight: 500,
              background: mode === m ? 'rgba(143, 174, 126, 0.15)' : 'var(--color-bg-elevated)',
              border: mode === m ? '1px solid rgba(143, 174, 126, 0.3)' : '1px solid rgba(143, 174, 126, 0.06)',
              borderRadius: '6px',
              color: mode === m ? 'var(--color-accent-sage)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {m === 'upload' ? '↖ Upload STL' : '⚖ Enter Weight'}
          </button>
        ))}
      </div>

      {mode === 'upload' ? (
        <div>
          <div
            {...getRootProps()}
            style={{
              ...dropzoneStyles,
              ...(isDragActive ? dropzoneActiveStyles : {}),
            }}
          >
            <input {...getInputProps()} />
            {parsing ? (
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid rgba(143, 174, 126, 0.2)',
                borderTopColor: 'var(--color-accent-sage)',
                borderRadius: '50%',
                margin: '0 auto 12px',
                animation: 'spin 0.8s linear infinite',
              }} />
            ) : stlData ? (
              <div>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>✓</div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'var(--color-accent-sage)',
                  marginBottom: '4px',
                  wordBreak: 'break-all',
                }}>
                  {stlData.fileName}
                </p>
                <p style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '12px',
                  color: 'var(--color-text-muted)',
                }}>
                  {stlData.volumeCM3.toFixed(2)} cm³ · {stlData.triangleCount.toLocaleString()} triangles
                </p>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '32px', marginBottom: '8px', opacity: 0.4 }}>📐</div>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '4px',
                }}>
                  Drag & drop STL file here
                </p>
                <p style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  color: 'var(--color-text-muted)',
                }}>
                  Binary or ASCII STL only
                </p>
              </div>
            )}
          </div>

          {stlData && (
            <div style={{ marginTop: '16px' }}>
              <label style={labelStyle}>Infill: {infill}%</label>
              <input
                type="range"
                min={10}
                max={100}
                step={5}
                value={infill}
                onChange={(e) => setInfill(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--color-accent-sage)' }}
              />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: '4px',
              }}>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
                  Dense
                </span>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: 'var(--color-accent-sage)' }}>
                  ~{derivedWeight.toFixed(1)}g
                </span>
                <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
                  Light
                </span>
              </div>

              <label style={{
                ...labelStyle,
                marginTop: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                textTransform: 'none',
                fontSize: '13px',
                color: supports ? 'var(--color-accent-sage)' : 'var(--color-text-secondary)',
              }}>
                <input
                  type="checkbox"
                  checked={supports}
                  onChange={(e) => setSupports(e.target.checked)}
                  style={{ accentColor: 'var(--color-accent-sage)' }}
                />
                Support Material (+15%)
              </label>
            </div>
          )}
        </div>
      ) : (
        <div>
          <label style={labelStyle}>Weight (grams)</label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={manualWeight}
              onChange={(e) => { setManualWeight(e.target.value); setQuote(null); }}
              placeholder="e.g. 50"
              min="0"
              step="0.1"
              style={{ ...inputStyle, paddingRight: '32px' }}
            />
            <span style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'var(--font-label)',
              fontSize: '12px',
              color: 'var(--color-text-muted)',
            }}>
              g
            </span>
          </div>
          <p style={{
            fontFamily: 'var(--font-label)',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
            marginTop: '6px',
          }}>
            From your slicer (Cura, Bambu Studio, PrusaSlicer…)
          </p>
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <label style={labelStyle}>Quantity</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-bg-elevated)',
              border: '1px solid rgba(143, 174, 126, 0.1)',
              borderRadius: '6px',
              color: 'var(--color-text-primary)',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            −
          </button>
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '16px',
            color: 'var(--color-text-primary)',
            minWidth: '60px',
            textAlign: 'center',
          }}>
            {qty} piece{qty > 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setQty((q) => Math.min(50, q + 1))}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--color-bg-elevated)',
              border: '1px solid rgba(143, 174, 126, 0.1)',
              borderRadius: '6px',
              color: 'var(--color-text-primary)',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            +
          </button>
        </div>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label style={labelStyle}>Email (for discount)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setQuote(null); }}
          placeholder="you@iiserkol.ac.in"
          style={{
            ...inputStyle,
            ...(isIISER ? { background: 'rgba(143, 174, 126, 0.06)', borderColor: 'rgba(143, 174, 126, 0.3)' } : {}),
          }}
        />
      </div>

      {isIISER && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ marginTop: '12px' }}
        >
          <div style={{
            padding: '12px',
            background: 'rgba(143, 174, 126, 0.08)',
            border: '1px solid rgba(143, 174, 126, 0.2)',
            borderRadius: '8px',
          }}>
            <p style={{
              fontFamily: 'var(--font-label)',
              fontSize: '11px',
              color: 'var(--color-accent-sage)',
              marginBottom: '8px',
            }}>
              ✓ IISER Kolkata detected — you qualify for a discount!
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setPrintNum(1)}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  background: printNum === 1 ? 'var(--color-accent-sage)' : 'transparent',
                  border: '1px solid rgba(143, 174, 126, 0.3)',
                  borderRadius: '6px',
                  color: printNum === 1 ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                1st print — 50% off
              </button>
              <button
                onClick={() => setPrintNum(2)}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  background: printNum === 2 ? 'var(--color-accent-sage)' : 'transparent',
                  border: '1px solid rgba(143, 174, 126, 0.3)',
                  borderRadius: '6px',
                  color: printNum === 2 ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                }}
              >
                2nd+ — 30% off
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {!isIISER && email.length > 0 && (
        <p style={{
          fontFamily: 'var(--font-label)',
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          marginTop: '8px',
        }}>
          Discounts available for @iiserkol.ac.in email addresses only.
        </p>
      )}

      <button
        onClick={handleGenerateQuote}
        disabled={derivedWeight <= 0}
        style={{
          width: '100%',
          marginTop: '20px',
          padding: '12px 16px',
          fontFamily: 'var(--font-label)',
          fontSize: '13px',
          fontWeight: 500,
          background: derivedWeight > 0 ? 'var(--color-accent-sage)' : 'var(--color-bg-elevated)',
          border: 'none',
          borderRadius: '8px',
          color: derivedWeight > 0 ? 'var(--color-text-inverse)' : 'var(--color-text-muted)',
          cursor: derivedWeight > 0 ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s ease',
        }}
      >
        Generate Quotation
      </button>

      <AnimatePresence>
        {quote && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: '20px',
              background: 'var(--color-bg-elevated)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <div style={{
              height: '3px',
              background: 'linear-gradient(90deg, var(--color-accent-sage), var(--color-accent-gold))',
            }} />

            <div style={{ padding: '20px' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                marginBottom: '16px',
              }}>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '16px',
                    color: 'var(--color-text-primary)',
                    margin: 0,
                  }}>
                    Underwater AI · 3D Print
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '11px',
                    color: 'var(--color-text-muted)',
                    margin: '4px 0 0',
                  }}>
                    {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} · Valid 7 days
                  </p>
                </div>
                <p style={{
                  fontFamily: 'var(--font-label)',
                  fontSize: '10px',
                  color: 'var(--color-accent-sage)',
                  background: 'rgba(143, 174, 126, 0.1)',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}>
                  {PLA_PRICE_PER_GRAM}/g
                </p>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                padding: '12px',
                background: 'var(--color-bg-card)',
                borderRadius: '8px',
                marginBottom: '16px',
              }}>
                {[
                  { label: 'Material', value: 'PLA' },
                  { label: 'Weight', value: `${derivedWeight.toFixed(1)}g` },
                  { label: 'Qty', value: qty },
                  { label: '₹/g', value: `₹${PLA_PRICE_PER_GRAM}` },
                ].map(({ label, value }) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '9px', color: 'var(--color-text-muted)', margin: '0 0 2px' }}>
                      {label}
                    </p>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-primary)', margin: 0 }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { label: 'Material Cost', value: formatINR(quote.materialCost) },
                  { label: 'Setup Fee', value: formatINR(quote.setupFee) },
                  { label: 'Subtotal', value: formatINR(quote.subtotal), border: true },
                ].map(({ label, value, border }) => (
                  <div key={label} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: border ? '8px 0 0' : '0',
                    borderTop: border ? '1px solid rgba(143, 174, 126, 0.08)' : 'none',
                  }}>
                    <span style={{ fontFamily: 'var(--font-label)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-primary)' }}>
                      {value}
                    </span>
                  </div>
                ))}

                {quote.discAmt > 0 && (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    padding: '10px',
                    background: 'rgba(143, 174, 126, 0.08)',
                    borderRadius: '6px',
                    marginTop: '4px',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'var(--color-accent-sage)' }}>
                        {(quote.discRate * 100).toFixed(0)}% Discount
                      </span>
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'var(--color-accent-sage)' }}>
                        −{formatINR(quote.discAmt)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-label)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        After Discount
                      </span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-primary)' }}>
                        {formatINR(quote.afterDisc)}
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid rgba(143, 174, 126, 0.08)' }}>
                  <span style={{ fontFamily: 'var(--font-label)', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    GST (18%)
                  </span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--color-text-primary)' }}>
                    {formatINR(quote.gst)}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '12px',
                  marginTop: '4px',
                  borderTop: '1px solid rgba(143, 174, 126, 0.15)',
                }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', color: 'var(--color-text-primary)' }}>
                    Total Payable
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '24px',
                    color: 'var(--color-accent-sage)',
                  }}>
                    {formatINR(quote.total)}
                  </span>
                </div>
              </div>

              <p style={{
                fontFamily: 'var(--font-label)',
                fontSize: '10px',
                color: 'var(--color-text-muted)',
                marginTop: '16px',
                textAlign: 'center',
              }}>
                Estimate based on {mode === 'upload' && stlData ? 'STL mesh analysis' : 'entered weight'}. Final cost confirmed after slicing.
              </p>

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <button
                  onClick={handleCopyQuote}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontFamily: 'var(--font-label)',
                    fontSize: '12px',
                    background: copied ? 'rgba(143, 174, 126, 0.15)' : 'var(--color-bg-card)',
                    border: '1px solid rgba(143, 174, 126, 0.2)',
                    borderRadius: '6px',
                    color: copied ? 'var(--color-accent-sage)' : 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {copied ? '✓ Copied!' : '⧉ Copy Quote'}
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    flex: 1,
                    padding: '10px',
                    fontFamily: 'var(--font-label)',
                    fontSize: '12px',
                    background: 'var(--color-bg-card)',
                    border: '1px solid rgba(143, 174, 126, 0.2)',
                    borderRadius: '6px',
                    color: 'var(--color-text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  ↺ Reset
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}