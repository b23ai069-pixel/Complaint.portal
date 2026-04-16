import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // ✅ clear old errors

    try {
      const userData = await login(email, password);

      // ✅ IMPORTANT: check if userData exists
      if (!userData) {
        setError("Invalid login response");
        return;
      }

      // ✅ Redirect properly
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (err) {
      console.error(err); // ✅ helps debugging

      // ✅ safer error handling
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Login failed'
      );
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-card auth-card">
        <h2 className="title" style={{ fontSize: '2rem' }}>Welcome Back</h2>
        <p className="subtitle" style={{ marginBottom: '2rem' }}>Please enter your credentials.</p>
        
        {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              className="form-input" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Login
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Register here</Link>
        </p>

        <p style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Are you an Admin? <Link to="/admin-login" style={{ color: 'var(--primary-color)', textDecoration: 'none' }}>Admin Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
