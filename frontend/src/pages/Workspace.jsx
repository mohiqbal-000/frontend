import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../api/client';
import ForgeStation from '../components/stations/ForgeStation';
import BlueprintStation from '../components/stations/BlueprintStation';
import LedgerStation from '../components/stations/LedgerStation';
import ShowcaseStation from '../components/stations/ShowcaseStation';

const STATIONS = [
  { key: 'forge', label: 'The Forge', hint: 'Idea & Validation' },
  { key: 'blueprint', label: 'The Blueprint', hint: 'Business Model & Competitors' },
  { key: 'ledger', label: 'The Ledger', hint: 'Financials & MVP' },
  { key: 'showcase', label: 'The Showcase', hint: 'Pitch & Report' },
];

export default function Workspace() {
  const { id } = useParams();
  const [startup, setStartup] = useState(null);
  const [active, setActive] = useState('forge');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get(`/startups/${id}`)
      .then(({ data }) => setStartup(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main className="container" style={{ paddingTop: 48 }}><span style={{ color: 'var(--steel)' }}>Loading workspace…</span></main>;
  if (!startup) return <main className="container" style={{ paddingTop: 48 }}><span className="error-text">Startup not found.</span></main>;

  return (
    <main className="container" style={{ paddingTop: 40, paddingBottom: 100 }}>
      <div style={{ marginBottom: 32 }}>
        {startup.industry && <span className="badge">{startup.industry}</span>}
        <h1 style={{ fontSize: 34, marginTop: 12 }}>{startup.name}</h1>
        <p style={{ color: 'var(--text-dim)', maxWidth: 640, marginTop: 8 }}>{startup.description}</p>
      </div>

      <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border)', marginBottom: 32, overflowX: 'auto' }}>
        {STATIONS.map((s) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className="btn"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: active === s.key ? '2px solid var(--ember)' : '2px solid transparent',
              borderRadius: 0,
              padding: '14px 16px',
              color: active === s.key ? 'var(--text)' : 'var(--steel)',
              flexDirection: 'column',
              gap: 2,
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: '0.03em' }}>{s.label}</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--steel)' }}>{s.hint}</span>
          </button>
        ))}
      </div>

      {active === 'forge' && <ForgeStation startupId={startup.id} />}
      {active === 'blueprint' && <BlueprintStation startupId={startup.id} />}
      {active === 'ledger' && <LedgerStation startupId={startup.id} />}
      {active === 'showcase' && <ShowcaseStation startupId={startup.id} startupName={startup.name} />}
    </main>
  );
}
