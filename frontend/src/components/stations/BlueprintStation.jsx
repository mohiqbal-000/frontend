import { useEffect, useState } from 'react';
import client from '../../api/client';

const BMC_BLOCKS = [
  ['keyPartners', 'Key Partners'],
  ['keyActivities', 'Key Activities'],
  ['keyResources', 'Key Resources'],
  ['valuePropositions', 'Value Propositions'],
  ['customerRelationships', 'Customer Relationships'],
  ['channels', 'Channels'],
  ['customerSegments', 'Customer Segments'],
  ['costStructure', 'Cost Structure'],
  ['revenueStreams', 'Revenue Streams'],
];

export default function BlueprintStation({ startupId }) {
  const [canvas, setCanvas] = useState(null);
  const [canvasLoading, setCanvasLoading] = useState(false);
  const [canvasError, setCanvasError] = useState('');

  const [competitors, setCompetitors] = useState(null);
  const [compLoading, setCompLoading] = useState(false);
  const [compError, setCompError] = useState('');

  useEffect(() => {
    client.get(`/business-model/${startupId}`).then(({ data }) => setCanvas(data)).catch(() => {});
    client.get(`/competitors/${startupId}`).then(({ data }) => setCompetitors(data)).catch(() => {});
  }, [startupId]);

  const generateCanvas = async () => {
    setCanvasLoading(true);
    setCanvasError('');
    try {
      const { data } = await client.post(`/business-model/${startupId}`);
      setCanvas(data);
    } catch {
      setCanvasError('Could not draft the canvas. Check GEMINI_API_KEY is set.');
    } finally {
      setCanvasLoading(false);
    }
  };

  const generateCompetitors = async () => {
    setCompLoading(true);
    setCompError('');
    try {
      const { data } = await client.post(`/competitors/${startupId}`);
      setCompetitors(data);
    } catch {
      setCompError('Could not scout competitors. Check GEMINI_API_KEY is set.');
    } finally {
      setCompLoading(false);
    }
  };

  let competitorList = [];
  try { competitorList = competitors ? JSON.parse(competitors.competitors) : []; } catch { /* ignore */ }

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h3 style={{ fontSize: 20 }}>Business Model Canvas</h3>
          <button className="btn btn-primary" onClick={generateCanvas} disabled={canvasLoading}>
            {canvasLoading ? <span className="spinner" /> : canvas ? 'Redraft' : 'Draft canvas'}
          </button>
        </div>
        <p style={{ color: 'var(--steel)', fontSize: 13, marginBottom: 20 }}>Osterwalder's 9-block canvas, generated from this startup's profile.</p>

        {canvasError && <div className="error-text">{canvasError}</div>}

        {canvas && (
          <div className="strike-flash" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
            {BMC_BLOCKS.map(([key, label]) => (
              canvas[key] ? (
                <div key={key} className="station-card">
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ember)', textTransform: 'uppercase', marginBottom: 6 }}>{label}</div>
                  <p style={{ fontSize: 13, color: 'var(--text-dim)', whiteSpace: 'pre-line', margin: 0, lineHeight: 1.5 }}>{canvas[key]}</p>
                </div>
              ) : null
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h3 style={{ fontSize: 20 }}>Competitor Analysis</h3>
          <button className="btn btn-primary" onClick={generateCompetitors} disabled={compLoading}>
            {compLoading ? <span className="spinner" /> : competitors ? 'Re-scout' : 'Scout competitors'}
          </button>
        </div>
        <p style={{ color: 'var(--steel)', fontSize: 13, marginBottom: 20 }}>Who else is in this space, and how to stand apart.</p>

        {compError && <div className="error-text">{compError}</div>}

        {competitors && (
          <div className="strike-flash" style={{ display: 'grid', gap: 16 }}>
            {competitorList.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                {competitorList.map((c, i) => (
                  <div key={i} className="station-card">
                    <h4 style={{ fontSize: 15, color: 'var(--spark)', marginBottom: 8 }}>{c.name}</h4>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 4 }}><strong>Strengths:</strong> {c.strengths}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}><strong>Weaknesses:</strong> {c.weaknesses}</div>
                  </div>
                ))}
              </div>
            )}
            <Field label="Market position" value={competitors.marketPosition} />
            <Field label="Differentiation strategy" value={competitors.differentiationStrategy} />
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ember)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-line', margin: 0 }}>{value}</p>
    </div>
  );
}
