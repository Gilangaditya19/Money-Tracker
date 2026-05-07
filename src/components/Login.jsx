import { useState } from 'react';
import { api } from '../services/api';

function Login({ onLogin, onNavigateRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await api.login(email, password);

    if (res.status === 'success') {
      onLogin({ user_id: res.user_id, username: res.username });
    } else {
      setError(res.message || 'Login gagal. Periksa koneksi.');
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <div className="panel animate-fade-in" style={styles.card}>
        <h1 style={{ color: 'var(--neon-green)', marginBottom: '0.5rem' }}>MONEY TRACKER</h1>
        <p className="text-secondary" style={{ marginBottom: '2rem' }}>Masuk untuk mengakses dashboard.</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gilang@gmail.com"
              required
            />
          </div>
          <div className="input-group" style={{ marginBottom: '2rem' }}>
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'MEMPROSES...' : 'MASUK'}
          </button>
        </form>

        <div style={styles.footer}>
          <p className="text-secondary" style={{ fontSize: '0.85rem' }}>
            Belum punya akun? <span style={styles.link} onClick={onNavigateRegister}>Daftar Sekarang</span>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
  },
  card: {
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
  },
  error: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    color: '#ff4444',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    border: '1px solid rgba(255, 0, 0, 0.3)'
  },
  footer: {
    marginTop: '1.5rem',
  },
  link: {
    color: 'var(--neon-green)',
    cursor: 'pointer',
    fontWeight: '600'
  }
};

export default Login;
