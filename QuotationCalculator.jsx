import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Constants ─────────────────────────────────────────────────────────────────
const PLA_PRICE_PER_GRAM = 4.5;       // ₹ per gram
const PLA_DENSITY        = 1.24;      // g/cm³
const SETUP_FEE          = 50;        // ₹ fixed
const GST_RATE           = 0.18;      // 18 %
const IISER_DOMAIN       = 'iiserkol.ac.in';
const FIRST_DISCOUNT     = 0.50;      // 50 % on first print
const REPEAT_DISCOUNT    = 0.30;      // 30 % on subsequent prints

// ─── Shared style primitives ───────────────────────────────────────────────────
const label = {
  display: 'block',
  fontFamily: 'var(--font-label)',
  fontSize: '11px',
  fontWeight: 500,
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: '5px',
};

const input = {
  width: '100%',
  padding: '9px 12px',
  background: 'var(--color-bg-elevated)',
  border: '1px solid rgba(143,174,126,0.10)',
  borderRadius: '6px',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
};

// ─── STL in-browser parser ─────────────────────────────────────────────────────
function signedTetraVol(v1, v2, v3) {
  return (
    v1[0] * (v2[1] * v3[2] - v2[2] * v3[1]) +
    v2[0] * (v3[1] * v1[2] - v3[2] * v1[1]) +
    v3[0] * (v1[1] * v2[2] - v1[2] * v2[1])
  ) / 6.0;
}

function parseSTL(buffer) {
  // Detect ASCII vs binary
  const head = new Uint8Array(buffer.slice(0, 5));
  const headStr = String.fromCharCode(...head);

  let volume = 0;

  if (headStr.toLowerCase().startsWith('solid')) {
    // Try ASCII path first
    try {
      const text = new TextDecoder('utf-8').decode(buffer);
      const re = /vertex\s+([-\d.eE+]+)\s+([-\d.eE+]+)\s+([-\d.eE+]+)/g;
      const verts = [];
      let m;
      while ((m = re.exec(text)) !== null)
        verts.push([+m[1], +m[2], +m[3]]);
      if (verts.length % 3 !== 0) throw new Error('odd vertex count');
      for (let i = 0; i < verts.length; i += 3)
        volume += signedTetraVol(verts[i], verts[i + 1], verts[i + 2]);
      const triCount = verts.length / 3;
      if (triCount < 4) throw new Error('too few triangles');
      return { volumeMM3: Math.abs(volume), triCount };
    } catch (_) {
      // fall through to binary
      volume = 0;
    }
  }

  // Binary STL: 80-byte header, 4-byte uint32 count, 50 bytes/triangle
  const view = new DataView(buffer);
  const triCount = view.getUint32(80, true);
  let off = 84;
  for (let i = 0; i < triCount; i++) {
    off += 12; // skip normal
    const v1 = [view.getFloat32(off, true), view.getFloat32(off + 4, true), view.getFloat32(off + 8, true)]; off += 12;
    const v2 = [view.getFloat32(off, true), view.getFloat32(off + 4, true), view.getFloat32(off + 8, true)]; off += 12;
    const v3 = [view.getFloat32(off, true), view.getFloat32(off + 4, true), view.getFloat32(off + 8, true)]; off += 12;
    off += 2; // attribute bytes
    volume += signedTetraVol(v1, v2, v3);
  }
  return { volumeMM3: Math.abs(volume), triCount };
}

// ─── Weight / price helpers ────────────────────────────────────────────────────
function estimateGrams(volumeMM3, infillPct, hasSupports) {
  const cm3 = volumeMM3 / 1000;
  // Shell walls ≈ 25 % of total volume (solid); infill fills the rest
  const mat = 0.25 + (infillPct / 100) * 0.75;
  let g = cm3 * PLA_DENSITY * mat;
  if (hasSupports) g *= 1.15; // support material overhead
  return Math.max(g, 1);
}

function calcQuote({ weightG, qty, email, printNum }) {
  const isIISER     = email.trim().toLowerCase().endsWith(`@${IISER_DOMAIN}`);
  const discRate    = isIISER ? (printNum === 1 ? FIRST_DISCOUNT : REPEAT_DISCOUNT) : 0;

  const matCost     = weightG * PLA_PRICE_PER_GRAM * qty;
  const subtotal    = matCost + SETUP_FEE;
  const discAmt     = subtotal * discRate;
  const afterDisc   = subtotal - discAmt;
  const gst         = afterDisc * GST_RATE;
  const total       = afterDisc + gst;

  return { weightG, qty, matCost, subtotal, isIISER, discRate, discAmt, afterDisc, gst, total, printNum };
}

