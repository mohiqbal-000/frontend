import { useEffect, useState } from 'react';
import client from '../../api/client';

export default function LedgerStation({ startupId }) {
  // --- Financial Plan ---
  const [plan, setPlan] = useState(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState('');

  // --- MVP Roadmap ---
  const [mvp, setMvp] = useState(null);
  const [mvpLoading, setMvpLoading] = useState(false);
  const [mvpError, setMvpError] = useState('');

  useEffect(() => {
    client.get(`/financial-plan/${startupId}`).then(({ data }) => setPlan(data)).catch(() => {});
    client.get(`/mvp-plan/${startupId}`).then(({ data }) => setMvp(data)).catch(() => {});
  }, [startupId]);

  const generatePlan = async () => {
    setPlanLoading(true);
    setPlanError('');
    try {
      const { data } = await client.post(`/financial-plan/${startupId}`);
      setPlan(data);
    } catch {
      setPlanError('Could not draw up the financials. Check GEMINI_API_KEY is set.');
    } finally {
      setPlanLoading(false);
    }
  };

  const generateMvp = async () => {
    setMvpLoading(true);
    setMvpError('');
    try {
      const { data } = await client.post(`/mvp-plan/${startupId}`);
      setMvp(data);
    } catch {
      setMvpError('Could not draft the MVP roadmap. Check GEMINI_API_KEY is set.');
    } finally {
      setMvpLoading(false);
    }
  };

  let projection = [];
  try { projection = plan ? JSON.parse(plan.revenueProjection) : []; } catch { /* ignore */ }

  let milestones = [];
  try { milestones = mvp ? JSON.parse(mvp.milestones) : []; } catch { /* ignore */ }

  const money = (n) => typeof n === 'number' ? `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : n;

  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h3 style={{ fontSize: 20 }}>Financial Plan</h3>
          <button className="btn btn-primary" onClick={generatePlan} disabled={planLoading}>
            {planLoading ? <span className="spinner" /> : plan ? 'Re-forecast' : 'Draw up the ledger'}
          </button>
        </div>
        <p style={{ color: 'var(--steel)', fontSize: 13, marginBottom: 20 }}>A 12-month cost, revenue, and break-even estimate.</p>

        {planError && <div className="error-text">{planError}</div>}

        {plan && (
          <div className="strike-flash" style={{ display: 'grid', gap: 20 }}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              <Stat label="Startup Cost" value={money(plan.estimatedStartupCost)} />
              <Stat label="Funding Needed" value={money(plan.fundingNeeded)} />
              <Stat label="Break-Even" value={`Month ${plan.breakEvenMonth}`} />
            </div>

            {projection.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Revenue</th>
                      <th>Expenses</th>
                      <th>Net</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projection.map((row) => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{money(row.revenue)}</td>
                        <td>{money(row.expenses)}</td>
                        <td style={{ color: (row.revenue - row.expenses) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                          {money(row.revenue - row.expenses)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <Field label="Assumptions" value={plan.assumptions} />
          </div>
        )}
      </section>

      <section className="panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <h3 style={{ fontSize: 20 }}>MVP Roadmap</h3>
          <button className="btn btn-primary" onClick={generateMvp} disabled={mvpLoading}>
            {mvpLoading ? <span className="spinner" /> : mvp ? 'Re-plan' : 'Plan the build'}
          </button>
        </div>
        <p style={{ color: 'var(--steel)', fontSize: 13, marginBottom: 20 }}>Core features, tech stack, and milestones for a small team.</p>

        {mvpError && <div className="error-text">{mvpError}</div>}

        {mvp && (
          <div className="strike-flash" style={{ display: 'grid', gap: 16 }}>
            {mvp.estimatedTimeline && <span className="badge">{mvp.estimatedTimeline}</span>}
            <Field label="Core features" value={mvp.coreFeatures} />
            <Field label="Recommended tech stack" value={mvp.recommendedTechStack} />

            {milestones.length > 0 && (
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ember)', textTransform: 'uppercase', marginBottom: 10 }}>Milestones</div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {milestones.map((m, i) => (
                    <div key={i} className="station-card" style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>{m.phase}</div>
                        <div style={{ fontSize: 13, color: 'var(--text-dim)' }}>{m.deliverable}</div>
                      </div>
                      <span className="badge">{m.duration}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--steel)', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--spark)' }}>{value}</div>
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
