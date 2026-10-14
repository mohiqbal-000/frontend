import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: 'rgba(22,23,26,0.85)', backdropFilter: 'blur(6px)', position: 'sticky', top: 0, zIndex: 10 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <span className="ember-dot" />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 19, letterSpacing: '0.02em', color: 'var(--text)' }}>
            IDEA<span style={{ color: 'var(--ember)' }}>FORGE</span>
          </span>
        </Link>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link to="/dashboard" className="btn btn-ghost">Workshop Floor</Link>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--steel)' }}>{user.name}</span>
            <button className="btn btn-danger-ghost" onClick={() => { logout(); navigate('/login'); }}>
              Sign out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/login" className="btn btn-ghost">Sign in</Link>
            <Link to="/register" className="btn btn-primary">Start forging</Link>
          </div>
        )}
      </div>
    </header>
  );
}