// ─── Render helpers ────────────────────────────────────────────────────────────
function Row({ label: lbl, value, accent, bold, dimmed, strike }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '5px 0',
      borderBottom: '1px solid rgba(143,174,126,0.04)',
    }}>
      <span style={{
        fontFamily: 'var(--font-label)',
        fontSize: '12px',
        color: dimmed ? 'var(--color-text-muted)' : 'var(--color-text-secondary)',
      }}>{lbl}</span>
      <span style={{
        fontFamily: bold ? 'var(--font-display)' : 'var(--font-label)',
        fontSize: bold ? '22px' : '13px',
        color: accent ? 'var(--color-accent-sage)'
             : strike ? 'var(--color-text-muted)'
             : 'var(--color-text-primary)',
        textDecoration: strike ? 'line-through' : 'none',
        fontWeight: bold ? 700 : 400,
      }}>{value}</span>
    </div>
  );
}

function ToggleChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px',
        fontFamily: 'var(--font-label)',
        fontSize: '12px',
        fontWeight: 500,
        background: active ? 'rgba(143,174,126,0.12)' : 'var(--color-bg-elevated)',
        border: active ? '1px solid rgba(143,174,126,0.35)' : '1px solid rgba(143,174,126,0.08)',
        borderRadius: '6px',
        color: active ? 'var(--color-accent-sage)' : 'var(--color-text-secondary)',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function QuotationCalculator() {
  // — weight source —
  const [mode, setMode]           = useState('manual'); // 'stl' | 'manual'
  const [stlName, setStlName]     = useState('');
  const [stlInfo, setStlInfo]     = useState(null);    // { volumeMM3, triCount }
  const [parsing, setParsing]     = useState(false);
  const [parseErr, setParseErr]   = useState('');

  // — inputs —
  const [manualG, setManualG]     = useState('');
  const [infill, setInfill]       = useState(20);
  const [supports, setSupports]   = useState(false);
  const [qty, setQty]             = useState(1);
  const [email, setEmail]         = useState('');
  const [printNum, setPrintNum]   = useState(1);

  // — output —
  const [quote, setQuote]         = useState(null);
  const [copied, setCopied]       = useState(false);

  // derived weight
  const estG = mode === 'stl' && stlInfo
    ? estimateGrams(stlInfo.volumeMM3, infill, supports)
    : parseFloat(manualG) || 0;

  const isIISER = email.trim().toLowerCase().endsWith(`@${IISER_DOMAIN}`);
  const canGenerate = estG > 0;

  // ── STL drop zone ──
  const onDrop = useCallback(async (accepted) => {
    const file = accepted[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.stl')) {
      setParseErr('Only .STL files are supported for weight estimation.');
      return;
    }
    setParsing(true);
    setParseErr('');
    setStlName(file.name);
    setQuote(null);
    try {
      const buf = await file.arrayBuffer();
      const info = parseSTL(buf);
      setStlInfo(info);
      setMode('stl');
    } catch (e) {
      setParseErr('Could not parse this STL — please enter weight manually.');
      setMode('manual');
    } finally {
      setParsing(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/sla': ['.stl'], 'application/octet-stream': ['.stl'] },
    maxSize: 100 * 1024 * 1024,
    multiple: false,
  });

  // ── Generate ──
  const generate = () => {
    if (!canGenerate) return;
    setQuote(calcQuote({ weightG: estG, qty, email, printNum }));
  };

  // ── Copy quotation text ──
  const handleCopy = () => {
    if (!quote) return;
    const now = new Date();
    const ref = `UAI-Q-${Date.now().toString(36).toUpperCase()}`;
    const txt = [
      `╔══════════════════════════════════════════╗`,
      `║    UNDERWATER AI — 3D PRINT QUOTATION    ║`,
      `╚══════════════════════════════════════════╝`,
      ``,
      `Ref No. : ${ref}`,
      `Date    : ${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`,
      ``,
      `── Print Specifications ─────────────────────`,
      `Material  : PLA  @ ₹${PLA_PRICE_PER_GRAM}/g`,
      `Weight    : ${quote.weightG.toFixed(1)} g`,
      `Quantity  : ${quote.qty} piece(s)`,
      stlName ? `File      : ${stlName}` : null,
      ``,
      `── Cost Breakdown ───────────────────────────`,
      `Material Cost      ₹${quote.matCost.toFixed(2)}`,
      `Setup Fee          ₹${SETUP_FEE.toFixed(2)}`,
      `Subtotal           ₹${quote.subtotal.toFixed(2)}`,
      quote.discAmt > 0 ? `IISER Discount     -₹${quote.discAmt.toFixed(2)}  (${(quote.discRate * 100).toFixed(0)}%)` : null,
      `GST (18 %)         ₹${quote.gst.toFixed(2)}`,
      `────────────────────────────────────────────`,
      `TOTAL PAYABLE      ₹${quote.total.toFixed(2)}`,
      ``,
      quote.isIISER
        ? `✓ IISER Kolkata member — Print #${quote.printNum} discount applied.`
        : null,
      `Valid for 7 days from date of issue.`,
      `Location : IISER Kolkata Campus, Mohanpur 741246`,
      `Contact  : contact@underwaterai.in`,
    ].filter(l => l !== null).join('\n');

    navigator.clipboard.writeText(txt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{
      background: 'var(--color-bg-card)',
      border: '1px solid rgba(143,174,126,0.08)',
      borderRadius: '12px',
      padding: '28px',
      position: 'sticky',
      top: '108px',
    }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{
          fontFamily: 'var(--font-label)',
          fontSize: '11px',
          color: 'var(--color-accent-sage)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '4px',
        }}>
          Instant Estimator
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          margin: 0,
        }}>
          Price Calculator
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          color: 'var(--color-text-muted)',
          margin: '4px 0 0',
        }}>
          PLA · ₹{PLA_PRICE_PER_GRAM}/g · GST included
        </p>
      </div>

      {/* ── Mode tabs ── */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <ToggleChip active={mode === 'stl'} onClick={() => setMode('stl')}>
          ↑ Upload STL
        </ToggleChip>
        <ToggleChip active={mode === 'manual'} onClick={() => setMode('manual')}>
          ✎ Enter Weight
        </ToggleChip>
      </div>

      {/* ── STL drop zone ── */}
      <AnimatePresence mode="wait">
        {mode === 'stl' && (
          <motion.div
            key="stl"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            style={{ marginBottom: '16px' }}
          >
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? 'var(--color-accent-sage)' : 'rgba(143,174,126,0.18)'}`,
                borderRadius: '10px',
                padding: '28px 16px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragActive ? 'rgba(143,174,126,0.04)' : 'var(--color-bg-elevated)',
                transition: 'all 0.2s ease',
              }}
            >
              <input {...getInputProps()} />

              {parsing ? (
                <div>
                  <div className="calc-spinner" />
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '10px' }}>
                    Parsing mesh…
                  </p>
                </div>
              ) : stlInfo ? (
                <div>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>🖨</div>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: 'var(--color-text-primary)',
                    marginBottom: '3px',
                  }}>{stlName}</p>
                  <p style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '11px',
                    color: 'var(--color-accent-sage)',
                  }}>
                    Vol: {(stlInfo.volumeMM3 / 1000).toFixed(2)} cm³ · {stlInfo.triCount.toLocaleString()} triangles
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '11px',
                    color: 'var(--color-text-muted)',
                    marginTop: '4px',
                  }}>Click to replace</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '28px', opacity: 0.55, marginBottom: '10px' }}>↑</div>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    color: 'var(--color-text-primary)',
                    marginBottom: '4px',
                  }}>
                    {isDragActive ? 'Drop STL here' : 'Drag & drop your STL file'}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '11px',
                    color: 'var(--color-text-muted)',
                  }}>
                    .STL only · Max 100 MB · Parsed locally, never uploaded
                  </p>
                </div>
              )}
            </div>

            {parseErr && (
              <p style={{
                fontFamily: 'var(--font-label)',
                fontSize: '11px',
                color: 'var(--color-error)',
                marginTop: '6px',
              }}>{parseErr}</p>
            )}
          </motion.div>
        )}

        {/* ── Manual weight ── */}
        {mode === 'manual' && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            style={{ marginBottom: '16px' }}
          >
            <label style={label}>Print Weight (grams)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min="1"
                max="9999"
                step="0.1"
                value={manualG}
                onChange={(e) => setManualG(e.target.value)}
                placeholder="e.g. 85"
                style={{ ...input, paddingRight: '42px' }}
              />
              <span style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: 'var(--font-label)',
                fontSize: '12px',
                color: 'var(--color-text-muted)',
              }}>g</span>
            </div>
            <p style={{
              fontFamily: 'var(--font-label)',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
              marginTop: '5px',
            }}>
              From your slicer's weight estimate (Cura, Bambu Studio, PrusaSlicer, etc.)
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Infill + Supports (shown when STL mode is active) ── */}
      {mode === 'stl' && stlInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ marginBottom: '16px' }}
        >
          <div style={{ marginBottom: '14px' }}>
            <label style={label}>
              Infill Density — {infill}%
              <span style={{ color: 'var(--color-text-muted)', marginLeft: '8px' }}>
                (est. {estimateGrams(stlInfo.volumeMM3, infill, supports).toFixed(1)} g)
              </span>
            </label>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={infill}
              onChange={(e) => setInfill(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--color-accent-sage)', marginTop: '4px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: 'var(--color-text-muted)' }}>Sparse 10%</span>
              <span style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: 'var(--color-text-muted)' }}>Solid 100%</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <ToggleChip active={supports} onClick={() => setSupports(!supports)}>
              {supports ? '✓' : '+'} Support Material
            </ToggleChip>
          </div>
        </motion.div>
      )}

      {/* ── Quantity ── */}
      <div style={{ marginBottom: '14px' }}>
        <label style={label}>Quantity</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            style={{
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--color-bg-elevated)', border: '1px solid rgba(143,174,126,0.1)',
              borderRadius: '6px', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '16px',
            }}
          >−</button>
          <span style={{
            fontFamily: 'var(--font-label)',
            fontSize: '16px',
            color: 'var(--color-text-primary)',
            minWidth: '30px',
            textAlign: 'center',
          }}>{qty}</span>
          <button
            onClick={() => setQty(Math.min(50, qty + 1))}
            style={{
              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--color-bg-elevated)', border: '1px solid rgba(143,174,126,0.1)',
              borderRadius: '6px', color: 'var(--color-text-secondary)', cursor: 'pointer', fontSize: '16px',
            }}
          >+</button>
          <span style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
            piece{qty !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ── IISER discount section ── */}
      <div style={{
        background: 'var(--color-bg-elevated)',
        border: '1px solid rgba(143,174,126,0.08)',
        borderRadius: '8px',
        padding: '14px',
        marginBottom: '16px',
      }}>
        <p style={{
          fontFamily: 'var(--font-label)',
          fontSize: '11px',
          color: 'var(--color-accent-gold)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          marginBottom: '10px',
        }}>
          ★ IISER Kolkata Member Discount
        </p>

        <div style={{ marginBottom: '10px' }}>
          <label style={label}>Your Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@iiserkol.ac.in"
            style={{
              ...input,
              borderColor: isIISER ? 'rgba(143,174,126,0.4)' : 'rgba(143,174,126,0.10)',
              background: isIISER ? 'rgba(143,174,126,0.06)' : 'var(--color-bg-elevated)',
            }}
          />
          {isIISER && (
            <p style={{
              fontFamily: 'var(--font-label)',
              fontSize: '11px',
              color: 'var(--color-accent-sage)',
              marginTop: '5px',
            }}>
              ✓ IISER Kolkata email detected — discount will be applied
            </p>
          )}
        </div>

        {isIISER && (
          <div>
            <label style={label}>This is print number</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <ToggleChip active={printNum === 1} onClick={() => setPrintNum(1)}>
                1st print — 50% off
              </ToggleChip>
              <ToggleChip active={printNum > 1} onClick={() => setPrintNum(2)}>
                2nd+ — 30% off
              </ToggleChip>
            </div>
          </div>
        )}

        {!isIISER && (
          <p style={{
            fontFamily: 'var(--font-label)',
            fontSize: '11px',
            color: 'var(--color-text-muted)',
          }}>
            First print: 50% off · Subsequent: 30% off · @iiserkol.ac.in accounts only
          </p>
        )}
      </div>

      {/* ── Generate button ── */}
      <button
        onClick={generate}
        disabled={!canGenerate}
        style={{
          width: '100%',
          padding: '11px',
          fontFamily: 'var(--font-label)',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          background: canGenerate ? 'var(--color-accent-sage)' : 'var(--color-bg-elevated)',
          color: canGenerate ? 'var(--color-text-inverse)' : 'var(--color-text-muted)',
          border: 'none',
          borderRadius: '7px',
          cursor: canGenerate ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          marginBottom: '16px',
        }}
      >
        Generate Quotation →
      </button>

      {/* ── Quotation output ── */}
      <AnimatePresence>
        {quote && (
          <motion.div
            key="quote"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            style={{
              background: 'var(--color-bg-elevated)',
              border: '1px solid rgba(143,174,126,0.15)',
              borderRadius: '10px',
              padding: '18px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Glow accent bar */}
            <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0,
              height: '2px',
              background: 'linear-gradient(90deg, var(--color-accent-sage), var(--color-accent-gold))',
            }} />

            {/* Quote header */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '10px',
                    color: 'var(--color-text-muted)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '2px',
                  }}>Quotation</p>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '17px',
                    color: 'var(--color-text-primary)',
                    fontWeight: 600,
                  }}>
                    Underwater AI · 3D Print
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '10px',
                    color: 'var(--color-text-muted)',
                  }}>
                    {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '10px',
                    color: 'var(--color-accent-sage)',
                    marginTop: '2px',
                  }}>
                    Valid 7 days
                  </p>
                </div>
              </div>
            </div>

            {/* Specs strip */}
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              padding: '10px 0',
              marginBottom: '10px',
              borderTop: '1px solid rgba(143,174,126,0.07)',
              borderBottom: '1px solid rgba(143,174,126,0.07)',
            }}>
              {[
                { k: 'Material', v: 'PLA' },
                { k: 'Weight', v: `${quote.weightG.toFixed(1)} g` },
                { k: 'Quantity', v: `${quote.qty} pc${quote.qty > 1 ? 's' : ''}` },
                { k: '₹/gram', v: `₹${PLA_PRICE_PER_GRAM}` },
              ].map(({ k, v }) => (
                <div key={k}>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '9px', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1px' }}>{k}</p>
                  <p style={{ fontFamily: 'var(--font-label)', fontSize: '13px', color: 'var(--color-text-primary)' }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Cost rows */}
            <div style={{ marginBottom: '4px' }}>
              <Row label="Material Cost" value={`₹${quote.matCost.toFixed(2)}`} dimmed />
              <Row label="Setup Fee" value={`₹${SETUP_FEE.toFixed(2)}`} dimmed />
              <Row label="Subtotal" value={`₹${quote.subtotal.toFixed(2)}`} />
            </div>

            {quote.discAmt > 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div style={{
                  background: 'rgba(143,174,126,0.07)',
                  border: '1px solid rgba(143,174,126,0.18)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  margin: '8px 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '11px', color: 'var(--color-accent-sage)', marginBottom: '1px' }}>
                      ★ IISER Member — {(quote.discRate * 100).toFixed(0)}% Discount
                    </p>
                    <p style={{ fontFamily: 'var(--font-label)', fontSize: '10px', color: 'var(--color-text-muted)' }}>
                      Print #{quote.printNum} · @{IISER_DOMAIN}
                    </p>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-label)',
                    fontSize: '14px',
                    color: 'var(--color-accent-sage)',
                    fontWeight: 600,
                  }}>
                    −₹{quote.discAmt.toFixed(2)}
                  </span>
                </div>
                <Row label="After Discount" value={`₹${quote.afterDisc.toFixed(2)}`} />
              </motion.div>
            )}

            <Row label="GST (18%)" value={`₹${quote.gst.toFixed(2)}`} dimmed />

            {/* Total */}
            <div style={{
              marginTop: '12px',
              paddingTop: '12px',
              borderTop: '1px solid rgba(143,174,126,0.12)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontFamily: 'var(--font-label)',
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>
                Total Payable (incl. GST)
              </span>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '26px',
                fontWeight: 700,
                color: 'var(--color-accent-sage)',
              }}>
                ₹{quote.total.toFixed(2)}
              </span>
            </div>

            {/* Footer note */}
            <p style={{
              fontFamily: 'var(--font-label)',
              fontSize: '10px',
              color: 'var(--color-text-muted)',
              marginTop: '10px',
              lineHeight: 1.6,
            }}>
              Estimate based on {mode === 'stl' ? 'STL mesh volume' : 'entered weight'}.
              Final cost confirmed after slicing. IISER Kolkata Campus.
            </p>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button
                onClick={handleCopy}
                style={{
                  flex: 1,
                  padding: '8px',
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: 'transparent',
                  border: '1px solid rgba(143,174,126,0.2)',
                  borderRadius: '6px',
                  color: copied ? 'var(--color-accent-sage)' : 'var(--color-text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {copied ? '✓ Copied!' : '⧉ Copy Quote'}
              </button>
              <button
                onClick={() => {
                  setQuote(null);
                  setManualG('');
                  setStlInfo(null);
                  setStlName('');
                  setMode('manual');
                }}
                style={{
                  padding: '8px 12px',
                  fontFamily: 'var(--font-label)',
                  fontSize: '11px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  background: 'transparent',
                  border: '1px solid rgba(143,174,126,0.08)',
                  borderRadius: '6px',
                  color: 'var(--color-text-muted)',
                  cursor: 'pointer',
                }}
              >
                ↺ Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spinner style */}
      <style>{`
        .calc-spinner {
          width: 28px; height: 28px;
          border: 2px solid rgba(143,174,126,0.15);
          border-top-color: var(--color-accent-sage);
          border-radius: 50%;
          margin: 0 auto;
          animation: calc-spin 0.7s linear infinite;
        }
        @keyframes calc-spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
