import { Link } from 'react-router-dom';

const STATIONS = [
  { name: 'The Forge', desc: 'Raw interests go in, validated startup ideas come out — heated, hammered, tested for feasibility.' },
  { name: 'The Blueprint', desc: 'Business model canvas and competitor landscape, mapped before you lay a single brick.' },
  { name: 'The Ledger', desc: 'A 12-month financial estimate and an MVP roadmap your team can actually build.' },
  { name: 'The Showcase', desc: 'An investor pitch narrative, sealed into a single downloadable plan.' },
];

export default function Landing() {
  return (
    <main>
      <section className="container" style={{ paddingTop: 96, paddingBottom: 64 }}>
        <div className="eyebrow">AI-Assisted Startup Incubator</div>
        <h1 style={{ fontSize: 'clamp(40px, 6vw, 72px)', lineHeight: 1.02, marginTop: 14, maxWidth: 780 }}>
          Raw ideas in.<br />
          <span style={{ color: 'var(--ember)' }}>Investor-ready plans out.</span>
        </h1>
        <p style={{ color: 'var(--text-dim)', fontSize: 18, maxWidth: 560, marginTop: 20, lineHeight: 1.6 }}>
          IdeaForge takes a founder from a vague interest to a validated idea,
          a business model, a financial plan, and a pitch — worked through four
          stations on the workshop floor, each powered by AI.
        </p>
        <div style={{ display: 'flex', gap: 14, marginTop: 32 }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '13px 28px', fontSize: 15 }}>
            Enter the workshop
          </Link>
          <Link to="/login" className="btn btn-ghost" style={{ padding: '13px 28px', fontSize: 15 }}>
            Sign in
          </Link>
        </div>
      </section>

      <section className="container" style={{ paddingBottom: 100 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', color: 'var(--steel)', marginBottom: 20, textTransform: 'uppercase' }}>
          The Workshop Floor
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {STATIONS.map((s, i) => (
            <div key={s.name} className="station-card">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ember)', marginBottom: 10 }}>
                STATION {String(i + 1).padStart(2, '0')}
              </div>
              <h3 style={{ fontSize: 20, marginBottom: 10 }}>{s.name}</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: 14, lineHeight: 1.55, margin: 0 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
