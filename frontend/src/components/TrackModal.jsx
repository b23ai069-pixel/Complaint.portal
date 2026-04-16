import React, { useState } from 'react';
import axios from 'axios';

function TrackModal({ isOpen, onClose }) {
  const [trackId, setTrackId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/complaints/track/${trackId}`);
      setResult(res.data);
    } catch (err) {
      setError('Complaint not found.');
    }
  };

  const handleClose = () => {
    setTrackId('');
    setResult(null);
    setError('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      backgroundColor: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)', display: 'flex', 
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', margin: '1rem', position: 'relative' }}>
        <button 
          onClick={handleClose} 
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1 }}
        >
          &times;
        </button>
        <h3 style={{ marginTop: 0, fontSize: '1.4rem' }}>Track Complaint</h3>
        <form onSubmit={handleTrack} style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Enter Tracking ID..."
            value={trackId}
            onChange={e => setTrackId(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem 1rem' }}>Track</button>
        </form>

        {error && <p style={{ color: '#ef4444', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</p>}
        
        {result && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <h4 style={{ margin: '0 0 0.8rem 0', color: '#fff', fontSize: '1.1rem' }}>{result.title}</h4>
            <span className={`status-badge status-${result.status.toLowerCase().replace(' ', '')}`}>
              {result.status}
            </span>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.8rem' }}>
              Submitted on {new Date(result.createdAt).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TrackModal;
