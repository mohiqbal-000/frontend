import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';

export default function Dashboard() {
  const [startups, setStartups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', industry: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await client.get('/startups');
      setStartups(data);
    } catch {
      setError('Could not load your startups.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await client.post('/startups', form);
      setForm({ name: '', industry: '', description: '' });
      setShowForm(false);
      await load();
    } catch {
      setError('Could not create the startup. Check the fields and try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="container" style={{ paddingTop: 48, paddingBottom: 80 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div className="eyebrow">Workshop Floor</div>
          <h1 style={{ fontSize: 32, marginTop: 8 }}>Your startups</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? 'Cancel' : '+ New startup'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="panel" style={{ marginBottom: 28 }}>
          <div className="field">
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field">
            <label>Industry</label>
            <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} placeholder="e.g. Fintech, Healthtech, EdTech" />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What problem does this solve, and for whom?" />
          </div>
          {error && <div className="error-text">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? <span className="spinner" /> : 'Place on the bench'}
          </button>
        </form>
      )}

      {loading ? (
        <div style={{ color: 'var(--steel)' }}>Loading…</div>
      ) : startups.length === 0 ? (
        <div className="panel" style={{ textAlign: 'center', padding: 48 }}>
          <p style={{ color: 'var(--text-dim)' }}>Nothing on the bench yet. Add a startup to begin working through the stations.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {startups.map((s) => (
            <Link to={`/startup/${s.id}`} key={s.id} className="station-card" style={{ textDecoration: 'none', display: 'block' }}>
              {s.industry && <span className="badge" style={{ marginBottom: 12, display: 'inline-block' }}>{s.industry}</span>}
              <h3 style={{ fontSize: 18, marginBottom: 8, color: 'var(--text)' }}>{s.name}</h3>
              <p style={{ color: 'var(--text-dim)', fontSize: 13, lineHeight: 1.5, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {s.description || 'No description yet.'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
