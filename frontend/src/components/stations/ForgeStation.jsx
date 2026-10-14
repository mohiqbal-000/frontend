import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function ForgeStation({ startupId }) {
  // --- Idea generator (general brainstorming, not tied to a specific startup) ---
  const [ideaForm, setIdeaForm] = useState({ interests: '', problemArea: '', targetMarket: '' });
  const [ideas, setIdeas] = useState([]);
  const [ideaLoading, setIdeaLoading] = useState(false);
  const [ideaError, setIdeaError] = useState('');

  const generateIdeas = async (e) => {
    e.preventDefault();
    setIdeaLoading(true);
    setIdeaError('');
    try {
      const { data } = await client.post('/ideas/generate', ideaForm);
      setIdeas(data);
    } catch {
      setIdeaError('The forge went cold — could not generate ideas. Check GEMINI_API_KEY is set.');
    } finally {
      setIdeaLoading(false);
    }
  };

  // --- Validation (tied to this startup's description) ---
  const [validation, setValidation] = useState(null);
  const [valLoading, setValLoading] = useState(false);
  const [valError, setValError] = useState('');

  useEffect(() => {
    client.get(`/validation/${startupId}`)
      .then(({ data }) => setValidation(data))
      .catch(() => {});
  }, [startupId]);

  const runValidation = async () => {
    setValLoading(true);
    setValError('');
    try {
      const { data } = await client.post(`/validation/${startupId}`);
      setValidation(data);
    } catch {
      setValError('Could not validate this startup. Check GEMINI_API_KEY is set.');
    } finally {
      setValLoading(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <section className="panel">
        <h3 style={{ fontSize: 20, marginBottom: 4 }}>Idea Generator</h3>
        <p style={{ color: 'var(--steel)', fontSize: 13, marginBottom: 20 }}>Feed the forge your interests — get 3 startup ideas back.</p>

        <form onSubmit={generateIdeas}>
          <div className="field">
            <label>Interests *</label>
            <input
              value={ideaForm.interests}
              onChange={(e) => setIdeaForm({ ...ideaForm, interests: e.target.value })}
              placeholder="e.g. climate tech, creator economy"
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="field">
              <label>Problem area</label>
              <input
                value={ideaForm.problemArea}
                onChange={(e) => setIdeaForm({ ...ideaForm, problemArea: e.target.value })}
                placeholder="Optional"
              />
            </div>
            <div className="field">
              <label>Target market</label>
              <input
                value={ideaForm.targetMarket}
                onChange={(e) => setIdeaForm({ ...ideaForm, targetMarket: e.target.value })}
                placeholder="Optional"
              />
            </div>
          </div>
          {ideaError && <div className="error-text">{ideaError}</div>}
          <button className="btn btn-primary" type="submit" disabled={ideaLoading}>
            {ideaLoading ? <span className="spinner" /> : 'Strike the forge'}
          </button>
        </form>

        {ideas.length > 0 && (
          <div className="strike-flash" style={{ display: 'grid', gap: 12, marginTop: 24 }}>
            {ideas.map((idea) => (
              <div key={idea.id} className="station-card">
                <h4 style={{ fontSize: 16, marginBottom: 8, color: 'var(--spark)' }}>{idea.title}</h4>
                <p style={{ color: 'var(--text-dim)', fontSize: 13, marginBottom: 8 }}>{idea.description}</p>
                <div style={{ fontSize: 12, color: 'var(--steel)' }}><strong>Audience:</strong> {idea.targetAudience}</div>
                <div style={{ fontSize: 12, color: 'var(--steel)' }}><strong>Edge:</strong> {idea.uniqueValueProposition}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h3 style={{ fontSize: 20 }}>Validation</h3>
          <button className="btn btn-primary" onClick={runValidation} disabled={valLoading}>
            {valLoading ? <span className="spinner" /> : validation ? 'Re-validate' : 'Test on the anvil'}
          </button>
        </div>
        <p style={{ color: 'var(--steel)', fontSize: 13, marginBottom: 20 }}>Hammer-test this startup's description for feasibility.</p>

        {valError && <div className="error-text">{valError}</div>}

        {validation && (
          <div className="strike-flash" style={{ display: 'grid', gap: 16 }}>
            <div>
              <span className="badge" style={{ fontSize: 13 }}>Feasibility {validation.feasibilityScore} / 100</span>
            </div>
            <Field label="Market size analysis" value={validation.marketSizeAnalysis} />
            <Field label="Key risks" value={validation.risks} />
            <Field label="Recommendations" value={validation.recommendations} />
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
