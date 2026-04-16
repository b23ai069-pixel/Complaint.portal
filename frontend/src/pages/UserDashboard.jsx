import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TrackModal from '../components/TrackModal';

function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [isTrackModalOpen, setIsTrackModalOpen] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('/api/complaints');
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to fetch complaints', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/complaints', { title, description });
      setComplaints([res.data, ...complaints]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Failed to submit complaint', err);
    }
  };

  const getStatusClass = (status) => {
    if (status === 'Pending') return 'status-pending';
    if (status === 'In Progress') return 'status-progress';
    if (status === 'Resolved') return 'status-resolved';
    return '';
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">Complaint Portal</div>
        <div className="nav-links">
          <span className="user-info">Logged in as {user?.name} (User)</span>
          {user?.role === 'admin' && (
            <button onClick={() => navigate('/admin')} className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>
              Admin View
            </button>
          )}
          <button onClick={() => setIsTrackModalOpen(true)} className="btn btn-primary" style={{ padding: '0.4rem 1rem' }}>Track Complaint</button>
          <button onClick={logout} className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>Logout</button>
        </div>
      </nav>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        
        <div className="glass-card">
          <h2 className="title" style={{ fontSize: '1.5rem' }}>File New Complaint</h2>
          <form onSubmit={handleSubmit} style={{ marginTop: '1.5rem' }}>
            <div className="form-group">
              <label>Title</label>
              <input 
                type="text" 
                className="form-input" 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                required 
                placeholder="Brief summary..."
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea 
                className="form-input" 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                required 
                placeholder="Detailed description of your issue..."
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Submit Complaint</button>
          </form>
        </div>

        <div className="glass-card">
          <h2 className="title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Complaints</h2>
          {loading ? (
             <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
          ) : complaints.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>You haven't filed any complaints yet.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Tracking ID</th>
                    <th>Date</th>
                    <th>Title</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map(c => (
                    <tr key={c._id}>
                      <td><strong style={{ color: 'var(--primary-color)' }}>{c.trackingId}</strong></td>
                      <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td>
                        <strong>{c.title}</strong>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          {c.description.substring(0, 50)}{c.description.length > 50 ? '...' : ''}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusClass(c.status)}`}>{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <TrackModal isOpen={isTrackModalOpen} onClose={() => setIsTrackModalOpen(false)} />
    </>
  );
}

export default UserDashboard;
