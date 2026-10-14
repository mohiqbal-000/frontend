import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function ShowcaseStation({ startupId, startupName }) {
  // --- Investor Pitch ---
  const [pitch, setPitch] = useState(null);
  const [pitchLoading, setPitchLoading] = useState(false);
  const [pitchError, setPitchError] = useState('');

  // --- Report export ---
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');

  useEffect(() => {
    client.get(`/pitch/${startupId}`).then(({ data }) => setPitch(data)).catch(() => {});
  }, [startupId]);

  const generatePitch = async () => {
    setPitchLoading(true);
    setPitchError('');
    try {
      const { data } = await client.post(`/pitch/${startupId}`);
      setPitch(data);
    } catch {
      setPitchError('Could not draft the pitch. Check GEMINI_API_KEY is set.');
    } finally {
      setPitchLoading(false);
    }
  };

  const downloadReport = async () => {
    setReportLoading(true);
    setReportError('');
    try {
      const response = await client.get(`/reports/${startupId}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      const safeName = (startupName || 'startup').toLowerCase().replace(/[^a-z0-9]+/g, '-');
      link.setAttribute('download', `${safeName}-plan.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setReportError('Could not generate the report PDF. Make sure at least one station has produced output.');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h3 style={{ fontSize: 20 }}>Investor Pitch</h3>
          <button className="btn btn-primary" onClick={generatePitch} disabled={pitchLoading}>
            {pitchLoading ? <span className="spinner" /> : pitch ? 'Re-draft' : 'Draft the pitch'}
          </button>
        </div>
        <p style={{ color: 'var(--steel)', fontSize: 13, marginBottom: 20 }}>An investor-ready narrative, built from everything forged so far.</p>

        {pitchError && <div className="error-text">{pitchError}</div>}

        {pitch && (
          <div className="strike-flash" style={{ display: 'grid', gap: 16 }}>
            {pitch.elevatorPitch && (
              <div className="station-card" style={{ borderColor: 'var(--ember-dim)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--spark)', textTransform: 'uppercase', marginBottom: 6 }}>Elevator Pitch</div>
                <p style={{ fontSize: 16, color: 'var(--text)', margin: 0, lineHeight: 1.5 }}>{pitch.elevatorPitch}</p>
              </div>
            )}
            <Field label="Problem" value={pitch.problemStatement} />
            <Field label="Solution" value={pitch.solution} />
            <Field label="Market opportunity" value={pitch.marketOpportunity} />
            <Field label="Business model summary" value={pitch.businessModelSummary} />
            <Field label="Ask & use of funds" value={pitch.askAndUseOfFunds} />
          </div>
        )}
      </section>

      <section className="panel" style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: 20, marginBottom: 4 }}>Seal the Plan</h3>
        <p style={{ color: 'var(--steel)', fontSize: 13, marginBottom: 20, maxWidth: 440, marginLeft: 'auto', marginRight: 'auto' }}>
          Compiles every station's output — validation, canvas, competitors, financials, MVP, and pitch — into one PDF.
        </p>
        <button className="btn btn-primary" onClick={downloadReport} disabled={reportLoading} style={{ padding: '13px 28px' }}>
          {reportLoading ? <span className="spinner" /> : 'Download investor plan (PDF)'}
        </button>
        {reportError && <div className="error-text" style={{ marginTop: 12 }}>{reportError}</div>}
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
