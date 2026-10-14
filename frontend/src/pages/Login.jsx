import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not sign in. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ maxWidth: 420, paddingTop: 80 }}>
      <div className="eyebrow">Welcome back</div>
      <h1 style={{ fontSize: 32, marginTop: 10, marginBottom: 28 }}>Sign in to the workshop</h1>

      <form onSubmit={handleSubmit} className="panel">
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <div className="error-text">{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', marginTop: 8 }}>
          {loading ? <span className="spinner" /> : 'Sign in'}
        </button>
      </form>

      <p style={{ color: 'var(--steel)', fontSize: 14, marginTop: 20 }}>
        New here? <Link to="/register" style={{ color: 'var(--ember)' }}>Create an account</Link>
      </p>
    </main>
  );
}
