import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Landing() {
  const [trackId, setTrackId] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [mode, setMode] = useState('trackId');

  const handleTrack = async (e) => {
    e.preventDefault();
    setTrackError('');
    setTrackResult(null);

    // ✅ prevent empty input
    if (!trackId.trim()) {
      setTrackError(mode === 'email' ? 'Enter email' : 'Enter tracking ID');
      return;
    }

    try {
      let res;

      // ✅ DIFFERENT API BASED ON MODE
      if (mode === 'trackId') {
        res = await axios.get(
          `http://localhost:5000/api/complaints/track/${trackId}`
        );
      } else {
        res = await axios.get(
          `http://localhost:5000/api/complaints/by-email/${trackId}`
        );
      }

      // ✅ HANDLE BOTH ARRAY & SINGLE OBJECT
      const data =
        res.data.complaints ||
        (res.data.complaint ? [res.data.complaint] : []);

      if (data.length === 0) {
        setTrackError('No complaints found.');
      } else {
        setTrackResult(data);
      }

    } catch (err) {
      console.error(err);

      setTrackError(
        err?.response?.data?.message ||
        'Complaint not found.'
      );
    }
  };

  return (
    <div className="landing-container" style={{ textAlign: 'center', marginTop: '5vh' }}>
      <h1 className="title">Official Complaint Registration Portal</h1>
      <p className="subtitle" style={{ maxWidth: '600px', margin: '1rem auto 2rem auto' }}>
        A secure and streamlined system to register your complaints and track their resolution status in real-time.
      </p>
      
      <div className="glass-card" style={{ maxWidth: '400px', margin: '0 auto 2rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <Link to="/login" className="btn btn-primary">Login to your Account</Link>
        <Link to="/register" className="btn btn-secondary">Register a New Account</Link>
      </div>

      <div className="glass-card" style={{ maxWidth: '400px', margin: '0 auto', textAlign: 'left' }}>
        <h3 style={{ marginBottom: '1rem', marginTop: 0 }}>
          {mode === 'email' ? 'Retrieve Tracking ID via Email' : 'Track Your Complaint'}
        </h3>
        
        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '0.5rem' }}>
          <input 
            type={mode === 'email' ? 'email' : 'text'} 
            className="form-input" 
            placeholder={mode === 'email' ? "Enter your registered email..." : "Enter Tracking ID (e.g. CP-XYZ123)"}
            value={trackId}
            onChange={e => setTrackId(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
            {mode === 'email' ? 'Retrieve' : 'Track'}
          </button>
        </form>

        <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
          {mode === 'trackId' ? (
            <span 
              style={{ fontSize: '0.8rem', color: 'var(--primary-color)', cursor: 'pointer' }}
              onClick={() => { setMode('email'); setTrackId(''); setTrackResult(null); setTrackError(''); }}
            >
              Forgot Tracking ID?
            </span>
          ) : (
            <span 
              style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={() => { setMode('trackId'); setTrackId(''); setTrackResult(null); setTrackError(''); }}
            >
              Back to Track by ID
            </span>
          )}
        </div>
        
        {trackError && <p style={{ color: '#ef4444', fontSize: '0.9rem', marginTop: '1rem' }}>{trackError}</p>}
        
        {trackResult && (
          <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
            {trackResult.map(result => (
              <div key={result.trackingId} style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0' }}>{result.title}</h4>
                  <span style={{ color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 'bold' }}>{result.trackingId}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Submitted on {new Date(result.createdAt).toLocaleDateString()}
                </p>
                <span className={`status-badge status-${result.status.toLowerCase().replace(' ', '')}`}>
                  {result.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Landing;

