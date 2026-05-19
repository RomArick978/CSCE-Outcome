import { useState, useRef, useCallback } from 'react';

// ─── apiFetch wrapper (handles session expiry) ────────────────────────────────
async function apiFetch(url, options = {}) {
  const response = await fetch(url, { ...options, redirect: 'manual' });
  if (response.type === 'opaqueredirect' || response.status === 302 || response.status === 401) {
    window.location.reload();
    return new Promise(() => {});
  }
  return response;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusColor = (s) => {
  if (!s) return '#6b7280';
  const l = s.toLowerCase();
  if (l === 'covered') return '#16a34a';
  if (l === 'partial') return '#d97706';
  return '#dc2626';
};

const confColor = (n) => n >= 75 ? '#16a34a' : n >= 50 ? '#d97706' : '#dc2626';

function ConfidenceBadge({ value }) {
  return (
    <span style={{
      background: confColor(value),
      color: '#fff',
      borderRadius: 12,
      padding: '2px 10px',
      fontSize: 12,
      fontWeight: 700,
    }}>{value}%</span>
  );
}

function StatusBadge({ status }) {
  return (
    <span style={{
      background: statusColor(status),
      color: '#fff',
      borderRadius: 6,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 600,
      whiteSpace: 'nowrap',
    }}>{status || '—'}</span>
  );
}

// ─── CSS-in-JS styles ─────────────────────────────────────────────────────────
const S = {
  app: {
    minHeight: '100vh',
    background: '#0f172a',
    color: '#e2e8f0',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    background: '#1e293b',
    borderBottom: '1px solid #334155',
    padding: '0 32px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    height: 58,
    flexShrink: 0,
  },
  headerTitle: { fontWeight: 700, fontSize: 17, color: '#f1f5f9', letterSpacing: '-0.3px' },
  headerSub: { fontSize: 11, color: '#64748b', marginTop: -1 },
  tabBar: { marginLeft: 'auto', display: 'flex', gap: 4 },
  tabBtn: (active) => ({
    padding: '6px 16px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: 13,
    background: active ? '#3b82f6' : 'transparent',
    color: active ? '#fff' : '#94a3b8',
    transition: 'all 0.15s',
  }),
  main: {
    flex: 1,
    maxWidth: 1000,
    width: '100%',
    margin: '0 auto',
    padding: '28px 24px',
  },
  card: {
    background: '#1e293b',
    border: '1px solid #334155',
    borderRadius: 10,
    padding: '16px 18px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: 13,
    color: '#f1f5f9',
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  input: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: 7,
    color: '#e2e8f0',
    padding: '8px 12px',
    fontSize: 13,
    width: '100%',
    boxSizing: 'border-box',
  },
  divider: { width: 1, background: '#334155', alignSelf: 'stretch', flexShrink: 0 },
  errorBox: {
    padding: '10px 14px',
    background: '#450a0a',
    border: '1px solid #7f1d1d',
    borderRadius: 8,
    color: '#fca5a5',
    fontSize: 13,
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 40px',
    color: '#475569',
    background: '#1e293b',
    borderRadius: 10,
    border: '1px solid #334155',
  },
};

function btnStyle(bg, disabled = false) {
  return {
    background: disabled ? '#1e293b' : bg,
    color: disabled ? '#475569' : '#fff',
    border: disabled ? '1px solid #334155' : 'none',
    borderRadius: 7,
    padding: '9px 14px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    fontSize: 13,
    width: '100%',
    transition: 'opacity 0.15s',
  };
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState('analyze');

  const [frameworks, setFrameworks] = useState({});
  const [frameworksLoaded, setFrameworksLoaded] = useState(false);

  const [reqDoc, setReqDoc] = useState(null);
  const [reqUploading, setReqUploading] = useState(false);

  const [policyDocs, setPolicyDocs] = useState([]);
  const [policyUploading, setPolicyUploading] = useState(false);

  const [selectedFrameworks, setSelectedFrameworks] = useState([]);
  const [mode, setMode] = useState('demo');

  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [expandedQ, setExpandedQ] = useState(null);
  const [history, setHistory] = useState([]);

  const reqInputRef = useRef();
  const policyInputRef = useRef();

  const loadFrameworks = useCallback(async () => {
    if (frameworksLoaded) return;
    try {
      const r = await apiFetch('/api/frameworks');
      if (r.ok) {
        const data = await r.json();
        setFrameworks(data);
        setFrameworksLoaded(true);
      }
    } catch (_) {}
  }, [frameworksLoaded]);

  const safeJson = async (r) => {
    const text = await r.text();
    if (!text || !text.trim()) return {};
    try { return JSON.parse(text); } catch (_) { return { message: text.slice(0, 200) }; }
  };

  const uploadReqDoc = async (file) => {
    setReqUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await apiFetch('/api/upload', { method: 'POST', body: fd });
      const data = await safeJson(r);
      if (!r.ok) throw new Error(data.message || `Upload failed (${r.status})`);
      setReqDoc({ filename: data.filename, text: data.text, parser: data.parser });
    } catch (e) {
      setError('Requirement upload failed: ' + e.message);
    } finally {
      setReqUploading(false);
    }
  };

  const uploadPolicyDoc = async (file) => {
    setPolicyUploading(true);
    setError('');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const r = await apiFetch('/api/upload', { method: 'POST', body: fd });
      const data = await safeJson(r);
      if (!r.ok) throw new Error(data.message || `Upload failed (${r.status})`);
      setPolicyDocs(prev => [...prev, { filename: data.filename, text: data.text, parser: data.parser }]);
    } catch (e) {
      setError('Policy upload failed: ' + e.message);
    } finally {
      setPolicyUploading(false);
    }
  };

  const toggleFramework = (fw) => {
    setSelectedFrameworks(prev =>
      prev.includes(fw) ? prev.filter(f => f !== fw) : [...prev, fw]
    );
  };

  const runAnalysis = async () => {
    if (!reqDoc) { setError('Please upload a requirement document first.'); return; }
    if (selectedFrameworks.length === 0) { setError('Please select at least one framework.'); return; }
    setAnalyzing(true);
    setError('');
    setResults(null);
    setExpandedQ(null);
    try {
      const MAX_DOC = 20000;
      const MAX_POLICY = 5000;
      const body = {
        docText: reqDoc.text.slice(0, MAX_DOC),
        selectedFrameworks,
        selectedPolicies: policyDocs.map(p => p.filename),
        policyTexts: policyDocs.map(p => ({ name: p.filename, text: p.text.slice(0, MAX_POLICY) })),
        mode,
      };
      const r = await apiFetch('/api/analyze-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await safeJson(r);
      if (!r.ok) throw new Error(data.message || `Analysis failed (${r.status})`);
      setResults(data);
      setExpandedQ(0);
      setHistory(prev => [{
        id: Date.now(),
        date: new Date().toLocaleString(),
        reqDoc: reqDoc.filename,
        frameworks: selectedFrameworks,
        policies: policyDocs.map(p => p.filename),
        summary: data.summary,
        answers: data.answers,
      }, ...prev].slice(0, 20));
    } catch (e) {
      setError(e.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const tabs = [
    { id: 'analyze', label: '🔎 Analyze' },
    { id: 'frameworks', label: '📚 Frameworks' },
    { id: 'history', label: `🕒 History${history.length ? ` (${history.length})` : ''}` },
  ];

  return (
    <div style={S.app}>

      {/* ── Header ── */}
      <div style={S.header}>
        <span style={{ fontSize: 24 }}>🌉</span>
        <div>
          <div style={S.headerTitle}>ControlBridge</div>
          <div style={S.headerSub}>AI-Powered Compliance Mapping</div>
        </div>
        <div style={S.tabBar}>
          {tabs.map(t => (
            <button key={t.id}
              onClick={() => { setTab(t.id); if (t.id === 'frameworks') loadFrameworks(); }}
              style={S.tabBtn(tab === t.id)}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={S.main}>

        {/* ── ANALYZE TAB ─────────────────────────────────────────────────── */}
        {tab === 'analyze' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ── Row 1: Upload cards ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

              {/* Requirement document */}
              <div style={S.card}>
                <div style={S.cardTitle}>📄 Requirement Document</div>
                <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>
                  Upload a document with compliance questions or requirements.
                  <br />
                  <span style={{ color: '#475569' }}>
                    Supported: PDF, DOCX, TXT, CSV,{' '}
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>XLSX / XLS</span>
                  </span>
                </p>
                <input ref={reqInputRef} type="file"
                  accept=".pdf,.docx,.txt,.csv,.xlsx,.xls"
                  style={{ display: 'none' }}
                  onChange={e => e.target.files[0] && uploadReqDoc(e.target.files[0])} />
                <button onClick={() => reqInputRef.current.click()}
                  disabled={reqUploading}
                  style={btnStyle('#3b82f6', reqUploading)}>
                  {reqUploading ? '⏳ Uploading…' : '📂 Upload Requirement Doc'}
                </button>
                {reqDoc && (
                  <div style={{ marginTop: 8, padding: '8px 10px', background: '#052e16', border: '1px solid #166534', borderRadius: 6, fontSize: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#86efac' }}>✅ <strong>{reqDoc.filename}</strong></span>
                      <button onClick={() => setReqDoc(null)}
                        style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>✕</button>
                    </div>
                    <div style={{ color: '#64748b', marginTop: 2 }}>
                      {reqDoc.text.length.toLocaleString()} chars · {reqDoc.parser?.toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              {/* Policy documents */}
              <div style={S.card}>
                <div style={S.cardTitle}>📋 Policy Documents</div>
                <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px', lineHeight: 1.5 }}>
                  Upload your organization's policies. The AI will reference these when answering.
                  <br />
                  <span style={{ color: '#475569' }}>
                    Supported: PDF, DOCX, TXT, CSV,{' '}
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>XLSX / XLS</span>
                  </span>
                </p>
                <input ref={policyInputRef} type="file"
                  accept=".pdf,.docx,.txt,.csv,.xlsx,.xls"
                  style={{ display: 'none' }}
                  onChange={e => e.target.files[0] && uploadPolicyDoc(e.target.files[0])} />
                <button onClick={() => policyInputRef.current.click()}
                  disabled={policyUploading}
                  style={btnStyle('#0891b2', policyUploading)}>
                  {policyUploading ? '⏳ Uploading…' : '➕ Add Policy Document'}
                </button>
                {policyDocs.length > 0 && (
                  <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {policyDocs.map((p, i) => (
                      <div key={i} style={{ padding: '6px 10px', background: '#0f172a', border: '1px solid #334155', borderRadius: 6, fontSize: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#94a3b8' }}>📄 {p.filename} <span style={{ color: '#475569' }}>({p.parser?.toUpperCase()})</span></span>
                        <button onClick={() => setPolicyDocs(prev => prev.filter((_, j) => j !== i))}
                          style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
                {policyDocs.length === 0 && (
                  <p style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>No policies uploaded — gaps will all be classified as Global.</p>
                )}
              </div>
            </div>

            {/* ── Row 2: Frameworks + Mode + Run ── */}
            <div style={{ ...S.card, display: 'flex', gap: 24, alignItems: 'flex-start', flexWrap: 'wrap' }}>

              {/* Frameworks */}
              <div style={{ flex: '1 1 300px' }}>
                <div style={S.cardTitle}>🏛️ Frameworks</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px' }}>
                  {['ISO 27001', 'NIST CSF 2.0', 'NIST 800-53', 'NIS2', 'GDPR', 'SOC 2'].map(fw => (
                    <label key={fw} style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, color: '#cbd5e1' }}>
                      <input type="checkbox" checked={selectedFrameworks.includes(fw)} onChange={() => toggleFramework(fw)}
                        style={{ accentColor: '#3b82f6', width: 15, height: 15 }} />
                      {fw}
                    </label>
                  ))}
                </div>
              </div>

              <div style={S.divider} />

              {/* Mode */}
              <div style={{ minWidth: 160 }}>
                <div style={S.cardTitle}>⚙️ Mode</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['demo', 'ai'].map(m => (
                    <button key={m} onClick={() => setMode(m)}
                      style={{
                        padding: '7px 18px',
                        borderRadius: 7,
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 13,
                        background: mode === m ? '#7c3aed' : '#0f172a',
                        color: mode === m ? '#fff' : '#64748b',
                        transition: 'all 0.15s',
                      }}>
                      {m === 'demo' ? '🎭 Demo' : '🤖 AI'}
                    </button>
                  ))}
                </div>
                {mode === 'ai' && (
                  <p style={{ fontSize: 11, color: '#4ade80', marginTop: 6 }}>
                    ✅ MGA key configured
                  </p>
                )}
              </div>

              <div style={S.divider} />

              {/* Run button */}
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 160 }}>
                <button onClick={runAnalysis}
                  disabled={analyzing || !reqDoc || selectedFrameworks.length === 0}
                  style={{
                    background: analyzing || !reqDoc || selectedFrameworks.length === 0 ? '#1e293b' : '#16a34a',
                    color: analyzing || !reqDoc || selectedFrameworks.length === 0 ? '#475569' : '#fff',
                    border: analyzing || !reqDoc || selectedFrameworks.length === 0 ? '1px solid #334155' : 'none',
                    borderRadius: 8,
                    padding: '12px 24px',
                    cursor: analyzing || !reqDoc || selectedFrameworks.length === 0 ? 'not-allowed' : 'pointer',
                    fontWeight: 700,
                    fontSize: 15,
                    transition: 'opacity 0.15s',
                    whiteSpace: 'nowrap',
                  }}>
                  {analyzing ? '⏳ Analyzing…' : '▶ Run Analysis'}
                </button>
                {!reqDoc && (
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 5, textAlign: 'center' }}>Upload a doc first</div>
                )}
                {reqDoc && selectedFrameworks.length === 0 && (
                  <div style={{ fontSize: 11, color: '#475569', marginTop: 5, textAlign: 'center' }}>Select a framework</div>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={S.errorBox}>⚠️ {error}</div>
            )}

            {/* ── Row 3: Results ── */}
            {!results && !analyzing && (
              <div style={S.emptyState}>
                <div style={{ fontSize: 52, marginBottom: 14 }}>📋</div>
                <div style={{ fontSize: 17, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>Ready to analyze</div>
                <div style={{ fontSize: 13 }}>Upload a requirement document, select frameworks, and click Run Analysis.</div>
              </div>
            )}

            {analyzing && (
              <div style={{ ...S.emptyState, color: '#94a3b8' }}>
                <div style={{ fontSize: 44, marginBottom: 14 }}>⏳</div>
                <div style={{ fontSize: 17, fontWeight: 600 }}>Analyzing document…</div>
                <div style={{ fontSize: 13, marginTop: 8, color: '#475569' }}>Extracting questions and mapping to framework controls</div>
              </div>
            )}

            {results && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Summary bar */}
                <div style={{ ...S.card, display: 'flex', gap: 28, flexWrap: 'wrap' }}>
                  <Stat label="Questions Found" value={results.summary.total_questions} />
                  <Stat label="Controls Mapped" value={results.summary.total_controls_mapped} />
                  <Stat label="Avg Confidence" value={<ConfidenceBadge value={results.summary.average_confidence} />} />
                  <Stat label="Total Gaps" value={results.summary.total_gaps} color="#f87171" />
                  <Stat label="Frameworks" value={results.summary.frameworks_used.join(', ')} small />
                  {results.summary.policies_used.length > 0 && (
                    <Stat label="Policies" value={results.summary.policies_used.length + ' doc(s)'} small />
                  )}
                </div>

                {/* Per-question accordion */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {results.answers.map((ans, i) => (
                    <QuestionCard key={i} index={i} answer={ans}
                      hasPolicies={policyDocs.length > 0}
                      expanded={expandedQ === i}
                      onToggle={() => setExpandedQ(expandedQ === i ? null : i)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── FRAMEWORKS TAB ──────────────────────────────────────────────── */}
        {tab === 'frameworks' && (
          <div>
            <h2 style={{ color: '#f1f5f9', marginBottom: 20, fontSize: 18 }}>📚 Supported Frameworks</h2>
            {!frameworksLoaded && <p style={{ color: '#64748b' }}>Loading…</p>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
              {Object.entries(frameworks).map(([key, fw]) => (
                <div key={key} style={S.card}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#f1f5f9', marginBottom: 2 }}>{key}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{fw.name}</div>
                  <div style={{ fontSize: 12, color: '#38bdf8', fontWeight: 600 }}>{fw.controlCount} controls</div>
                  <div style={{ marginTop: 10, maxHeight: 150, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {Object.entries(fw.controls || {}).slice(0, 8).map(([cid, ctrl]) => (
                      <div key={cid} style={{ fontSize: 11, color: '#64748b' }}>
                        <span style={{ color: '#94a3b8', fontWeight: 600 }}>{cid}</span> — {ctrl.name}
                      </div>
                    ))}
                    {Object.keys(fw.controls || {}).length > 8 && (
                      <div style={{ fontSize: 11, color: '#475569' }}>…and {Object.keys(fw.controls).length - 8} more</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── HISTORY TAB ─────────────────────────────────────────────────── */}
        {tab === 'history' && (
          <div>
            <h2 style={{ color: '#f1f5f9', marginBottom: 20, fontSize: 18 }}>🕒 Analysis History</h2>
            {history.length === 0 && (
              <p style={{ color: '#475569' }}>No analyses run yet. Go to the Analyze tab to get started.</p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {history.map(h => (
                <div key={h.id} style={S.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 14 }}>📄 {h.reqDoc}</div>
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{h.date}</div>
                    </div>
                    <ConfidenceBadge value={h.summary.average_confidence} />
                  </div>
                  <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', fontSize: 12, color: '#64748b' }}>
                    <span>❓ {h.summary.total_questions} questions</span>
                    <span>🏛️ {h.frameworks.join(', ')}</span>
                    <span>🔗 {h.summary.total_controls_mapped} controls</span>
                    <span>⚠️ {h.summary.total_gaps} gaps</span>
                  </div>
                  {h.policies.length > 0 && (
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 6 }}>
                      Policies: {h.policies.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── QuestionCard ─────────────────────────────────────────────────────────────
function QuestionCard({ index, answer, expanded, onToggle, hasPolicies }) {
  const covered = (answer.matched_controls || []).filter(c => c.status === 'Covered').length;
  const partial = (answer.matched_controls || []).filter(c => c.status === 'Partial').length;
  const notCovered = (answer.matched_controls || []).filter(c => c.status === 'Not covered').length;

  const allGaps = answer.gaps || [];

  // ── Gap classification ────────────────────────────────────────────────────
  // LOCAL gaps  = gaps that reference a specific uploaded policy document
  //               (the gap text mentions a filename that was uploaded, OR
  //                contains policy/document/evidence/section keywords)
  // GLOBAL gaps = framework-level control deficiencies (no policy reference)
  //
  // When no policies are uploaded, ALL gaps are Global.
  const localGaps = hasPolicies
    ? allGaps.filter(g => {
        const gl = g.toLowerCase();
        return (
          gl.includes('policy') ||
          gl.includes('document') ||
          gl.includes('section') ||
          gl.includes('evidence') ||
          gl.includes('ref') ||
          gl.includes('procedure') ||
          gl.includes('record') ||
          gl.includes('documented')
        );
      })
    : [];
  const globalGaps = allGaps.filter(g => !localGaps.includes(g));

  return (
    <div style={{ background: '#1e293b', borderRadius: 10, overflow: 'hidden', border: '1px solid #334155', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
      {/* Header */}
      <button onClick={onToggle} style={{
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left',
      }}>
        <span style={{ color: '#475569', fontSize: 12, minWidth: 26, paddingTop: 2, fontWeight: 600 }}>Q{index + 1}</span>
        <span style={{ flex: 1, color: '#e2e8f0', fontSize: 13, fontWeight: 500, lineHeight: 1.5 }}>
          {answer.question}
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
          {answer.confidence != null && <ConfidenceBadge value={answer.confidence} />}
          <span style={{ color: '#475569', fontSize: 16 }}>{expanded ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Quick status pills */}
      {!expanded && (answer.matched_controls || []).length > 0 && (
        <div style={{ padding: '0 16px 10px 52px', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {covered > 0 && <Pill bg="#052e16" color="#4ade80" border="#166534">✓ {covered} covered</Pill>}
          {partial > 0 && <Pill bg="#422006" color="#fbbf24" border="#92400e">~ {partial} partial</Pill>}
          {notCovered > 0 && <Pill bg="#450a0a" color="#f87171" border="#7f1d1d">✗ {notCovered} gap</Pill>}
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid #0f172a' }}>

          {/* Draft answer */}
          {answer.draft_answer && (
            <div style={{ marginTop: 12 }}>
              <SectionLabel>Draft Answer</SectionLabel>
              <div style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#94a3b8', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                {answer.draft_answer.replace(/\*\*/g, '')}
              </div>
            </div>
          )}

          {/* Matched controls table */}
          {(answer.matched_controls || []).length > 0 && (
            <div style={{ marginTop: 14 }}>
              <SectionLabel>Mapped Controls ({answer.matched_controls.length})</SectionLabel>
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #334155' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <thead>
                    <tr style={{ background: '#0f172a' }}>
                      {['Framework', 'Control ID', 'Name', 'Status', 'Match %', 'Policy Ref'].map(h => (
                        <th key={h} style={{ padding: '7px 10px', textAlign: 'left', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap', borderBottom: '1px solid #334155' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {answer.matched_controls.map((c, i) => (
                      <tr key={i} style={{ borderTop: i > 0 ? '1px solid #1e293b' : 'none' }}>
                        <td style={{ padding: '6px 10px', color: '#64748b' }}>{c.framework || '—'}</td>
                        <td style={{ padding: '6px 10px', color: '#38bdf8', fontWeight: 600, whiteSpace: 'nowrap' }}>{c.id}</td>
                        <td style={{ padding: '6px 10px', color: '#cbd5e1' }}>{c.name}</td>
                        <td style={{ padding: '6px 10px' }}><StatusBadge status={c.status} /></td>
                        <td style={{ padding: '6px 10px', color: confColor(c.match_pct), fontWeight: 700 }}>{c.match_pct}%</td>
                        <td style={{ padding: '6px 10px', color: '#64748b' }}>{c.policy_ref !== 'N/A' ? `${c.policy_ref}${c.section && c.section !== 'N/A' ? ' § ' + c.section : ''}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── Gaps section ── */}
          {allGaps.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <SectionLabel>Gaps ({allGaps.length})</SectionLabel>

              {/* Legend */}
              <div style={{ display: 'flex', gap: 16, marginBottom: 10, fontSize: 11, color: '#64748b' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: '#7f1d1d', display: 'inline-block' }} />
                  🌐 <strong style={{ color: '#94a3b8' }}>Global</strong> — framework-level control deficiency
                </span>
                {hasPolicies && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: '#78350f', display: 'inline-block' }} />
                    📁 <strong style={{ color: '#94a3b8' }}>Local</strong> — missing evidence in uploaded policies
                  </span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>

                {/* Global gaps */}
                {globalGaps.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        🌐 Global Gaps ({globalGaps.length})
                      </span>
                      <span style={{ fontSize: 11, color: '#475569' }}>— framework-level control deficiencies</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {globalGaps.map((g, i) => (
                        <li key={i} style={{
                          fontSize: 12, color: '#fca5a5',
                          background: '#450a0a', border: '1px solid #7f1d1d',
                          borderRadius: 6, padding: '5px 10px',
                          display: 'flex', alignItems: 'flex-start', gap: 6,
                        }}>
                          <span style={{ marginTop: 1, flexShrink: 0 }}>⚠</span> {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Local gaps */}
                {localGaps.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        📁 Local Gaps ({localGaps.length})
                      </span>
                      <span style={{ fontSize: 11, color: '#475569' }}>— missing evidence in uploaded policies</span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {localGaps.map((g, i) => (
                        <li key={i} style={{
                          fontSize: 12, color: '#fde68a',
                          background: '#422006', border: '1px solid #92400e',
                          borderRadius: 6, padding: '5px 10px',
                          display: 'flex', alignItems: 'flex-start', gap: 6,
                        }}>
                          <span style={{ marginTop: 1, flexShrink: 0 }}>📌</span> {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* No policies uploaded — show all as global */}
                {!hasPolicies && globalGaps.length === 0 && allGaps.length > 0 && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#f87171', textTransform: 'uppercase', letterSpacing: 0.8 }}>
                        🌐 Global Gaps ({allGaps.length})
                      </span>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {allGaps.map((g, i) => (
                        <li key={i} style={{
                          fontSize: 12, color: '#fca5a5',
                          background: '#450a0a', border: '1px solid #7f1d1d',
                          borderRadius: 6, padding: '5px 10px',
                          display: 'flex', alignItems: 'flex-start', gap: 6,
                        }}>
                          <span style={{ marginTop: 1, flexShrink: 0 }}>⚠</span> {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{children}</div>
  );
}

function Pill({ bg, color, border, children }) {
  return (
    <span style={{ fontSize: 11, background: bg, color, border: `1px solid ${border || 'transparent'}`, borderRadius: 6, padding: '2px 8px', fontWeight: 600 }}>{children}</span>
  );
}

function Stat({ label, value, color, small }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: '#475569', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: small ? 13 : 20, fontWeight: 700, color: color || '#f1f5f9', marginTop: 2 }}>{value}</div>
    </div>
  );
}
